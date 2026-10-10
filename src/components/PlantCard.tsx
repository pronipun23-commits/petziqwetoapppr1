import { Heart, Sun, Droplets, Sprout } from 'lucide-react';
import type { Plant } from '@/data/plants';
import { PLANT_CATEGORY_MAP } from '@/data/plants';

interface PlantCardProps {
  plant: Plant;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
  index?: number;
}

export function PlantCard({
  plant,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  index = 0,
}: PlantCardProps) {
  const primaryCategory = PLANT_CATEGORY_MAP[plant.category[0]];

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.10] hover:shadow-soft animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <button
        onClick={() => onNavigate(`/plants/${plant.id}`)}
        className="relative block aspect-[4/3] w-full overflow-hidden"
        aria-label={`View ${plant.name}`}
      >
        <img
          src={plant.image}
          alt={plant.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="chip glass-light backdrop-blur-md">
            {primaryCategory?.name}
          </span>
        </div>
      </button>

      <button
        onClick={() => onToggleFavorite(plant.id)}
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
        <button onClick={() => onNavigate(`/plants/${plant.id}`)} className="text-left">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-50">
            {plant.name}
          </h3>
          <p className="mt-0.5 text-xs italic text-ink-400">{plant.scientificName}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-200 line-clamp-2">
            {plant.summary}
          </p>
        </button>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="chip">
            <Sun className="h-3 w-3 text-accent-400" />
            {plant.sunlight}
          </span>
          <span className="chip">
            <Droplets className="h-3 w-3 text-brand-300" />
            {plant.watering}
          </span>
          <span className="chip">
            <Sprout className="h-3 w-3 text-brand-300" />
            {plant.difficulty}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.10] pt-4">
          <div className="flex items-center gap-3 text-xs text-ink-400">
            <span>{plant.environment}</span>
            <span className="h-1 w-1 rounded-full bg-ink-600" />
            <span>{plant.temperature}</span>
          </div>
          <button
            onClick={() => onNavigate(`/plants/${plant.id}`)}
            className="text-xs font-semibold text-brand-300 transition hover:text-brand-500"
          >
            Explore →
          </button>
        </div>
      </div>
    </article>
  );
}
