import type { Category, CategoryId } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'dogs',
    name: 'Dogs',
    tagline: 'Loyal companions',
    description:
      'Domesticated descendants of wolves, dogs form deep bonds with humans and thrive on structure, training, and activity.',
    icon: 'Dog',
    accent: 'from-amber-500/20 to-orange-500/5',
    image:
      'https://images.pexels.com/photos/1490903/pexels-photo-1490903.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'cats',
    name: 'Cats',
    tagline: 'Independent & graceful',
    description:
      'Curious, agile, and quietly affectionate, cats balance independence with strong territorial routines.',
    icon: 'Cat',
    accent: 'from-slate-400/20 to-indigo-400/5',
    image:
      'https://images.pexels.com/photos/1045274/pexels-photo-1045274.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'birds',
    name: 'Birds',
    tagline: 'Song & color',
    description:
      'Intelligent and social, birds require mental stimulation, flight time, and species-specific diets.',
    icon: 'Bird',
    accent: 'from-sky-400/20 to-cyan-400/5',
    image:
      'https://images.pexels.com/photos/34595523/pexels-photo-34595523.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'fish',
    name: 'Fish',
    tagline: 'Living aquariums',
    description:
      'A serene hobby demanding water chemistry precision, filtration, and careful species compatibility.',
    icon: 'Fish',
    accent: 'from-blue-400/20 to-teal-400/5',
    image:
      'https://images.pexels.com/photos/29704986/pexels-photo-29704986.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'rabbits',
    name: 'Rabbits',
    tagline: 'Gentle & social',
    description:
      'Highly social prey animals that need space to hop, chew, and bond with companions.',
    icon: 'Rabbit',
    accent: 'from-rose-400/20 to-pink-400/5',
    image:
      'https://images.pexels.com/photos/3268753/pexels-photo-3268753.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'hamsters',
    name: 'Hamsters',
    tagline: 'Pocket pets',
    description:
      'Solitary nocturnal foragers that burrow, hoard, and run for miles each night.',
    icon: 'Rat',
    accent: 'from-yellow-400/20 to-amber-400/5',
    image:
      'https://images.pexels.com/photos/33914110/pexels-photo-33914110.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'gerbils',
    name: 'Gerbils',
    tagline: 'Burrowing desert dynamos',
    description:
      'Diurnal desert rodents that dig, chew, and live in social pairs — curious and low-odor.',
    icon: 'Rat',
    accent: 'from-amber-300/20 to-yellow-500/5',
    image:
      'https://images.pexels.com/photos/30970832/pexels-photo-30970832.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'guinea-pigs',
    name: 'Guinea Pigs',
    tagline: 'Vocal & herd-oriented',
    description:
      'Chatty herd animals that wheek for food, need vitamin C, and thrive in pairs or groups.',
    icon: 'Rabbit',
    accent: 'from-orange-400/20 to-rose-400/5',
    image:
      'https://images.pexels.com/photos/1093126/pexels-photo-1093126.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'ferrets',
    name: 'Ferrets',
    tagline: 'Playful & mischievous',
    description:
      'Energetic mustelids that sleep hard and play harder, requiring large cages and daily out-time.',
    icon: 'Rabbit',
    accent: 'from-stone-400/20 to-amber-700/5',
    image:
      'https://images.pexels.com/photos/5403275/pexels-photo-5403275.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'hedgehogs',
    name: 'Hedgehogs',
    tagline: 'Spiky & shy',
    description:
      'Nocturnal insectivores that self-anoint, wheel-run all night, and need warm environments.',
    icon: 'Bird',
    accent: 'from-emerald-400/20 to-lime-400/5',
    image:
      'https://images.pexels.com/photos/11654383/pexels-photo-11654383.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'chinchillas',
    name: 'Chinchillas',
    tagline: 'Cloud-soft & agile',
    description:
      'Andean rodents with the densest fur of any land mammal, needing dust baths and cool temps.',
    icon: 'Rabbit',
    accent: 'from-violet-400/20 to-fuchsia-400/5',
    image:
      'https://images.pexels.com/photos/4547060/pexels-photo-4547060.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'turtles',
    name: 'Turtles',
    tagline: 'Ancient & slow',
    description:
      'Long-lived reptiles needing precise UVB, basking gradients, and clean aquatic or terrestrial setups.',
    icon: 'Turtle',
    accent: 'from-teal-400/20 to-emerald-600/5',
    image:
      'https://images.pexels.com/photos/26599669/pexels-photo-26599669.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'snakes',
    name: 'Snakes',
    tagline: 'Silent & sleek',
    description:
      'Cold-blooded predators requiring thermal gradients, secure enclosures, and whole-prey diets.',
    icon: 'Bug',
    accent: 'from-lime-500/20 to-green-700/5',
    image:
      'https://images.pexels.com/photos/18012500/pexels-photo-18012500.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'lizards',
    name: 'Lizards',
    tagline: 'Basking & bright',
    description:
      'Diverse reptiles from geckos to monitors, each with specific UVB, humidity, and diet needs.',
    icon: 'Leaf',
    accent: 'from-amber-400/20 to-yellow-600/5',
    image:
      'https://images.pexels.com/photos/6002806/pexels-photo-6002806.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'exotic-pets',
    name: 'Exotic Pets',
    tagline: 'Rare & remarkable',
    description:
      'Uncommon companions from sugar gliders to axolotls, demanding specialized husbandry and research.',
    icon: 'Sparkles',
    accent: 'from-fuchsia-400/20 to-purple-500/5',
    image:
      'https://images.pexels.com/photos/7173565/pexels-photo-7173565.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CategoryId, Category>,
);
