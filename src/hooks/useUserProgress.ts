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
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!session) {
      setProgress(DEFAULT_PROGRESS);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('user_progress')
      .select('xp, care_streak, last_care_date, tasks_completed, achievements')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!error && data) {
      setProgress({
        xp: data.xp ?? 0,
        care_streak: data.care_streak ?? 0,
        last_care_date: data.last_care_date,
        tasks_completed: data.tasks_completed ?? 0,
        achievements: data.achievements ?? [],
      });
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (!session) {
        if (!cancelled) {
          setProgress(DEFAULT_PROGRESS);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('user_progress')
        .select('xp, care_streak, last_care_date, tasks_completed, achievements')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error('useUserProgress fetch error:', error.message);
      }
      if (!error && data) {
        setProgress({
          xp: data.xp ?? 0,
          care_streak: data.care_streak ?? 0,
          last_care_date: data.last_care_date,
          tasks_completed: data.tasks_completed ?? 0,
          achievements: data.achievements ?? [],
        });
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  const addXp = useCallback(
    async (amount: number) => {
      if (!session) return;
      const { data, error } = await supabase.rpc('add_xp', {
        p_user_id: session.user.id,
        p_amount: amount,
      });
      if (error) {
        console.error('addXp error:', error.message);
        return;
      }
      if (data !== null) {
        setProgress((prev) => {
          const newXp = prev.xp + amount;
          const newAchievements = checkAchievements({ ...prev, xp: newXp });
          return { ...prev, xp: newXp, achievements: newAchievements };
        });
      }
    },
    [session],
  );

  const recordCareTask = useCallback(async () => {
    if (!session) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase.rpc('record_care_task', {
      p_user_id: session.user.id,
    });
    if (error) {
      console.error('recordCareTask error:', error.message);
      return;
    }
    if (data) {
      setProgress((prev) => {
        const updated = {
          ...prev,
          xp: prev.xp + 10,
          tasks_completed: prev.tasks_completed + 1,
          care_streak: data ?? prev.care_streak,
          last_care_date: today,
        };
        return { ...updated, achievements: checkAchievements(updated) };
      });
    }
  }, [session]);

  const checkAndAwardAchievements = useCallback(
    async (metrics: { pets?: number; plants?: number; memories?: number; tags?: number; community?: number }) => {
      if (!session) return;
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

      try {
        await supabase
          .from('user_progress')
          .update({
            xp: updated.xp,
            achievements: updated.achievements,
          })
          .eq('user_id', session.user.id);
      } catch (err: any) {
        console.warn('checkAndAwardAchievements update:', err?.message);
      }

      setProgress(updated);
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
