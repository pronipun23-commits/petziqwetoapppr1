import { BREEDS } from '@/data/breeds';
import { CATEGORY_MAP } from '@/data/categories';
import type { Breed } from '@/data/types';

export type SearchField = 'breed' | 'category' | 'origin' | 'size' | 'temperament';

export const SEARCH_FIELDS: { field: SearchField; label: string }[] = [
  { field: 'breed', label: 'Breed' },
  { field: 'category', label: 'Category' },
  { field: 'origin', label: 'Origin' },
  { field: 'size', label: 'Size' },
  { field: 'temperament', label: 'Temperament' },
];

export function breedFieldValue(b: Breed, field: SearchField): string {
  switch (field) {
    case 'breed':
      return b.name;
    case 'category':
      return CATEGORY_MAP[b.category]?.name ?? '';
    case 'origin':
      return b.origin;
    case 'size':
      return b.stats.size;
    case 'temperament':
      return b.stats.temperament.join(', ');
  }
}

export function breedMatches(b: Breed, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return SEARCH_FIELDS.some(({ field }) =>
    breedFieldValue(b, field).toLowerCase().includes(needle),
  );
}

export function breedMatchedFields(b: Breed, q: string): SearchField[] {
  if (!q) return [];
  const needle = q.toLowerCase();
  return SEARCH_FIELDS.filter(({ field }) =>
    breedFieldValue(b, field).toLowerCase().includes(needle),
  ).map(({ field }) => field);
}

export function searchBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return BREEDS.slice();
  return BREEDS.filter((b) => breedMatches(b, q));
}
