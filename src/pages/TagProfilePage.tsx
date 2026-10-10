import { useState, useEffect } from 'react';
import { Tag, QrCode, PawPrint, ArrowRight, Shield, AlertCircle, Sprout, Phone, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SmartTag } from '@/hooks/useSmartTags';

interface TagProfilePageProps {
  tagId: string;
  onNavigate: (path: string) => void;
}

const STORAGE_KEY = 'petziqq_smart_tags';

/** Lifecycle states in which a tag's public profile is live. */
const LIVE_STATUSES: string[] = ['active', 'activated'];

export function TagProfilePage({ tagId, onNavigate }: TagProfilePageProps) {
  const [tag, setTag] = useState<SmartTag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTag() {
      try {
        // Public QR reads go through the privacy-filtered RPC: it returns only
        // the fields the owner marked public, so this works for signed-out
        // visitors without a blanket SELECT policy on the table.
        const { data: rpcData, error: rpcErr } = await supabase.rpc('get_public_tag_info', {
          p_tag_id: tagId,
        });
        if (!rpcErr && rpcData && typeof rpcData === 'object') {
          const info = rpcData as Record<string, unknown>;
          if (info.found) {
            setTag({
              id: (info.id as string) ?? tagId,
              user_id: '',
              tag_id: (info.tag_id as string) ?? tagId,
              tag_type: (info.tag_type as SmartTag['tag_type']) ?? 'pet',
              name: (info.name as string) ?? (info.pet_name as string) ?? 'Petziq Smart Tag',
              status:
                (info.status as SmartTag['status']) ?? (info.activated ? 'active' : 'coming_soon'),
              pet_id: null,
              plant_id: null,
              tag_details: (info.tag_details as Record<string, unknown>) ?? {},
              visibility: (info.visibility as Record<string, boolean>) ?? {},
              owner_info: (info.owner_info as Record<string, string>) ?? {},
              photo_url: (info.photo_url as string) ?? null,
              created_at: (info.created_at as string) ?? new Date().toISOString(),
              updated_at: (info.updated_at as string) ?? new Date().toISOString(),
            } as SmartTag);
            return;
          }
        }

        // Signed-in owner: read the full row directly (allowed by the
        // owner-scoped SELECT policy).
        const { data, error: selErr } = await supabase
          .from('smart_tags')
          .select('*')
          .eq('tag_id', tagId)
          .maybeSingle();

        if (!selErr && data) {
          setTag(data as SmartTag);
          return;
        }

        // Fallback: a tag created before the database was available.
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const localTags: SmartTag[] = JSON.parse(raw);
            const found = localTags.find((t) => t.tag_id === tagId);
            if (found) {
              setTag(found);
              return;
            }
          }
        } catch {
          // ignore
        }

        setError('Tag not found');
      } catch {
        setError('Could not load tag information');
      } finally {
        setLoading(false);
      }
    }
    fetchTag();
  }, [tagId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/10 text-brand-400 animate-pulse">
            <QrCode className="h-8 w-8" />
          </div>
          <p className="text-sm text-ink-400">Loading tag information...</p>
        </div>
      </div>
    );
  }

  if (error || !tag) {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-red-500/10 text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-50">Tag Not Found</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-400">
          We couldn't find a Petziq Smart Tag with ID "{tagId}".
        </p>
        <button onClick={() => onNavigate('/')} className="btn-primary mt-8 inline-flex items-center gap-2">
          Go to Petziq
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Anything that is not live yet shows the pending notice. 'activated' is the
  // database-side state for a tag that has been paired with a pet.
  if (!LIVE_STATUSES.includes(String(tag.status))) {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-500/10 text-brand-400">
          <Tag className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-50">
          This Petziq Smart Tag hasn't been activated yet
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-300">
          Tag ID: <span className="font-mono font-semibold text-brand-300">{tag.tag_id}</span>
        </p>
        <p className="mt-4 max-w-md text-sm text-ink-400">
          If you're the owner, log in to your Petziq account and activate this tag from Smart Tags.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button onClick={() => onNavigate('/')} className="btn-primary inline-flex items-center gap-2">
            Go to Petziq
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const details = (tag.tag_details ?? {}) as Record<string, string>;
  const vis = (tag.visibility ?? {}) as Record<string, boolean>;
  const owner = (tag.owner_info ?? {}) as Record<string, string>;

  const petCareFields = [
    { key: 'identification_notes', visKey: 'show_identification_notes', label: 'Identification', icon: Tag },
    { key: 'food_info', visKey: 'show_food_info', label: 'Food', icon: null },
    { key: 'exercise_info', visKey: 'show_exercise_info', label: 'Exercise', icon: null },
    { key: 'grooming_info', visKey: 'show_grooming_info', label: 'Grooming', icon: null },
    { key: 'training_info', visKey: 'show_training_info', label: 'Training', icon: null },
    { key: 'behavior_info', visKey: 'show_behavior_info', label: 'Behavior', icon: null },
    { key: 'general_care', visKey: 'show_general_care', label: 'General Care', icon: null },
  ];

  const plantCareFields = [
    { key: 'watering_info', visKey: 'show_watering_info', label: 'Watering' },
    { key: 'sunlight_info', visKey: 'show_sunlight_info', label: 'Sunlight' },
    { key: 'soil_info', visKey: 'show_soil_info', label: 'Soil' },
    { key: 'fertilizer_info', visKey: 'show_fertilizer_info', label: 'Fertilizer' },
    { key: 'temperature_info', visKey: 'show_temperature_info', label: 'Temperature' },
    { key: 'plant_care_notes', visKey: 'show_plant_care_notes', label: 'General Care' },
  ];

  const careFields = tag.tag_type === 'pet' ? petCareFields : plantCareFields;

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <div className="mx-auto max-w-lg">
        {/* Tag header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <Tag className="h-3.5 w-3.5" />
            Petziq Smart Tag
          </div>
          <p className="mt-3 font-mono text-sm text-ink-400">{tag.tag_id}</p>
        </div>

        {/* Pet/Plant profile card */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/[0.08] glass shadow-soft">
          <div className="aspect-[4/3] overflow-hidden bg-ink-900">
            {tag.photo_url ? (
              <img src={tag.photo_url} alt={tag.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-400">
                {tag.tag_type === 'pet' ? <PawPrint className="h-16 w-16" /> : <Sprout className="h-16 w-16" />}
              </div>
            )}
          </div>
          <div className="p-6 text-center">
            <h1 className="font-display text-2xl font-bold text-ink-50">{tag.name}</h1>
            {tag.tag_type === 'pet' && (
              <p className="mt-2 text-sm text-ink-300">
                {details.species}
                {details.breed ? ` · ${details.breed}` : ''}
                {details.gender ? ` · ${details.gender}` : ''}
              </p>
            )}
            {tag.tag_type === 'plant' && (
              <p className="mt-2 text-sm text-ink-300">
                {details.species}
                {details.plant_type ? ` · ${details.plant_type}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Care information */}
        {careFields.some((f) => vis[f.visKey] && details[f.key]) && (
          <div className="mt-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink-50">
              {tag.tag_type === 'pet' ? 'Care Information' : 'Plant Care'}
            </h2>
            {careFields
              .filter((f) => vis[f.visKey] && details[f.key])
              .map((f) => (
                <div key={f.key} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">{f.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{details[f.key]}</p>
                </div>
              ))}
          </div>
        )}

        {/* Owner / Emergency contact (only if public) */}
        {(vis.show_owner_name && owner.owner_name) ||
         (vis.show_emergency_contact && owner.emergency_contact) ||
         (vis.show_contact_phone && owner.contact_phone) ||
         (vis.show_contact_email && owner.contact_email) ? (
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <h2 className="font-display text-lg font-semibold text-ink-50">Emergency Contact</h2>
            <div className="mt-3 space-y-2">
              {vis.show_owner_name && owner.owner_name && (
                <div className="flex items-center gap-2 text-sm text-ink-200">
                  <User className="h-4 w-4 text-brand-400" />
                  {owner.owner_name}
                </div>
              )}
              {vis.show_emergency_contact && owner.emergency_contact && (
                <div className="flex items-center gap-2 text-sm text-ink-200">
                  <Phone className="h-4 w-4 text-brand-400" />
                  {owner.emergency_contact}
                </div>
              )}
              {vis.show_contact_phone && owner.contact_phone && (
                <div className="flex items-center gap-2 text-sm text-ink-200">
                  <Phone className="h-4 w-4 text-brand-400" />
                  {owner.contact_phone}
                </div>
              )}
              {vis.show_contact_email && owner.contact_email && (
                <div className="flex items-center gap-2 text-sm text-ink-200">
                  <Mail className="h-4 w-4 text-brand-400" />
                  {owner.contact_email}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Safety note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <Shield className="h-5 w-5 shrink-0 text-brand-400" />
          <p className="text-xs leading-relaxed text-ink-400">
            This profile shows only owner-approved public information. Private details like
            address and contact info are never exposed on Petziq Smart Tag profiles.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => onNavigate('/')} className="text-sm text-brand-300 transition hover:text-brand-200">
            Visit Petziq
          </button>
        </div>
      </div>
    </div>
  );
}
