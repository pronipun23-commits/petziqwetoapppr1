import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function usePlantFavorites() {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('plant_favorites')
        .select('plant_id')
        .eq('user_id', session.user.id);
      if (!cancelled && !error && data) {
        setFavorites(data.map((r) => r.plant_id));
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!session) return;
      if (favorites.includes(id)) {
        setFavorites((prev) => prev.filter((x) => x !== id));
        const { error } = await supabase
          .from('plant_favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('plant_id', id);
        if (error) {
          setFavorites((prev) => [id, ...prev]);
        }
      } else {
        setFavorites((prev) => [id, ...prev]);
        const { error } = await supabase
          .from('plant_favorites')
          .insert({ user_id: session.user.id, plant_id: id });
        if (error) {
          setFavorites((prev) => prev.filter((x) => x !== id));
        }
      }
    },
    [session, favorites],
  );

  return { favorites, isFavorite, toggleFavorite, loading };
}
