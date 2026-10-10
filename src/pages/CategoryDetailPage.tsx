import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories';
import { BREEDS } from '@/data/breeds';
import { PetCard } from '@/components/PetCard';
import { SectionHeader } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { CategoryId } from '@/data/types';

interface CategoryDetailPageProps {
  categoryId: CategoryId;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
}

export function CategoryDetailPage({
  categoryId,
  isFavorite,
  toggleFavorite,
  onNavigate,
}: CategoryDetailPageProps) {
  const category = CATEGORY_MAP[categoryId];
  if (!category) {
    return (
      <div className="container-px pt-20 pb-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink-50">
          Category not found
        </h1>
        <button onClick={() => onNavigate('/categories')} className="btn-primary mt-6">
          All categories
        </button>
      </div>
    );
  }

  const breeds = BREEDS.filter((b) => b.category === categoryId);
  const otherCategories = CATEGORIES.filter((c) => c.id !== categoryId).slice(0, 6);

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={category.image}
            alt=""
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/85 to-ink-950" />
        </div>

        <div className="container-px pt-8 pb-12">
          <button
            onClick={() => onNavigate('/categories')}
            className="btn-subtle -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            All categories
          </button>

          <div className="mt-8 flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
              <CategoryIcon name={category.icon} className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {category.name}
              </h1>
              <p className="mt-2 text-lg text-brand-100">{category.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-100">
            {category.description}
          </p>
        </div>
      </div>

      <div className="container-px mt-8">
        <div className="flex items-center justify-between">
          <SectionHeader
            title={`${breeds.length} ${breeds.length === 1 ? 'breed' : 'breeds'} in this category`}
          />
          <button
            onClick={() => onNavigate(`/explore`)}
            className="btn-subtle hidden sm:inline-flex"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {breeds.length === 0 ? (
          <p className="mt-6 text-sm text-ink-400">
            No breeds have been added to this category yet. The architecture
            supports thousands more — they will appear here automatically.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {breeds.map((b, i) => (
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

      <div className="container-px mt-16">
        <SectionHeader eyebrow="Keep exploring" title="Other categories" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {otherCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => onNavigate(`/categories/${c.id}`)}
              className="group card-surface flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-1 hover:border-white/[0.10]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-brand-300 transition group-hover:bg-brand-500/15">
                <CategoryIcon name={c.icon} className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-ink-50">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
