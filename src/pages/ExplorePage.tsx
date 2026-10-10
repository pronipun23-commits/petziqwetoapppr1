import { useMemo, useState } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { BREEDS } from '@/data/breeds';
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories';
import { breedMatches, SEARCH_FIELDS } from '@/data/search';
import { PetCard } from '@/components/PetCard';
import { SectionHeader, EmptyState } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { Breed, CategoryId } from '@/data/types';

interface ExplorePageProps {
  initialCategory?: CategoryId;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
}

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'name', label: 'Name A-Z' },
  { id: 'lifespan', label: 'Longest lived' },
  { id: 'energy', label: 'Highest energy' },
];

const ENERGY_ORDER: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  'Very High': 4,
};

export function ExplorePage({
  initialCategory,
  isFavorite,
  toggleFavorite,
  onNavigate,
}: ExplorePageProps) {
  const [category, setCategory] = useState<CategoryId | 'all'>(
    initialCategory ?? 'all',
  );
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo<Breed[]>(() => {
    let list = BREEDS.slice();
    if (category !== 'all') list = list.filter((b) => b.category === category);
    if (query.trim()) {
      list = list.filter((b) => breedMatches(b, query.trim().toLowerCase()));
    }
    switch (sort) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'lifespan':
        list.sort((a, b) => parseInt(b.stats.lifespan) - parseInt(a.stats.lifespan));
        break;
      case 'energy':
        list.sort(
          (a, b) =>
            (ENERGY_ORDER[b.stats.energy] ?? 0) -
            (ENERGY_ORDER[a.stats.energy] ?? 0),
        );
        break;
      default:
        break;
    }
    return list;
  }, [category, query, sort]);

  return (
    <div className="container-px pt-12 pb-10">
      <SectionHeader
        eyebrow="Explore pets"
        title="Browse every breed in Petziq"
        subtitle="Filter by category, search by name or trait, and sort to find the companion that fits your life."
      />

      {/* Controls */}
      <div className="mt-8 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by breed, category, origin, size, or temperament..."
            className="input-field pl-11"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-400 transition hover:text-ink-50 hover:bg-white/[0.06]/80"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
          <span>Searchable:</span>
          {SEARCH_FIELDS.map((f) => (
            <span
              key={f.field}
              className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-0.5 text-ink-300"
            >
              {f.label}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`chip transition ${
              category === 'all'
                ? 'border-brand-400/40 bg-brand-500/15 text-brand-500'
                : 'hover:bg-white/[0.06]/80'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`chip transition ${
                category === c.id
                  ? 'border-brand-400/40 bg-brand-500/15 text-brand-500'
                  : 'hover:bg-white/[0.06]/80'
              }`}
            >
              <CategoryIcon name={c.icon} className="h-3.5 w-3.5" />
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-400">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Sort by</span>
          <div className="flex flex-wrap gap-1.5">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`rounded-full px-3 py-1 transition ${
                  sort === s.id
                    ? 'bg-ink-800/80 text-ink-50'
                    : 'text-ink-300 hover:bg-white/[0.06] hover:text-ink-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-ink-400">
        {filtered.length} {filtered.length === 1 ? 'breed' : 'breeds'}
        {category !== 'all' && (
          <>
            {' '}in{' '}
            <span className="text-ink-200">{CATEGORY_MAP[category].name}</span>
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="No results found"
            description="No breeds match your search. Try a different keyword, or clear your filters to see everything."
            action={
              <button
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
                className="btn-primary"
              >
                Reset filters
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b, i) => (
            <PetCard
              key={b.id}
              breed={b}
              index={i}
              isFavorite={isFavorite(b.id)}
              onToggleFavorite={toggleFavorite}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
