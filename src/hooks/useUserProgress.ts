import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { ACHIEVEMENTS } from '@/data/achievements';

export interface UserProgress {
  xp: number;
  care_streak: number;
  last_care_date: string | null;
  tasks_completed: number;
  achievements: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  care_streak: 0,
  last_care_date: null,
  tasks_completed: 0,
  achievements: [],
};

export function useUserProgress() {
  const { session } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('petziq_user_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });
  const [loading, setLoading] = useState(true);

  // Sync state to local storage whenever progress changes
  const saveProgressLocal = (p: UserProgress) => {
    try {
      localStorage.setItem('petziq_user_progress', JSON.stringify(p));
    } catch {
      // ignore
    }
  };

  const fetchProgress = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('xp, care_streak, last_care_date, tasks_completed, achievements')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!error && data) {
        const merged: UserProgress = {
          xp: Math.max(data.xp ?? 0, progress.xp),
          care_streak: Math.max(data.care_streak ?? 0, progress.care_streak),
          last_care_date: data.last_care_date || progress.last_care_date,
          tasks_completed: Math.max(data.tasks_completed ?? 0, progress.tasks_completed),
          achievements: Array.from(new Set([...(data.achievements ?? []), ...(progress.achievements ?? [])])),
        };
        setProgress(merged);
        saveProgressLocal(merged);
      }
    } catch (e) {
      console.warn('fetchProgress fallback to local cache:', e);
    } finally {
      setLoading(false);
    }
  }, [session, progress.xp, progress.care_streak, progress.tasks_completed, progress.achievements, progress.last_care_date]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (!session) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('xp, care_streak, last_care_date, tasks_completed, achievements')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (cancelled) return;
        if (!error && data) {
          const merged: UserProgress = {
            xp: Math.max(data.xp ?? 0, progress.xp),
            care_streak: Math.max(data.care_streak ?? 0, progress.care_streak),
            last_care_date: data.last_care_date || progress.last_care_date,
            tasks_completed: Math.max(data.tasks_completed ?? 0, progress.tasks_completed),
            achievements: Array.from(new Set([...(data.achievements ?? []), ...(progress.achievements ?? [])])),
          };
          setProgress(merged);
          saveProgressLocal(merged);
        }
      } catch (err: any) {
        console.warn('useUserProgress initial fetch error:', err?.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  const addXp = useCallback(
    async (amount: number) => {
      const newXp = progress.xp + amount;
      const newAchievements = checkAchievements({ ...progress, xp: newXp });
      const updated: UserProgress = { ...progress, xp: newXp, achievements: newAchievements };
      setProgress(updated);
      saveProgressLocal(updated);

      if (session) {
        // Try RPC first, fallback to direct upsert
        try {
          const { error } = await supabase.rpc('add_xp', {
            p_user_id: session.user.id,
            p_amount: amount,
          });
          if (error) throw error;
        } catch {
          try {
            await supabase
              .from('user_progress')
              .upsert({
                user_id: session.user.id,
                xp: updated.xp,
                achievements: updated.achievements,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id' });
          } catch {
            // local cache holds state
          }
        }
      }
    },
    [session, progress],
  );

  const recordCareTask = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);

    let nextStreak = progress.care_streak;
    if (!progress.last_care_date) {
      nextStreak = 1;
    } else if (progress.last_care_date === yesterday) {
      nextStreak += 1;
    } else if (progress.last_care_date !== today) {
      nextStreak = 1;
    }

    const updated: UserProgress = {
      ...progress,
      xp: progress.xp + 25,
      tasks_completed: progress.tasks_completed + 1,
      care_streak: nextStreak,
      last_care_date: today,
    };
    updated.achievements = checkAchievements(updated);

    setProgress(updated);
    saveProgressLocal(updated);

    if (session) {
      try {
        const { error } = await supabase.rpc('record_care_task', {
          p_user_id: session.user.id,
        });
        if (error) throw error;
      } catch {
        try {
          await supabase
            .from('user_progress')
            .upsert({
              user_id: session.user.id,
              xp: updated.xp,
              tasks_completed: updated.tasks_completed,
              care_streak: updated.care_streak,
              last_care_date: today,
              achievements: updated.achievements,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        } catch {
          // local cache holds state
        }
      }
    }
  }, [session, progress]);

  const checkAndAwardAchievements = useCallback(
    async (metrics: { pets?: number; plants?: number; memories?: number; tags?: number; community?: number }) => {
      const updated = { ...progress };
      let xpBonus = 0;

      const checkMetric = (metricName: 'pets' | 'plants' | 'memories' | 'tags' | 'community', count: number, rewardXp: number) => {
        ACHIEVEMENTS.filter((a) => a.metric === metricName).forEach((a) => {
          if (count >= a.threshold && !updated.achievements.includes(a.id)) {
            updated.achievements = [...updated.achievements, a.id];
            xpBonus += rewardXp;
          }
        });
      };

      if (metrics.pets !== undefined) checkMetric('pets', metrics.pets, 50);
      if (metrics.plants !== undefined) checkMetric('plants', metrics.plants, 50);
      if (metrics.memories !== undefined) checkMetric('memories', metrics.memories, 75);
      if (metrics.tags !== undefined) checkMetric('tags', metrics.tags, 100);
      if (metrics.community !== undefined) checkMetric('community', metrics.community, 50);

      updated.xp += xpBonus;
      const allAchievements = checkAchievements(updated);
      updated.achievements = allAchievements;

      setProgress(updated);
      saveProgressLocal(updated);

      if (session) {
        try {
          await supabase
            .from('user_progress')
            .upsert({
              user_id: session.user.id,
              xp: updated.xp,
              achievements: updated.achievements,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        } catch (err: any) {
          console.warn('checkAndAwardAchievements update:', err?.message);
        }
      }
    },
    [session, progress],
  );

  return {
    progress,
    loading,
    addXp,
    recordCareTask,
    checkAndAwardAchievements,
    refetch: fetchProgress,
  };
}

function checkAchievements(p: UserProgress): string[] {
  const earned = new Set(p.achievements);
  ACHIEVEMENTS.forEach((a) => {
    let value = 0;
    if (a.metric === 'xp') value = p.xp;
    else if (a.metric === 'tasks') value = p.tasks_completed;
    else if (a.metric === 'streak') value = p.care_streak;
    if (value >= a.threshold) earned.add(a.id);
  });
  return Array.from(earned);
}
