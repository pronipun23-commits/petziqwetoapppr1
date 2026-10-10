import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  gender: string | null;
  birth_date: string | null;
  photo_url: string | null;
  notes: string | null;
  animal_taxon_id: string | null;
  created_at: string;
  updated_at: string;
}

export function usePets() {
  const { session } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (!session) {
        if (!cancelled) {
          setPets([]);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('usePets fetch error:', error.message);
      }
      if (!error && data) setPets(data as Pet[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  const fetchPets = useCallback(async () => {
    if (!session) {
      setPets([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('usePets fetch error:', error.message);
    }
    if (!error && data) setPets(data as Pet[]);
    setLoading(false);
  }, [session]);

  const addPet = useCallback(
    async (pet: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!session) return { error: 'Not authenticated' };
      let { data, error } = await supabase
        .from('pets')
        .insert({ ...pet, user_id: session.user.id })
        .select()
        .single();
      if (error && 'animal_taxon_id' in pet && /animal_taxon_id|schema cache/i.test(error.message)) {
        const { animal_taxon_id: _animalTaxonId, ...legacyPet } = pet;
        ({ data, error } = await supabase
          .from('pets')
          .insert({ ...legacyPet, user_id: session.user.id })
          .select()
          .single());
      }
      if (error) {
        console.error('addPet error:', error.message);
        return { error: error.message };
      }
      if (data) {
        setPets((prev) => [data as Pet, ...prev]);
      }
      return { error: null };
    },
    [session],
  );

  const updatePet = useCallback(
    async (id: string, updates: Partial<Pet>) => {
      if (!session) return { error: 'Not authenticated' };
      let { data, error } = await supabase
        .from('pets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error && 'animal_taxon_id' in updates && /animal_taxon_id|schema cache/i.test(error.message)) {
        const { animal_taxon_id: _animalTaxonId, ...legacyUpdates } = updates;
        ({ data, error } = await supabase
          .from('pets')
          .update({ ...legacyUpdates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single());
      }
      if (error) {
        return { error: error.message };
      }
      if (data) {
        setPets((prev) => prev.map((p) => (p.id === id ? (data as Pet) : p)));
      }
      return { error: null };
    },
    [session],
  );

  const deletePet = useCallback(
    async (id: string) => {
      if (!session) return { error: 'Not authenticated' };
      const { error } = await supabase.from('pets').delete().eq('id', id);
      if (error) {
        return { error: error.message };
      }
      setPets((prev) => prev.filter((p) => p.id !== id));
      return { error: null };
    },
    [session],
  );

  return { pets, loading, addPet, updatePet, deletePet, refetch: fetchPets };
}
