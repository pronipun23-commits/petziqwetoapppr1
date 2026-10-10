import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export interface UserPlant {
  id: string;
  user_id: string;
  name: string;
  species: string | null;
  care_level: string | null;
  watering_frequency: string | null;
  location: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserPlants() {
  const { session } = useAuth();
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (!session) {
        if (!cancelled) {
          setPlants([]);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('user_plants')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('useUserPlants fetch error:', error.message);
      }
      if (!error && data) setPlants(data as UserPlant[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  const fetchPlants = useCallback(async () => {
    if (!session) {
      setPlants([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('user_plants')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('useUserPlants fetch error:', error.message);
    }
    if (!error && data) setPlants(data as UserPlant[]);
    setLoading(false);
  }, [session]);

  const addPlant = useCallback(
    async (plant: Omit<UserPlant, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!session) return { error: 'Not authenticated' };
      const { data, error } = await supabase
        .from('user_plants')
        .insert({ ...plant, user_id: session.user.id })
        .select()
        .single();
      if (error) {
        console.error('addPlant error:', error.message);
        return { error: error.message };
      }
      if (data) {
        setPlants((prev) => [data as UserPlant, ...prev]);
      }
      return { error: null };
    },
    [session],
  );

  const updatePlant = useCallback(
    async (id: string, updates: Partial<UserPlant>) => {
      if (!session) return { error: 'Not authenticated' };
      const { data, error } = await supabase
        .from('user_plants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return { error: error.message };
      }
      if (data) {
        setPlants((prev) => prev.map((p) => (p.id === id ? (data as UserPlant) : p)));
      }
      return { error: null };
    },
    [session],
  );

  const deletePlant = useCallback(
    async (id: string) => {
      if (!session) return { error: 'Not authenticated' };
      const { error } = await supabase.from('user_plants').delete().eq('id', id);
      if (error) {
        return { error: error.message };
      }
      setPlants((prev) => prev.filter((p) => p.id !== id));
      return { error: null };
    },
    [session],
  );

  return { plants, loading, addPlant, updatePlant, deletePlant, refetch: fetchPlants };
}

