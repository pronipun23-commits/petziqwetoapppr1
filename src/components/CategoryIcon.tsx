import {
  Dog,
  Cat,
  Bird,
  Fish,
  Rabbit,
  Rat,
  Turtle,
  Bug,
  Leaf,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Dog,
  Cat,
  Bird,
  Fish,
  Rabbit,
  Rat,
  Turtle,
  Bug,
  Leaf,
  Sparkles,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} />;
}
