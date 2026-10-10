import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { BREEDS } from '@/data/breeds';
import { SectionHeader } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  return (
    <div className="container-px pt-12 pb-10">
      <SectionHeader
        eyebrow="Categories"
        title="Explore by species group"
        subtitle="Fourteen curated categories spanning dogs and cats to reptiles and exotic companions."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const count = BREEDS.filter((b) => b.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => onNavigate(`/categories/${c.id}`)}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.08] text-left transition hover:-translate-y-1 hover:border-white/[0.10] animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${c.accent}`} />
                <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-ink-50/70 text-brand-300 backdrop-blur-md">
                  <CategoryIcon name={c.icon} className="h-5 w-5" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {c.name}
                  </h3>
                  <p className="text-xs text-white/80">{c.tagline}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-ink-300 line-clamp-2">
                  {c.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="chip">{count} breeds</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-300">
                    Explore
                    <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
