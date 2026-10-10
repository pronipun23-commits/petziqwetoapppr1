import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export type RecentType = 'plant' | 'breed' | 'guide';

export interface RecentItem {
  type: RecentType;
  id: string;
  viewed_at: string;
}

export function useRecentlyViewedDb() {
  const { session } = useAuth();
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = useCallback(async () => {
    if (!session) {
      setRecent([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('recently_viewed')
      .select('item_type, item_id, viewed_at')
      .eq('user_id', session.user.id)
      .order('viewed_at', { ascending: false })
      .limit(12);
    if (!error && data) {
      setRecent(data.map((r) => ({ type: r.item_type as RecentType, id: r.item_id, viewed_at: r.viewed_at })));
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (!session) {
        if (!cancelled) {
          setRecent([]);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('recently_viewed')
        .select('item_type, item_id, viewed_at')
        .eq('user_id', session.user.id)
        .order('viewed_at', { ascending: false })
        .limit(12);
      if (cancelled) return;
      if (error) {
        console.error('useRecentlyViewedDb fetch error:', error.message);
      }
      if (!error && data) {
        setRecent(data.map((r) => ({ type: r.item_type as RecentType, id: r.item_id, viewed_at: r.viewed_at })));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  const addRecent = useCallback(
    async (type: RecentType, id: string) => {
      if (!session) return;
      const { error } = await supabase
        .from('recently_viewed')
        .upsert(
          {
            user_id: session.user.id,
            item_type: type,
            item_id: id,
            viewed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,item_type,item_id' },
        );
      if (error) {
        console.error('addRecent error:', error.message);
      }
      fetchRecent();
    },
    [session, fetchRecent],
  );

  const clearRecent = useCallback(async () => {
    if (!session) return;
    const { error } = await supabase.from('recently_viewed').delete().eq('user_id', session.user.id);
    if (error) {
      console.error('clearRecent error:', error.message);
      return;
    }
    setRecent([]);
  }, [session]);

  return { recent, loading, addRecent, clearRecent, refetch: fetchRecent };
}
