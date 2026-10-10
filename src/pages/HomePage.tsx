import { ArrowRight, Sparkles, Compass, BookOpen, Stethoscope, Heart, Mail } from 'lucide-react';
import { BREEDS } from '@/data/breeds';
import { CATEGORIES } from '@/data/categories';
import { PetCard } from '@/components/PetCard';
import { SectionHeader } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { Breed } from '@/data/types';

interface HomePageProps {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
}

export function HomePage({
  isFavorite,
  toggleFavorite,
  onNavigate,
}: HomePageProps) {
  const featured: Breed[] = BREEDS.slice(0, 6);

  const features = [
    {
      icon: Compass,
      title: 'Breed Explorer',
      body: 'Deep, structured profiles for 20+ breeds across 14 categories.',
      path: '/explore',
    },
    {
      icon: BookOpen,
      title: 'Care Guides',
      body: 'Practical, vet-informed guidance for everyday husbandry.',
      path: '/care',
    },
    {
      icon: Stethoscope,
      title: 'Problem Solver',
      body: 'Educational triage for common behavioral and health concerns.',
      path: '/problems',
    },
    {
      icon: Heart,
      title: 'Favorites & History',
      body: 'Save breeds and revisit what you have recently explored.',
      path: '/favorites',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <div className="container-px pt-20 pb-16 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="chip mx-auto">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              Premium pet breed explorer
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink-50 text-balance sm:text-6xl">
              Discover the perfect companion, one breed at a time.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-300 text-balance">
              Petziq brings together detailed breed profiles, expert care
              guides, and educational problem solving — all in one beautifully
              crafted experience.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('/explore')}
                className="btn-primary"
              >
                Explore breeds
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('/categories')}
                className="btn-ghost"
              >
                Browse categories
              </button>
            </div>
          </div>

          {/* Hero collage */}
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
            {BREEDS.slice(0, 4).map((b, i) => (
              <button
                key={b.id}
                onClick={() => onNavigate(`/breed/${b.id}`)}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] ${
                  i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                } animate-fade-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={b.image}
                  alt={b.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 text-left">
                  <div className="text-xs text-white/80">{b.origin}</div>
                  <div className="font-display text-sm font-semibold text-white sm:text-base">
                    {b.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="container-px">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/[0.08] bg-ink-850/60 p-8 sm:grid-cols-4 sm:p-10">
          {[
            { value: `${BREEDS.length}`, label: 'Detailed breeds' },
            { value: `${CATEGORIES.length}`, label: 'Pet categories' },
            { value: '7+', label: 'Care guides' },
            { value: '8+', label: 'Problem topics' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-semibold text-ink-50 sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-ink-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-px mt-24">
        <SectionHeader
          eyebrow="What you get"
          title="Everything you need to choose and care wisely"
          subtitle="From first-time keepers to experienced enthusiasts, Petziq structures the knowledge that matters."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => onNavigate(f.path)}
              className="group card-surface p-6 text-left transition hover:-translate-y-1 hover:border-white/[0.10] animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-300 transition group-hover:bg-brand-500/20">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-50">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                {f.body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-300">
                Open
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Categories strip */}
      <section className="container-px mt-24">
        <div className="flex items-end justify-between">
          <SectionHeader
            eyebrow="Categories"
            title="Fourteen ways to explore"
          />
          <button
            onClick={() => onNavigate('/categories')}
            className="btn-subtle hidden sm:inline-flex"
          >
            All categories
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {CATEGORIES.slice(0, 7).map((c, i) => (
            <button
              key={c.id}
              onClick={() => onNavigate(`/categories/${c.id}`)}
              className="group card-surface flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-1 hover:border-white/[0.10] animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-brand-300 transition group-hover:bg-brand-500/15">
                <CategoryIcon name={c.icon} className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-ink-50">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured breeds */}
      <section className="container-px mt-24">
        <div className="flex items-end justify-between">
          <SectionHeader
            eyebrow="Featured breeds"
            title="Hand-picked profiles to start with"
          />
          <button
            onClick={() => onNavigate('/explore')}
            className="btn-subtle hidden sm:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b, i) => (
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
      </section>

      {/* Contact & Feedback */}
      <section className="container-px mt-24">
        <div className="rounded-3xl border border-white/[0.08] bg-ink-850/60 p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-semibold text-ink-50">
                Get in touch with Petziq
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-300">
                Questions, support, feedback, or business inquiries — the Petziq
                Team is here to help.
              </p>
              <div className="mt-5 flex flex-col gap-1">
                <p className="font-medium text-ink-100">Petziq Team</p>
                <a
                  href="mailto:petziq.team@gmail.com"
                  className="inline-flex items-center gap-2 text-lg font-medium text-brand-300 transition hover:text-brand-500"
                >
                  <Mail className="h-5 w-5" />
                  petziq.team@gmail.com
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <button
                onClick={() => onNavigate('/about')}
                className="btn-subtle"
              >
                About Petziq
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="mailto:petziq.team@gmail.com"
                className="btn-primary"
              >
                <Mail className="h-4 w-4" />
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px mt-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-brand-50 via-brand-100 to-accent-50 p-10 sm:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-ink-50 sm:text-3xl text-balance">
              Have a concern about your pet?
            </h2>
            <p className="mt-3 text-base text-ink-300">
              The Problem Solver offers educational guidance for common
              situations — with a clear veterinarian disclaimer so you always
              know when to seek professional care.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('/problems')}
                className="btn-primary"
              >
                Open Problem Solver
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('/care')}
                className="btn-ghost"
              >
                Read care guides
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
