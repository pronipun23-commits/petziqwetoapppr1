import { useState, useEffect } from 'react';
import { Flame, Star, Trophy, Award, CheckCircle2, PawPrint, Sprout, Leaf, Crown, Shield, Heart, Sparkles, MessageCircle, User } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { usePets } from '@/hooks/usePets';
import { usePlantFavorites } from '@/hooks/usePlantFavorites';
import { ACHIEVEMENTS } from '@/data/achievements';
import { SectionHeader, EmptyState } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface ProgressPageProps {
  onNavigate: (path: string) => void;
}

export function ProgressPage({ onNavigate: _onNavigate }: ProgressPageProps) {
  const { session, profile } = useAuth();
  const { progress, loading } = useUserProgress();
  const { pets } = usePets();
  const plantFavs = usePlantFavorites();

  const iconMap: Record<string, any> = {
    PawPrint, Sprout, Leaf, CheckCircle2, Flame, Trophy, Star, Award, Crown, Shield, Heart, Sparkles, MessageCircle,
  };

  const currentMetrics = {
    pets: pets.length,
    plants: plantFavs.favorites.length,
    tasks: progress.tasks_completed,
    streak: progress.care_streak,
    xp: progress.xp,
  };

  interface LeaderboardEntry {
    id: string;
    name: string;
    badge: string;
    streak: number;
    xp: number;
    isUser?: boolean;
    avatar: string;
  }

  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchRealLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        // Query real user_progress joined with or mapped to profiles
        const { data: progressRows } = await supabase
          .from('user_progress')
          .select('user_id, xp, care_streak')
          .order('xp', { ascending: false })
          .limit(20);

        const { data: profileRows } = await supabase
          .from('profiles')
          .select('id, full_name, pet_name')
          .limit(50);

        if (!active) return;

        const profileMap = new Map<string, { full_name: string; pet_name: string }>();
        (profileRows || []).forEach((p: any) => {
          profileMap.set(p.id, { full_name: p.full_name, pet_name: p.pet_name });
        });

        const list: LeaderboardEntry[] = [];
        const seenIds = new Set<string>();

        if (progressRows && progressRows.length > 0) {
          progressRows.forEach((row: any) => {
            const p = profileMap.get(row.user_id);
            const isCurrent = session?.user?.id === row.user_id;
            const displayName = isCurrent
              ? profile?.full_name ? `${profile.full_name} (You)` : 'You'
              : p?.full_name
              ? p.pet_name ? `${p.full_name} & ${p.pet_name}` : p.full_name
              : 'Pet Guardian';

            const userXp = isCurrent ? Math.max(progress.xp, row.xp ?? 0) : (row.xp ?? 0);
            const userStreak = isCurrent ? Math.max(progress.care_streak, row.care_streak ?? 0) : (row.care_streak ?? 0);

            const badge = userXp >= 1000
              ? 'Master Companion'
              : userXp >= 500
              ? 'Expert Keeper'
              : userXp >= 100
              ? 'Rising Keeper'
              : 'Novice Companion';

            list.push({
              id: row.user_id,
              name: displayName,
              badge,
              streak: userStreak,
              xp: userXp,
              isUser: isCurrent,
              avatar: displayName.charAt(0).toUpperCase(),
            });
            seenIds.add(row.user_id);
          });
        }

        // If current user has progress and is not yet in the list, add them
        if (session && !seenIds.has(session.user.id)) {
          const myName = profile?.full_name ? `${profile.full_name} (You)` : 'You';
          list.push({
            id: session.user.id,
            name: myName,
            badge: progress.xp >= 1000 ? 'Master Companion' : progress.xp >= 500 ? 'Expert Keeper' : progress.xp >= 100 ? 'Rising Keeper' : 'Novice Companion',
            streak: progress.care_streak,
            xp: progress.xp,
            isUser: true,
            avatar: myName.charAt(0).toUpperCase(),
          });
        }

        // Sort strictly by XP descending
        list.sort((a, b) => b.xp - a.xp);
        setLeaderboardUsers(list);
      } catch {
        // Fallback exclusively to current logged in user
        if (session && active) {
          const myName = profile?.full_name ? `${profile.full_name} (You)` : 'You';
          setLeaderboardUsers([{
            id: session.user.id,
            name: myName,
            badge: progress.xp >= 1000 ? 'Master Companion' : progress.xp >= 500 ? 'Expert Keeper' : progress.xp >= 100 ? 'Rising Keeper' : 'Novice Companion',
            streak: progress.care_streak,
            xp: progress.xp,
            isUser: true,
            avatar: myName.charAt(0).toUpperCase(),
          }]);
        }
      } finally {
        if (active) setLoadingLeaderboard(false);
      }
    };

    fetchRealLeaderboard();
    return () => { active = false; };
  }, [session, profile, progress.xp, progress.care_streak]);

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

          {/* Custom Leaderboard & Ranks */}
          <div className="mt-12 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                  <Trophy className="h-3.5 w-3.5" />
                  Petziq Companion Leaderboard
                </div>
                <h2 className="mt-2 text-xl font-bold text-ink-50 font-display">Top Care Keepers</h2>
                <p className="text-xs text-ink-400 mt-0.5">Rank up your care streak and XP to earn high-tier keeper badges and title honors.</p>
              </div>

              {/* Current User Rank Badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5">
                <Crown className="h-5 w-5 text-amber-300" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Your Rank</p>
                  <p className="text-sm font-bold text-ink-50">
                    {progress.xp >= 1000 ? 'Master Companion' : progress.xp >= 500 ? 'Expert Keeper' : progress.xp >= 100 ? 'Rising Keeper' : 'Novice Companion'}
                  </p>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/60 divide-y divide-white/[0.06]">
              {loadingLeaderboard ? (
                <div className="p-8 text-center text-xs text-ink-400 flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
                  Updating leaderboard ranks...
                </div>
              ) : leaderboardUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Trophy className="h-8 w-8 text-ink-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-ink-200">No care activities recorded yet</p>
                  <p className="text-xs text-ink-400 mt-1">
                    Complete your daily pet care tasks to register XP and lead the community leaderboard.
                  </p>
                </div>
              ) : (
                leaderboardUsers.map((user, idx) => (
                  <div
                    key={user.id || idx}
                    className={`flex items-center justify-between p-3.5 sm:p-4 text-xs sm:text-sm transition ${
                      user.isUser ? 'bg-brand-500/10 border-l-4 border-l-brand-400 font-medium' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className={`w-6 text-center font-bold font-mono ${idx === 0 ? 'text-amber-400 text-base' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-ink-400'}`}>
                        #{idx + 1}
                      </span>
                      <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-teal-500 text-xs font-bold text-ink-950">
                        {user.avatar}
                      </div>
                      <div>
                        <p className={`font-semibold ${user.isUser ? 'text-brand-300' : 'text-ink-50'}`}>
                          {user.name}
                        </p>
                        <span className="inline-block text-[10px] text-ink-400 bg-white/[0.05] px-2 py-0.5 rounded-full mt-0.5">
                          {user.badge}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 sm:gap-8">
                      <div className="text-right">
                        <p className="font-mono font-bold text-amber-400">{user.streak}d</p>
                        <p className="text-[10px] text-ink-500">Streak</p>
                      </div>
                      <div className="text-right min-w-[50px]">
                        <p className="font-mono font-bold text-emerald-400">{user.xp} XP</p>
                        <p className="text-[10px] text-ink-500">Experience</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
