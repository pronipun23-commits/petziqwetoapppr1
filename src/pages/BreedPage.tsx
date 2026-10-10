import { useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  BookOpen,
  Check,
  X,
  Utensils,
  Home as HomeIcon,
  Activity,
  Scissors,
  HeartPulse,
} from 'lucide-react';
import { BREED_MAP } from '@/data/breeds';
import { CATEGORY_MAP } from '@/data/categories';
import { PetCard } from '@/components/PetCard';
import { TraitBar, Stat } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { Breed } from '@/data/types';

interface BreedPageProps {
  breedId: string;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
  addRecent: (id: string) => void;
}

export function BreedPage({
  breedId,
  isFavorite,
  toggleFavorite,
  onNavigate,
  addRecent,
}: BreedPageProps) {
  const breed: Breed | undefined = BREED_MAP[breedId];

  useEffect(() => {
    if (breed) addRecent(breed.id);
  }, [breed, addRecent]);

  if (!breed) {
    return (
      <div className="container-px pt-20 pb-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink-50">
          Breed not found
        </h1>
        <p className="mt-3 text-ink-400">
          We could not find the breed you were looking for.
        </p>
        <button onClick={() => onNavigate('/explore')} className="btn-primary mt-6">
          Back to explore
        </button>
      </div>
    );
  }

  const category = CATEGORY_MAP[breed.category];
  const related = (Object.values(BREED_MAP) as Breed[])
    .filter((b) => b.category === breed.category && b.id !== breed.id)
    .slice(0, 3);
  const fav = isFavorite(breed.id);

  const careItems = [
    { icon: Utensils, label: 'Diet', value: breed.care.diet },
    { icon: HomeIcon, label: 'Housing', value: breed.care.housing },
    { icon: Activity, label: 'Exercise', value: breed.care.exercise },
    { icon: Scissors, label: 'Grooming', value: breed.care.grooming },
    { icon: HeartPulse, label: 'Health', value: breed.care.health },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={breed.image}
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-50/80 to-ink-50" />
        </div>

        <div className="container-px pt-8 pb-10">
          <button
            onClick={() => onNavigate('/explore')}
            className="btn-subtle -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08]">
              <img
                src={breed.image}
                alt={breed.name}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <button
                onClick={() => onNavigate(`/categories/${breed.category}`)}
                className="chip w-fit"
              >
                <CategoryIcon name={category.icon} className="h-3.5 w-3.5" />
                {category.name}
              </button>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {breed.name}
              </h1>
              <p className="mt-2 text-lg text-brand-100">{breed.tagline}</p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-100">
                {breed.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => toggleFavorite(breed.id)}
                  className={fav ? 'btn-primary' : 'btn-ghost'}
                >
                  <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
                  {fav ? 'Favorited' : 'Add to favorites'}
                </button>
                <button
                  onClick={() => onNavigate('/care')}
                  className="btn-ghost"
                >
                  <BookOpen className="h-4 w-4" />
                  Care guides
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="container-px mt-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Origin" value={breed.origin} />
          <Stat label="Lifespan" value={breed.stats.lifespan} />
          <Stat label="Size" value={breed.stats.size} />
          <Stat label="Weight" value={breed.stats.weight} />
          <Stat label="Energy" value={breed.stats.energy} />
          <Stat label="Care level" value={breed.stats.careLevel} />
        </div>
      </div>

      {/* Overview + traits */}
      <div className="container-px mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="section-title">Overview</h2>
          <div className="mt-4 space-y-4">
            {breed.description.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-ink-200">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {breed.stats.temperament.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        <aside className="card-surface p-6">
          <h3 className="font-display text-base font-semibold text-ink-50">
            Trait profile
          </h3>
          <div className="mt-5 space-y-4">
            {breed.traits.map((t, i) => (
              <TraitBar
                key={t.label}
                label={t.label}
                value={t.value}
                delay={i * 80}
              />
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-brand-400/20 bg-brand-500/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-500">
              <Sparkles className="h-4 w-4" />
              Fun fact
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">
              {breed.funFact}
            </p>
          </div>
        </aside>
      </div>

      {/* Care */}
      <div className="container-px mt-16">
        <h2 className="section-title">Care essentials</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careItems.map((c) => (
            <div key={c.label} className="card-surface p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-500">
                <c.icon className="h-4 w-4" />
                {c.label}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-200">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Good for / not good for */}
      <div className="container-px mt-16 grid gap-4 sm:grid-cols-2">
        <div className="card-surface p-6">
          <h3 className="font-display text-base font-semibold text-ink-50">
            Great for
          </h3>
          <ul className="mt-4 space-y-2.5">
            {breed.goodFor.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm text-ink-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                {g}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-6">
          <h3 className="font-display text-base font-semibold text-ink-50">
            Less ideal for
          </h3>
          <ul className="mt-4 space-y-2.5">
            {breed.notGoodFor.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm text-ink-200">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="container-px mt-16">
          <h2 className="section-title">More in {category.name}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((b, i) => (
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
        </div>
      )}
    </div>
  );
}
