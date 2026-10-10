export type {
  PlantCategoryId,
  SunlightLevel,
  WateringLevel,
  DifficultyLevel,
  PlantCategory,
  PlantCare,
  PlantGrowth,
  PlantProblem,
  Plant,
} from './plants/types';

export {
  PLANT_CATEGORIES,
  PLANT_CATEGORY_MAP,
  hasCategory,
} from './plants/types';

import { indoorPlants } from './plants/indoor-plants';
import { succulentCactiPlants } from './plants/succulents-cacti';
import { floweringPlants } from './plants/flowering-plants';
import { treePlants } from './plants/tree-plants';
import { herbEdiblePlants } from './plants/herb-edible-plants';
import { tropicalPlants } from './plants/tropical-plants';
import { additionalPlants } from './plants/additional-plants';
import type { Plant } from './plants/types';

export const PLANTS: Plant[] = [
  ...indoorPlants,
  ...succulentCactiPlants,
  ...floweringPlants,
  ...treePlants,
  ...herbEdiblePlants,
  ...tropicalPlants,
  ...additionalPlants,
];

export const PLANT_MAP: Record<string, Plant> = PLANTS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, Plant>,
);
