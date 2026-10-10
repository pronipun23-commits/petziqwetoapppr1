import { useMemo, useState } from 'react';
import { BREEDS } from '@/data/breeds';
import { CATEGORIES } from '@/data/categories';
import {
  breedFieldValue,
  breedMatchedFields,
  type SearchField,
} from '@/data/search';
import type { Breed } from '@/data/types';
import { PLANTS } from '@/data/plants';
import { CARE_GUIDES } from '@/data/care';

export type { SearchField as SearchMatchType } from '@/data/search';

export type SearchResultType = 'breed' | 'category' | 'plant' | 'guide';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  image: string;
  path: string;
  matchedField: string;
  matchedValue: string;
}

export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<SearchResultType | 'all'>('all');

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];

    const rank: Record<SearchField, number> = {
      breed: 0,
      category: 1,
      origin: 2,
      size: 3,
      temperament: 4,
    };

    const breedHits: SearchResult[] = BREEDS.map((b) => {
      const fields = breedMatchedFields(b, q);
      return fields.length ? { b, fields } : null;
    })
      .filter((x): x is { b: Breed; fields: SearchField[] } => x !== null)
      .sort(
        (a, z) =>
          rank[a.fields[0]] - rank[z.fields[0]] ||
          a.b.name.localeCompare(z.b.name),
      )
      .map(({ b, fields }) => ({
        type: 'breed' as const,
        id: b.id,
        title: b.name,
        subtitle: b.tagline,
        image: b.image,
        path: `/breed/${b.id}`,
        matchedField: fields[0],
        matchedValue: breedFieldValue(b, fields[0]),
      }));

    const categoryHits: SearchResult[] = CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    ).map((c) => ({
      type: 'category' as const,
      id: c.id,
      title: c.name,
      subtitle: c.tagline,
      image: c.image,
      path: `/categories/${c.id}`,
      matchedField: 'category',
      matchedValue: c.name,
    }));

    const plantHits: SearchResult[] = PLANTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.some((c) => c.includes(q)),
    )
      .slice(0, 6)
      .map((p) => ({
        type: 'plant' as const,
        id: p.id,
        title: p.name,
        subtitle: p.scientificName,
        image: p.image,
        path: `/plants/${p.id}`,
        matchedField: 'plant',
        matchedValue: p.name,
      }));

    const guideHits: SearchResult[] = CARE_GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.excerpt.toLowerCase().includes(q),
    )
      .slice(0, 4)
      .map((g) => ({
        type: 'guide' as const,
        id: g.id,
        title: g.title,
        subtitle: g.excerpt,
        image: '',
        path: `/care/${g.id}`,
        matchedField: 'guide',
        matchedValue: g.title,
      }));

    let all = [...breedHits, ...categoryHits, ...plantHits, ...guideHits];
    if (filter !== 'all') {
      all = all.filter((r) => r.type === filter);
    }
    return all.slice(0, 12);
  }, [query, filter]);

  return { query, setQuery, open, setOpen, filter, setFilter, results };
}
