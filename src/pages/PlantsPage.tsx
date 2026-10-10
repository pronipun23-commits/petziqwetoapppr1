import { useMemo, useState } from 'react';
import { Leaf, Search, Sun, Droplets } from 'lucide-react';
import { PLANTS, PLANT_CATEGORIES } from '@/data/plants';
import type { PlantCategoryId, SunlightLevel, WateringLevel, DifficultyLevel } from '@/data/plants';
import { hasCategory } from '@/data/plants';
import { PlantCard } from '@/components/PlantCard';
import { SectionHeader } from '@/components/ui';

interface PlantsPageProps {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
}

const PAGE_SIZE = 24;

export function PlantsPage({
  isFavorite,
  toggleFavorite,
  onNavigate,
}: PlantsPageProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PlantCategoryId | 'all'>('all');
  const [environment, setEnvironment] = useState<'all' | 'Indoor' | 'Outdoor'>('all');
  const [sunlight, setSunlight] = useState<SunlightLevel | 'all'>('all');
  const [watering, setWatering] = useState<WateringLevel | 'all'>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return PLANTS.filter((p) => {
      if (activeCategory !== 'all' && !hasCategory(p, activeCategory)) return false;
      if (environment !== 'all' && p.environment !== environment && p.environment !== 'Both')
        return false;
      if (sunlight !== 'all' && p.sunlight !== sunlight) return false;
      if (watering !== 'all' && p.watering !== watering) return false;
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.scientificName.toLowerCase().includes(q) ||
          p.category.some((c) => c.includes(q))
        );
      }
      return true;
    });
  }, [query, activeCategory, environment, sunlight, watering, difficulty]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const resetFilters = () => {
    setQuery('');
    setActiveCategory('all');
    setEnvironment('all');
    setSunlight('all');
    setWatering('all');
    setDifficulty('all');
    setVisibleCount(PAGE_SIZE);
  };

  const activeFilterCount =
    (activeCategory !== 'all' ? 1 : 0) +
    (environment !== 'all' ? 1 : 0) +
    (sunlight !== 'all' ? 1 : 0) +
    (watering !== 'all' ? 1 : 0) +
    (difficulty !== 'all' ? 1 : 0);

  return (
    <div className="container-px pt-10 pb-24 lg:pb-16">
      <SectionHeader
        eyebrow="Plants"
        title="Explore plant species"
        subtitle={`${PLANTS.length} plant species with detailed care profiles — from beginner-friendly succulents to statement trees and tropical foliage.`}
      />

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveCategory('all'); setVisibleCount(PAGE_SIZE); }}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeCategory === 'all'
              ? 'bg-brand-500 text-white'
              : 'border border-white/[0.08] text-ink-300 hover:text-ink-50 hover:border-white/[0.10]'
          }`}
        >
          All Plants
        </button>
        {PLANT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => { setActiveCategory(activeCategory === c.id ? 'all' : c.id); setVisibleCount(PAGE_SIZE); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === c.id
                ? 'bg-brand-500 text-white'
                : 'border border-white/[0.08] text-ink-300 hover:text-ink-50 hover:border-white/[0.10]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-ink-850/60 p-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder="Search plants by name or scientific name..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'Indoor', 'Outdoor'] as const).map((env) => (
            <button
              key={env}
              onClick={() => setEnvironment(env)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                environment === env
                  ? 'bg-brand-500/20 text-brand-500 ring-1 ring-brand-500/40'
                  : 'border border-white/[0.08] text-ink-300 hover:text-ink-50'
              }`}
            >
              {env === 'all' ? 'All locations' : env}
            </button>
          ))}
          <div className="h-5 w-px bg-ink-800/80 self-center" />
          {(['all', 'Low', 'Medium', 'Bright', 'Direct'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSunlight(s as SunlightLevel | 'all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                sunlight === s
                  ? 'bg-brand-500/20 text-brand-500 ring-1 ring-brand-500/40'
                  : 'border border-white/[0.08] text-ink-300 hover:text-ink-50'
              }`}
            >
              <Sun className="mr-1 inline h-3 w-3" />
              {s === 'all' ? 'All sun' : s}
            </button>
          ))}
          <div className="h-5 w-px bg-ink-800/80 self-center" />
          {(['all', 'Minimal', 'Low', 'Moderate', 'Frequent'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWatering(w as WateringLevel | 'all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                watering === w
                  ? 'bg-brand-500/20 text-brand-500 ring-1 ring-brand-500/40'
                  : 'border border-white/[0.08] text-ink-300 hover:text-ink-50'
              }`}
            >
              <Droplets className="mr-1 inline h-3 w-3" />
              {w === 'all' ? 'All water' : w}
            </button>
          ))}
          <div className="h-5 w-px bg-ink-800/80 self-center" />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | 'all')}
            className="rounded-full border border-white/[0.08] bg-ink-900/80 px-4 py-1.5 text-xs font-semibold text-ink-200 focus:outline-none focus:ring-2 focus:ring-brand-400/50"
          >
            <option value="all">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Experienced">Experienced</option>
          </select>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-400 transition hover:text-ink-50"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-ink-400">
        {filtered.length} plant{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'all' && ` in ${PLANT_CATEGORIES.find((c) => c.id === activeCategory)?.name}`}
      </p>

      {/* Grid */}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <PlantCard
            key={p.id}
            plant={p}
            index={i}
            isFavorite={isFavorite(p.id)}
            onToggleFavorite={toggleFavorite}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="btn-ghost">
            Load more plants
            <Leaf className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-ink-850/40 px-6 py-16 text-center animate-fade-in">
          <Leaf className="mb-4 h-12 w-12 text-ink-400" />
          <h3 className="font-display text-xl font-semibold text-ink-50">No plants found</h3>
          <p className="mt-2 max-w-md text-sm text-ink-400">
            Try adjusting your search or filters.
          </p>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="btn-primary mt-6">
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
