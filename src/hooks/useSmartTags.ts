import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { generateTagId } from '@/lib/tagUtils';

export type TagType = 'pet' | 'plant';
export type TagStatus = 'draft' | 'ready' | 'coming_soon' | 'active';

export interface SmartTag {
  id: string;
  user_id: string;
  tag_id: string;
  tag_type: TagType;
  name: string;
  status: TagStatus;
  pet_id: string | null;
  plant_id: string | null;
  tag_details: Record<string, unknown>;
  visibility: Record<string, boolean>;
  owner_info: Record<string, string>;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SmartTagInsert {
  /** Explicit ID (e.g. a pre-existing PZ-000001). Generated only when omitted. */
  tag_id?: string;
  tag_type: TagType;
  name: string;
  status?: TagStatus;
  pet_id?: string | null;
  plant_id?: string | null;
  tag_details?: Record<string, unknown>;
  visibility?: Record<string, boolean>;
  owner_info?: Record<string, string>;
  photo_url?: string | null;
}

const STORAGE_KEY = 'petziqq_smart_tags';

function loadLocal(): SmartTag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SmartTag[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(tags: SmartTag[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  } catch {
    // Storage unavailable — database remains the source of truth.
  }
}

/** Turn a raw Postgres/PostgREST error into something actionable. */
function describeError(message: string): string {
  if (/relation .* does not exist|Could not find the table|schema cache/i.test(message)) {
    return 'Smart Tag storage is not set up in Supabase yet. Apply supabase/migrations/20260919000000_smart_tag_storage.sql to the project, then try again.';
  }
  if (/row-level security|violates row-level|permission denied/i.test(message)) {
    return 'Supabase rejected the write (row-level security). Sign in again and confirm the Smart Tag policies are applied.';
  }
  if (/duplicate key|already exists/i.test(message)) {
    return 'That Smart Tag ID is already in use. Existing tag IDs and QR mappings are never reused.';
  }
  return message;
}

function tagsPublicUrl(tagId: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/#/tag/${tagId}`;
}

export function useSmartTags() {
  const { session } = useAuth();
  const [tags, setTags] = useState<SmartTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const migratingRef = useRef(false);

  const fetchTags = useCallback(async (): Promise<SmartTag[] | null> => {
    if (!session) {
      setTags([]);
      setLoading(false);
      return null;
    }

    try {
      const userId = session.user.id;
      const { data, error: err } = await supabase
        .from('smart_tags')
        .select('*')
        .or(`user_id.eq.${userId},owner_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (err) {
        setError(describeError(err.message));
        setTags([]);
        return null;
      }

      const rows = (data ?? []) as SmartTag[];
      setTags(rows);
      setError(null);
      return rows;
    } catch (e) {
      setError(describeError(e instanceof Error ? e.message : 'Could not load Smart Tags.'));
      setTags([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  /**
   * Move any Smart Tags that were previously kept only in localStorage into the
   * database. Existing tag IDs (and therefore QR mappings) are carried over
   * verbatim — nothing is regenerated, so PZ-000001 stays PZ-000001.
   */
  const migrateLocalTags = useCallback(
    async (dbTags: SmartTag[]) => {
      if (!session || migratingRef.current) return;
      const userId = session.user.id;
      const local = loadLocal();
      const mine = local.filter((t) => t.user_id === userId);
      if (mine.length === 0) return;

      const inDb = new Set(dbTags.map((t) => t.tag_id));
      const pending = mine.filter((t) => t.tag_id && !inDb.has(t.tag_id));

      if (pending.length === 0) {
        // Everything is already in the database — drop the stale local copy.
        saveLocal(local.filter((t) => t.user_id !== userId));
        return;
      }

      migratingRef.current = true;
      const migrated: string[] = [];
      try {
        for (const t of pending) {
          const row: Record<string, unknown> = {
            tag_id: t.tag_id,
            name: t.name,
            tag_type: t.tag_type,
            status: t.status,
            pet_id: t.pet_id ?? null,
            plant_id: t.plant_id ?? null,
            tag_details: t.tag_details ?? {},
            visibility: t.visibility ?? {},
            owner_info: t.owner_info ?? {},
            photo_url: t.photo_url ?? null,
            qr_url: tagsPublicUrl(t.tag_id),
            user_id: userId,
            created_at: t.created_at,
            updated_at: t.updated_at,
          };

          let { error: insErr } = await supabase.from('smart_tags').insert(row);

          // A stale pet/plant reference must not block the tag itself moving over.
          if (insErr && /foreign key|violates foreign/i.test(insErr.message)) {
            row.pet_id = null;
            row.plant_id = null;
            ({ error: insErr } = await supabase.from('smart_tags').insert(row));
          }

          if (!insErr) migrated.push(t.tag_id);
        }
      } finally {
        migratingRef.current = false;
      }

      if (migrated.length > 0) {
        saveLocal(loadLocal().filter((t) => !(t.user_id === userId && migrated.includes(t.tag_id))));
        await fetchTags();
      }
    },
    [session, fetchTags],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const dbTags = await fetchTags();
      if (cancelled || dbTags === null) return;
      await migrateLocalTags(dbTags);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchTags, migrateLocalTags]);

  const createTag = useCallback(
    async (input: SmartTagInsert): Promise<{ error: string | null; tag?: SmartTag }> => {
      if (!session) return { error: 'Not authenticated' };

      let tagId = input.tag_id;
      if (!tagId) {
        const { data: generatedId, error: generationError } = await supabase.rpc('generate_smart_tag_id');
        if (!generationError && typeof generatedId === 'string') {
          tagId = generatedId;
        } else {
          // Keep the existing client fallback for projects that have not yet
          // applied the additive Smart Tag migration.
          tagId = generateTagId();
        }
      }

      const row: Record<string, unknown> = {
        user_id: session.user.id,
        tag_id: tagId,
        tag_type: input.tag_type,
        name: input.name,
        status: input.status ?? 'draft',
        pet_id: input.pet_id ?? null,
        plant_id: input.plant_id ?? null,
        tag_details: input.tag_details ?? {},
        visibility: input.visibility ?? {},
        owner_info: input.owner_info ?? {},
        photo_url: input.photo_url ?? null,
      };

      try {
        const { data, error: err } = await supabase
          .from('smart_tags')
          .insert(row)
          .select()
          .single();

        if (err) return { error: describeError(err.message) };
        if (!data) return { error: 'Smart Tag could not be saved.' };

        const saved = data as SmartTag;
        setTags((prev) => [saved, ...prev]);
        return { error: null, tag: saved };
      } catch (e) {
        return {
          error: describeError(e instanceof Error ? e.message : 'Smart Tag could not be saved.'),
        };
      }
    },
    [session],
  );

  const updateTag = useCallback(
    async (id: string, updates: Partial<SmartTag>): Promise<{ error: string | null }> => {
      if (!session) return { error: 'Not authenticated' };

      const payload = { ...updates, updated_at: new Date().toISOString() };

      try {
        const { data, error: err } = await supabase
          .from('smart_tags')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (err) return { error: describeError(err.message) };

        const saved = (data ?? { ...updates, id }) as SmartTag;
        setTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...saved } : t)));
        return { error: null };
      } catch (e) {
        return {
          error: describeError(e instanceof Error ? e.message : 'Smart Tag could not be updated.'),
        };
      }
    },
    [session],
  );

  const deleteTag = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      if (!session) return { error: 'Not authenticated' };

      try {
        const { error: err } = await supabase.from('smart_tags').delete().eq('id', id);
        if (err) return { error: describeError(err.message) };

        setTags((prev) => prev.filter((t) => t.id !== id));
        return { error: null };
      } catch (e) {
        return {
          error: describeError(e instanceof Error ? e.message : 'Smart Tag could not be deleted.'),
        };
      }
    },
    [session],
  );

  /**
   * Resolve a tag for a public QR scan. Uses the privacy-filtered RPC so the
   * page works without exposing private owner fields, then falls back to an
   * owner-scoped read for the signed-in owner.
   */
  const getTagByUniqueId = useCallback(async (tagId: string): Promise<SmartTag | null> => {
    try {
      const { data, error: rpcErr } = await supabase.rpc('get_public_tag_info', { p_tag_id: tagId });
      if (!rpcErr && data && typeof data === 'object') {
        const info = data as Record<string, unknown>;
        if (info.found) {
          return {
            id: (info.id as string) ?? tagId,
            user_id: '',
            tag_id: (info.tag_id as string) ?? tagId,
            tag_type: ((info.tag_type as TagType) ?? 'pet'),
            name: (info.name as string) ?? (info.pet_name as string) ?? 'Petziq Smart Tag',
            status: ((info.status as TagStatus) ?? (info.activated ? 'active' : 'coming_soon')),
            pet_id: null,
            plant_id: null,
            tag_details: (info.tag_details as Record<string, unknown>) ?? {},
            visibility: (info.visibility as Record<string, boolean>) ?? {},
            owner_info: (info.owner_info as Record<string, string>) ?? {},
            photo_url: (info.photo_url as string) ?? null,
            created_at: (info.created_at as string) ?? new Date().toISOString(),
            updated_at: (info.updated_at as string) ?? new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fall through to the owner-scoped read.
    }

    if (session) {
      const cached = tags.find((t) => t.tag_id === tagId);
      if (cached) return cached;

      try {
        const { data, error: err } = await supabase
          .from('smart_tags')
          .select('*')
          .eq('tag_id', tagId)
          .maybeSingle();
        if (!err && data) return data as SmartTag;
      } catch {
        // Fall through to local cache.
      }
    }

    return loadLocal().find((t) => t.tag_id === tagId) ?? null;
  }, [session, tags]);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    getTagByUniqueId,
    refetch: fetchTags,
  };
}
