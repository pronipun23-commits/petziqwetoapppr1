import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export type FavoriteType = 'breed' | 'guide' | 'plant';

export function useUserFavorites() {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState<{ type: FavoriteType; id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!session) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('pet_favorites')
      .select('item_type, item_id')
      .eq('user_id', session.user.id);
    if (!error && data) {
      setFavorites(data.map((r) => ({ type: r.item_type as FavoriteType, id: r.item_id })));
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (!session) {
        if (!cancelled) {
          setFavorites([]);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('pet_favorites')
        .select('item_type, item_id')
        .eq('user_id', session.user.id);
      if (cancelled) return;
      if (error) {
        console.error('useUserFavorites fetch error:', error.message);
      }
      if (!error && data) {
        setFavorites(data.map((r) => ({ type: r.item_type as FavoriteType, id: r.item_id })));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  const isFavorite = useCallback(
    (type: FavoriteType, id: string) =>
      favorites.some((f) => f.type === type && f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (type: FavoriteType, id: string) => {
      if (!session) return;
      const existing = favorites.some((f) => f.type === type && f.id === id);
      if (existing) {
        setFavorites((prev) => prev.filter((f) => !(f.type === type && f.id === id)));
        const { error } = await supabase
          .from('pet_favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('item_type', type)
          .eq('item_id', id);
        if (error) {
          setFavorites((prev) => [...prev, { type, id }]);
        }
      } else {
        setFavorites((prev) => [...prev, { type, id }]);
        const { error } = await supabase
          .from('pet_favorites')
          .insert({ user_id: session.user.id, item_type: type, item_id: id });
        if (error) {
          setFavorites((prev) => prev.filter((f) => !(f.type === type && f.id === id)));
        }
      }
    },
    [session, favorites],
  );

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
}
