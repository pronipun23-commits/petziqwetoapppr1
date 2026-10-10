import { Heart } from 'lucide-react';
import type { Breed } from '@/data/types';
import { CATEGORY_MAP } from '@/data/categories';

interface PetCardProps {
  breed: Breed;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
  index?: number;
}

export function PetCard({
  breed,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  index = 0,
}: PetCardProps) {
  const category = CATEGORY_MAP[breed.category];

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.10] hover:shadow-soft animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <button
        onClick={() => onNavigate(`/breed/${breed.id}`)}
        className="relative block aspect-[4/3] w-full overflow-hidden"
        aria-label={`View ${breed.name}`}
      >
        <img
          src={breed.image}
          alt={breed.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="chip glass-light backdrop-blur-md">
            {category?.name}
          </span>
        </div>
      </button>

      <button
        onClick={() => onToggleFavorite(breed.id)}
        className="absolute right-3 top-3 z-10 rounded-full bg-ink-50/70 p-2 backdrop-blur-md transition hover:glass-light"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`h-4 w-4 transition ${
            isFavorite
              ? 'fill-accent-500 text-accent-500'
              : 'text-ink-200 hover:text-ink-50'
          }`}
        />
      </button>

      <div className="flex flex-1 flex-col p-5">
        <button
          onClick={() => onNavigate(`/breed/${breed.id}`)}
          className="text-left"
        >
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-50">
            {breed.name}
          </h3>
          <p className="mt-1 text-xs text-ink-400">{breed.origin}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-200 line-clamp-2">
            {breed.summary}
          </p>
        </button>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {breed.stats.temperament.slice(0, 3).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.10] pt-4">
          <div className="flex items-center gap-3 text-xs text-ink-400">
            <span>{breed.stats.lifespan}</span>
            <span className="h-1 w-1 rounded-full bg-ink-600" />
            <span>{breed.stats.size}</span>
          </div>
          <button
            onClick={() => onNavigate(`/breed/${breed.id}`)}
            className="text-xs font-semibold text-brand-300 transition hover:text-brand-500"
          >
            Explore →
          </button>
        </div>
      </div>
    </article>
  );
}
