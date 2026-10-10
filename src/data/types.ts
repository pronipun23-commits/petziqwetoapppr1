export type CategoryId =
  | 'dogs'
  | 'cats'
  | 'birds'
  | 'fish'
  | 'rabbits'
  | 'hamsters'
  | 'gerbils'
  | 'guinea-pigs'
  | 'ferrets'
  | 'hedgehogs'
  | 'chinchillas'
  | 'turtles'
  | 'snakes'
  | 'lizards'
  | 'exotic-pets';

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  icon: string; // lucide icon name
  accent: string; // tailwind gradient stops
  image: string;
}

export interface BreedStats {
  temperament: string[];
  lifespan: string;
  size: string;
  weight: string;
  energy: 'Low' | 'Medium' | 'High' | 'Very High';
  careLevel: 'Beginner' | 'Intermediate' | 'Experienced' | 'Expert';
  grooming: 'Minimal' | 'Low' | 'Moderate' | 'High';
  trainability?: 'Low' | 'Moderate' | 'High' | 'Very High';
}

export interface Breed {
  id: string;
  name: string;
  category: CategoryId;
  origin: string;
  tagline: string;
  summary: string;
  description: string[];
  stats: BreedStats;
  traits: {
    label: string;
    value: number; // 0-100
  }[];
  care: {
    diet: string;
    housing: string;
    exercise: string;
    grooming: string;
    health: string;
  };
  goodFor: string[];
  notGoodFor: string[];
  image: string;
  gallery?: string[];
  funFact: string;
}

export interface CareGuide {
  id: string;
  title: string;
  category: CategoryId | 'all';
  readTime: string;
  excerpt: string;
  sections: { heading: string; body: string }[];
}

export interface ProblemTopic {
  id: string;
  title: string;
  category: CategoryId | 'all';
  symptoms: string;
  guidance: string[];
  severity: 'Low' | 'Medium' | 'High';
}

export type GuideCategory =
  | 'pet-care'
  | 'plant-care'
  | 'feeding'
  | 'exercise'
  | 'grooming'
  | 'maintenance'
  | 'problems'
  | 'beginner';

export interface FoodGuideItem {
  id: string;
  name: string;
  petType: string;
  category: 'staple' | 'supplement' | 'treat' | 'avoid';
  generalInfo: string;
  safetyNotes: string;
  suitable: string[];
  unsuitable: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  metric: 'pets' | 'plants' | 'tasks' | 'streak' | 'xp';
}
