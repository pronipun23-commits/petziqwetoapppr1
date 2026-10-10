export type PlantCategoryId =
  | 'indoor'
  | 'outdoor'
  | 'flowering'
  | 'succulent'
  | 'cacti'
  | 'tree'
  | 'herb'
  | 'edible'
  | 'tropical'
  | 'fern'
  | 'easy-care';

export type SunlightLevel = 'Low' | 'Medium' | 'Bright' | 'Direct';
export type WateringLevel = 'Minimal' | 'Low' | 'Moderate' | 'Frequent';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Experienced';

export interface PlantCategory {
  id: PlantCategoryId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

export interface PlantCare {
  watering: string;
  sunlight: string;
  soil: string;
  temperature: string;
  humidity: string;
  fertilizing: string;
}

export interface PlantGrowth {
  matureSize: string;
  growthRate: string;
  lifespan: string;
  bloomTime: string;
}

export interface PlantProblem {
  problem: string;
  cause: string;
  solution: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: PlantCategoryId[];
  environment: 'Indoor' | 'Outdoor' | 'Both';
  sunlight: SunlightLevel;
  watering: WateringLevel;
  soil: string;
  temperature: string;
  difficulty: DifficultyLevel;
  tagline: string;
  summary: string;
  care: PlantCare;
  growth: PlantGrowth;
  commonProblems: PlantProblem[];
  goodFor: string[];
  tips: string[];
  image: string;
  funFact: string;
}

export const PLANT_CATEGORIES: PlantCategory[] = [
  {
    id: 'indoor',
    name: 'Indoor',
    tagline: 'Houseplants for every room',
    description:
      'Plants that thrive indoors — from low-light survivors to statement specimens for bright living rooms.',
    icon: 'Home',
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    tagline: 'Garden & patio plants',
    description:
      'Plants that grow best outdoors in garden beds, patios, and landscapes with natural sunlight.',
    icon: 'TreePine',
  },
  {
    id: 'flowering',
    name: 'Flowering',
    tagline: 'Colorful & bright',
    description:
      'Plants prized for their blooms, adding color and fragrance to indoor and outdoor spaces.',
    icon: 'Flower2',
  },
  {
    id: 'succulent',
    name: 'Succulents',
    tagline: 'Low-water survivors',
    description:
      'Drought-tolerant plants with fleshy leaves that store water — perfect for busy or forgetful owners.',
    icon: 'Sun',
  },
  {
    id: 'cacti',
    name: 'Cacti',
    tagline: 'Spiky & self-sufficient',
    description:
      'Desert-adapted plants that thrive on neglect, needing minimal water and maximum sunlight.',
    icon: 'Sun',
  },
  {
    id: 'tree',
    name: 'Trees',
    tagline: 'Statement pieces',
    description:
      'Larger plants and fruit trees that serve as focal points in gardens or grow into indoor specimens.',
    icon: 'TreePine',
  },
  {
    id: 'herb',
    name: 'Herbs',
    tagline: 'Edible & aromatic',
    description:
      'Practical kitchen herbs you can grow on a windowsill and snip fresh for cooking.',
    icon: 'Sprout',
  },
  {
    id: 'edible',
    name: 'Edible Plants',
    tagline: 'Grow your own food',
    description:
      'Vegetables, fruits, and edible plants you can cultivate at home for a productive garden.',
    icon: 'Sprout',
  },
  {
    id: 'tropical',
    name: 'Tropical',
    tagline: 'Lush & leafy',
    description:
      'Warm-climate foliage plants that bring jungle vibes indoors with bold, dramatic leaves.',
    icon: 'Leaf',
  },
  {
    id: 'fern',
    name: 'Ferns',
    tagline: 'Soft & feathery',
    description:
      'Ancient spore-bearing plants that thrive in humid, shaded environments with delicate fronds.',
    icon: 'Wind',
  },
  {
    id: 'easy-care',
    name: 'Easy Care',
    tagline: 'Beginner-friendly',
    description:
      'Plants that tolerate neglect, low light, and infrequent watering — nearly impossible to kill.',
    icon: 'Heart',
  },
];

export const PLANT_CATEGORY_MAP: Record<PlantCategoryId, PlantCategory> =
  PLANT_CATEGORIES.reduce(
    (acc, c) => {
      acc[c.id] = c;
      return acc;
    },
    {} as Record<PlantCategoryId, PlantCategory>,
  );

export function hasCategory(plant: Plant, categoryId: PlantCategoryId): boolean {
  return plant.category.includes(categoryId);
}
