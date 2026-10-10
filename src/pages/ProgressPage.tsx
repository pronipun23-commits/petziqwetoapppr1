import { Flame, Star, Trophy, Award, CheckCircle2, PawPrint, Sprout, Leaf } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { usePets } from '@/hooks/usePets';
import { usePlantFavorites } from '@/hooks/usePlantFavorites';
import { ACHIEVEMENTS } from '@/data/achievements';
import { SectionHeader, EmptyState } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

interface ProgressPageProps {
  onNavigate: (path: string) => void;
}

export function ProgressPage({ onNavigate: _onNavigate }: ProgressPageProps) {
  const { session } = useAuth();
  const { progress, loading } = useUserProgress();
  const { pets } = usePets();
  const plantFavs = usePlantFavorites();

  if (!session) {
    return (
      <div className="container-px pt-10 pb-24 lg:pb-16">
        <EmptyState icon={<Trophy className="h-7 w-7" />} title="Sign in to track progress" description="Log in to earn XP, build care streaks, and unlock achievements." />
      </div>
    );
  }

  const iconMap: Record<string, typeof Flame> = {
    PawPrint, Sprout, Leaf, CheckCircle2, Flame, Trophy, Star, Award,
  };

  const currentMetrics = {
    pets: pets.length,
    plants: plantFavs.favorites.length,
    tasks: progress.tasks_completed,
    streak: progress.care_streak,
    xp: progress.xp,
  };

  const earnedAchievements = ACHIEVEMENTS.filter((a) => progress.achievements.includes(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !progress.achievements.includes(a.id));

  return (
    <div className="container-px pt-10 pb-24 lg:pb-16">
      <SectionHeader
        eyebrow="Progress"
        title="Your care journey"
        subtitle="Track your streaks, earn XP, and unlock achievements as you care for your pets and plants."
      />

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-500/15 text-orange-600"><Flame className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-3xl font-bold text-ink-50">{progress.care_streak}</p>
                  <p className="text-xs text-ink-400">Day streak</p>
                </div>
              </div>
            </div>
            <div className="card-surface p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-yellow-500/15 text-yellow-600"><Star className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-3xl font-bold text-ink-50">{progress.xp}</p>
                  <p className="text-xs text-ink-400">Total XP</p>
                </div>
              </div>
            </div>
            <div className="card-surface p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-300"><CheckCircle2 className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-3xl font-bold text-ink-50">{progress.tasks_completed}</p>
                  <p className="text-xs text-ink-400">Tasks done</p>
                </div>
              </div>
            </div>
            <div className="card-surface p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-500/15 text-accent-400"><Trophy className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-3xl font-bold text-ink-50">{earnedAchievements.length}</p>
                  <p className="text-xs text-ink-400">Achievements</p>
                </div>
              </div>
            </div>
          </div>

          {progress.care_streak === 0 && progress.xp === 0 && progress.tasks_completed === 0 && (
            <div className="mt-6">
              <EmptyState
                icon={<Flame className="h-7 w-7" />}
                title="Start your care journey"
                description="Complete care tasks for your pets to earn XP, build streaks, and unlock achievements."
              />
            </div>
          )}

          {earnedAchievements.length > 0 && (
            <div className="mt-10">
              <h2 className="section-title">Earned achievements</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {earnedAchievements.map((a) => {
                  const Icon = iconMap[a.icon] ?? Award;
                  return (
                    <div key={a.id} className="card-surface flex items-center gap-4 border-brand-500/20 p-5">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-semibold text-ink-50">{a.name}</h3>
                        <p className="text-xs text-ink-400">{a.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {lockedAchievements.length > 0 && (
            <div className="mt-10">
              <h2 className="section-title">Locked achievements</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lockedAchievements.map((a) => {
                  const Icon = iconMap[a.icon] ?? Award;
                  const currentValue = currentMetrics[a.metric as keyof typeof currentMetrics] ?? 0;
                  const pct = Math.min(100, Math.round((currentValue / a.threshold) * 100));
                  return (
                    <div key={a.id} className="card-surface p-5 opacity-70">
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.05] text-ink-400">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="font-display text-base font-semibold text-ink-50">{a.name}</h3>
                          <p className="text-xs text-ink-400">{a.description}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-ink-400">
                          <span>{currentValue} / {a.threshold}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                          <div className="h-full rounded-full bg-gradient-to-r from-brand-400 via-teal-400 to-ocean-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
