import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface TaxonomyMatch {
  id: string;
  common_name: string | null;
  scientific_name: string | null;
  taxonomic_rank: string;
  parent_id: string | null;
  total_count: number;
}

export function useTaxonomySearch(query: string, enabled = true) {
  const [matches, setMatches] = useState<TaxonomyMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!enabled || trimmed.length < 2) {
      setMatches([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('taxonomy_search', {
        p_query: trimmed,
        p_rank: null,
        p_limit: 8,
        p_offset: 0,
      });
      if (cancelled) return;
      if (error) {
        // The taxonomy migration is additive and may not be applied yet.
        // Keep the existing text-based pet flow usable in that case.
        setMatches([]);
      } else {
        setMatches((data ?? []) as TaxonomyMatch[]);
      }
      setLoading(false);
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [enabled, query]);

  return { matches, loading };
}
