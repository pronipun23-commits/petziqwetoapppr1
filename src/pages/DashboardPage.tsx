import { useEffect, useState, useRef } from 'react';
import {
  PawPrint, Sprout, Plus, Flame, Star, CheckCircle2, Bell,
  ArrowRight, TrendingUp, Trophy, Sparkles,
  Droplets, Heart, Activity,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { useUserPlants } from '@/hooks/useUserPlants';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase } from '@/lib/supabase';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/ui';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { profile } = useAuth();
  const { pets, loading: petsLoading } = usePets();
  const { plants, loading: plantsLoading } = useUserPlants();
  const { progress } = useUserProgress();
  const [todayReminders, setTodayReminders] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [nipunVisible, setNipunVisible] = useState(false);
  const nipunRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('reminders')
        .select('id, is_completed, due_at')
        .order('due_at', { ascending: true });
      if (data) {
        const today = new Date().toISOString().slice(0, 10);
        const todays = data.filter((r) => r.due_at.slice(0, 10) === today);
        setTodayReminders(todays.length);
        setCompletedToday(todays.filter((r) => r.is_completed).length);
      }
    })();
  }, []);

  // Scroll-reveal for Nipun section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setNipunVisible(true);
        });
      },
      { threshold: 0.2 },
    );
    if (nipunRef.current) observer.observe(nipunRef.current);
    return () => observer.disconnect();
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Pet Lover';

  const stats = [
    { label: 'My Pets', value: pets.length, icon: PawPrint, path: '/my-pets', color: 'text-brand-300', bg: 'bg-brand-500/10' },
    { label: 'My Plants', value: plants.length, icon: Sprout, path: '/my-plants', color: 'text-brand-300', bg: 'bg-brand-500/10' },
    { label: "Today's Tasks", value: todayReminders, icon: Bell, path: '/reminders', color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { label: 'Completed', value: completedToday, icon: CheckCircle2, path: '/reminders', color: 'text-brand-300', bg: 'bg-brand-500/10' },
  ];

  const gamification = [
    { label: 'Care Streak', value: progress.care_streak, suffix: ' days', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-500/10' },
    { label: 'Total XP', value: progress.xp, suffix: '', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
    { label: 'Tasks Done', value: progress.tasks_completed, suffix: '', icon: Trophy, color: 'text-brand-300', bg: 'bg-brand-500/10' },
  ];

  return (
    <div className="pb-24 lg:pb-10">
      {/* Hero greeting */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-brand-500/12 blur-3xl" />
          <div className="absolute right-10 top-20 h-56 w-56 rounded-full bg-accent-500/8 blur-3xl" />
        </div>

        <div className="container-px pt-8 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-300" />
                <span className="eyebrow">My Petziq</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
                Hello, {firstName}!
              </h1>
              <p className="mt-2 text-base text-ink-300">
                Every day is a perfect day to learn, care, and grow.
              </p>
            </div>

            {/* Search + avatar */}
            <div className="flex items-center gap-3">
              <div className="w-full max-w-xs">
                <SearchBar onNavigate={onNavigate} />
              </div>
              <button
                onClick={() => onNavigate('/reminders')}
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.08] text-ink-200 transition hover:bg-white/[0.06]"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {todayReminders > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                    {todayReminders}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate('/progress')}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-sm font-bold text-white shadow-glow"
                aria-label="Profile"
              >
                {firstName.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <button
                key={s.label}
                onClick={() => onNavigate(s.path)}
                className="card-surface group p-5 text-left transition hover:border-white/[0.10] hover:shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl font-bold text-ink-50">{s.value}</span>
                </div>
                <p className="mt-3 text-sm text-ink-300">{s.label}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-ink-400 transition group-hover:text-brand-300">
                  View <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>

          {/* Gamification row */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {gamification.map((g, i) => (
              <div
                key={g.label}
                className="card-surface flex items-center gap-4 p-5 animate-fade-up"
                style={{ animationDelay: `${i * 60 + 240}ms` }}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${g.bg} ${g.color}`}>
                  <g.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold text-ink-50">
                    {g.value}{g.suffix}
                  </p>
                  <p className="text-sm text-ink-400">{g.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Pets section */}
      <section className="container-px mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-brand-300" />
              My Pets
            </h2>
            <p className="mt-1 text-sm text-ink-400">Your furry, feathered, and scaly family members</p>
          </div>
          {pets.length > 0 && (
            <button onClick={() => onNavigate('/my-pets')} className="btn-subtle text-sm">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {petsLoading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <div key={i} className="card-surface overflow-hidden">
                <div className="aspect-[4/3] animate-pulse bg-white/[0.05]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-24 animate-pulse rounded-lg bg-white/[0.05]" />
                  <div className="h-3 w-16 animate-pulse rounded-lg bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<PawPrint className="h-7 w-7" />}
              title="No pets yet"
              description="Add your first pet to start your Petziq journey."
              action={<button onClick={() => onNavigate('/my-pets')} className="btn-primary"><Plus className="h-4 w-4" />Add a Pet</button>}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pets.slice(0, 3).map((pet, i) => (
              <button
                key={pet.id}
                onClick={() => onNavigate(`/my-pets/${pet.id}`)}
                className="card-surface group overflow-hidden text-left transition hover:border-white/[0.10] hover:shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
                  {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-400">
                      <PawPrint className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink-50">{pet.name}</h3>
                    {pet.gender && (
                      <span className="text-sm text-ink-400">{pet.gender === 'Female' ? '♀' : pet.gender === 'Male' ? '♂' : ''}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-400">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                  {pet.age && <p className="mt-1 text-xs text-ink-400">{pet.age}</p>}
                </div>
              </button>
            ))}
            {/* Add pet card */}
            <button
              onClick={() => onNavigate('/my-pets')}
              className="group flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/[0.08] text-ink-400 transition hover:border-brand-500/30 hover:text-brand-300"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] transition group-hover:bg-brand-500/10">
                <Plus className="h-7 w-7" />
              </span>
              <span className="text-sm font-semibold">Add a Pet</span>
            </button>
          </div>
        )}
      </section>

      {/* My Plants section */}
      <section className="container-px mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Sprout className="h-6 w-6 text-brand-300" />
              My Plants
            </h2>
            <p className="mt-1 text-sm text-ink-400">Your growing green collection</p>
          </div>
          {plants.length > 0 && (
            <button onClick={() => onNavigate('/my-plants')} className="btn-subtle text-sm">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {plantsLoading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <div key={i} className="card-surface overflow-hidden">
                <div className="aspect-[4/3] animate-pulse bg-white/[0.05]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-24 animate-pulse rounded-lg bg-white/[0.05]" />
                  <div className="h-3 w-16 animate-pulse rounded-lg bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : plants.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<Sprout className="h-7 w-7" />}
              title="No plants yet"
              description="Add your first plant to start growing your collection."
              action={<button onClick={() => onNavigate('/my-plants')} className="btn-primary"><Plus className="h-4 w-4" />Add a Plant</button>}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plants.slice(0, 3).map((plant, i) => (
              <div
                key={plant.id}
                className="card-surface group overflow-hidden transition hover:border-white/[0.10] hover:shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
                  {plant.photo_url ? (
                    <img src={plant.photo_url} alt={plant.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-400">
                      <Sprout className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-ink-50">{plant.name}</h3>
                  {plant.species && <p className="mt-0.5 text-sm text-ink-400">{plant.species}</p>}
                  {plant.watering_frequency && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-300">
                      <Droplets className="h-3.5 w-3.5 text-brand-400" />
                      {plant.watering_frequency}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {/* Add plant card */}
            <button
              onClick={() => onNavigate('/my-plants')}
              className="group flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/[0.08] text-ink-400 transition hover:border-brand-500/30 hover:text-brand-300"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] transition group-hover:bg-brand-500/10">
                <Plus className="h-7 w-7" />
              </span>
              <span className="text-sm font-semibold">Add a Plant</span>
            </button>
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className="container-px mt-10">
        <h2 className="section-title">Quick access</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Reminders', desc: 'Care schedules', icon: Bell, path: '/reminders', color: 'text-accent-400', bg: 'bg-accent-500/10' },
            { label: 'Favorites', desc: 'Saved items', icon: Heart, path: '/favorites', color: 'text-red-600', bg: 'bg-red-500/10' },
            { label: 'Progress', desc: 'Streaks & XP', icon: TrendingUp, path: '/progress', color: 'text-brand-300', bg: 'bg-brand-500/10' },
            { label: 'Food Guide', desc: 'Pet nutrition', icon: Activity, path: '/food', color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
          ].map((s, i) => (
            <button
              key={s.label}
              onClick={() => onNavigate(s.path)}
              className="card-surface group flex items-center gap-3 p-5 text-left transition hover:border-white/[0.10] animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-sm font-semibold text-ink-50">{s.label}</h3>
                <p className="text-xs text-ink-400">{s.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-400 transition group-hover:translate-x-1 group-hover:text-ink-50" />
            </button>
          ))}
        </div>
      </section>

      {/* Scroll-reveal personal section */}
      <section ref={nipunRef} className="container-px mt-16">
        <div
          className={`grid items-center gap-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-brand-50 via-brand-100/60 to-accent-50/40 p-8 sm:p-12 lg:grid-cols-2 transition-all duration-1000 ${
            nipunVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-brand-300" />
              <span className="eyebrow">About</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
              Meet the person behind Petziq
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-200">
              Hi! I'm Nipun. I built Petziq to help people learn, care, and grow
              with their pets and plants. Whether you're a first-time pet parent
              or a seasoned plant enthusiast, Petziq brings everything you need
              into one friendly, beautiful space.
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink-300">
              From detailed breed guides and care checklists to personal pet
              profiles, plant tracking, and gentle reminders — every feature is
              designed to make caring for your living companions easier and more
              enjoyable.
            </p>
            <button
              onClick={() => onNavigate('/about')}
              className="btn-primary mt-6"
            >
              Learn more about Petziq
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.08] shadow-soft">
                <img
                  src="/petziq-founder-photo.png"
                  alt="Nipun Menon"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
