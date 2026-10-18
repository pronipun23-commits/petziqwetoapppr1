import type { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-pet', name: 'Welcome Home', description: 'Add your first pet to Petziq', icon: 'PawPrint', threshold: 1, metric: 'pets' },
  { id: 'pet-family', name: 'Pet Family', description: 'Add 3 pets to your profile', icon: 'Heart', threshold: 3, metric: 'pets' },
  { id: 'first-plant', name: 'Green Thumb', description: 'Save your first plant', icon: 'Sprout', threshold: 1, metric: 'plants' },
  { id: 'plant-collector', name: 'Plant Collector', description: 'Save 10 plants to your collection', icon: 'Leaf', threshold: 10, metric: 'plants' },
  { id: 'first-task', name: 'Getting Started', description: 'Complete your first care task', icon: 'CheckCircle2', threshold: 1, metric: 'tasks' },
  { id: 'task-master', name: 'Task Master', description: 'Complete 20 care tasks', icon: 'CheckSquare', threshold: 20, metric: 'tasks' },
  { id: 'streak-7', name: '7-Day Streak', description: 'Maintain a 7-day care streak', icon: 'Flame', threshold: 7, metric: 'streak' },
  { id: 'streak-30', name: 'Dedicated Keeper', description: 'Maintain a 30-day care streak', icon: 'Trophy', threshold: 30, metric: 'streak' },
  { id: 'xp-100', name: 'Rising Keeper', description: 'Earn 100 XP', icon: 'Star', threshold: 100, metric: 'xp' },
  { id: 'xp-500', name: 'Expert Keeper', description: 'Earn 500 XP', icon: 'Award', threshold: 500, metric: 'xp' },
  { id: 'xp-1000', name: 'Master Companion', description: 'Reach 1,000 XP and unlock Master rank', icon: 'Crown', threshold: 1000, metric: 'xp' },
  { id: 'first-scrapbook', name: 'Memory Maker', description: 'Add your first pet memory milestone', icon: 'Sparkles', threshold: 1, metric: 'memories' as any },
  { id: 'smart-tag-guardian', name: 'Guardian Protector', description: 'Order or activate a Petziq Smart Tag', icon: 'Shield', threshold: 1, metric: 'tags' as any },
  { id: 'community-connector', name: 'Community Companion', description: 'Connect with fellow pet lovers', icon: 'MessageCircle', threshold: 1, metric: 'community' as any },
];
