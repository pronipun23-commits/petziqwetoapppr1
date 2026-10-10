import {
  PawPrint, ShieldCheck, MapPin, Cloud, Gem, Bone, Heart, Square,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import {
  TagProductPreview,
  TAG_COLORS,
  type TagShape,
  type TagColor,
} from '@/components/TagProductPreview';

interface ShowcasePosterArtProps {
  petName: string;
  tagId: string;
}

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Instant Access',
    description: "Scan the QR to view your pet's profile, health info & more.",
  },
  {
    icon: MapPin,
    title: 'Lost Pet Recovery',
    description: 'Helps bring your pet back home faster.',
  },
  {
    icon: Cloud,
    title: 'Cloud Connected',
    description: 'Updates in real-time, always accessible.',
  },
  {
    icon: Gem,
    title: 'Durable & Stylish',
    description: 'Built to last, designed for everyday adventures.',
  },
];

const SHAPE_CHIPS: { id: TagShape; label: string }[] = [
  { id: 'round', label: 'Round' },
  { id: 'bone', label: 'Bone' },
  { id: 'heart', label: 'Heart' },
  { id: 'rectangle', label: 'Rectangle' },
];

const TILE_STYLES: { shape: TagShape; color: TagColor }[] = [
  { shape: 'round', color: 'black' },
  { shape: 'heart', color: 'pink' },
  { shape: 'bone', color: 'blue' },
  { shape: 'rectangle', color: 'silver' },
];

/** Same swatch fills the configurator uses, kept visually identical. */
const SWATCHES: Record<TagColor, string> = {
  black: '#0b0f14',
  blue: '#2563eb',
  pink: '#ec4899',
  silver: 'linear-gradient(135deg,#f8fafc,#94a3b8)',
  gold: 'linear-gradient(135deg,#fde68a,#d97706)',
};

/**
 * Self-rendered recreation of the official Petziq Smart Tag showcase poster.
 * Used until `public/petziq-smart-tag-showcase.png` is added; every tag is the
 * real TagProductPreview so the artwork always matches the actual product.
 */
export function ShowcasePosterArt({ petName, tagId }: ShowcasePosterArtProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 text-left">
      {/* Top — hero scene */}
      <div className="relative bg-[radial-gradient(120%_120%_at_72%_18%,#272c38_0%,#151822_45%,#0a0c11_100%)]">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:gap-4">
          {/* Copy column */}
          <div className="relative">
            <Logo size={30} />
            <p className="mt-7 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-white">Smart </span>
              <span className="text-[#4da3ff]">Tag</span>
            </p>
            <p className="mt-2.5 text-lg font-medium text-white/85">
              A safer tomorrow for your pets.
            </p>

            <div className="mt-8 space-y-5">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sky-400/50 bg-sky-500/10 text-sky-300">
                    <feature.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{feature.title}</p>
                    <p className="mt-0.5 max-w-[30ch] text-xs leading-relaxed text-white/60">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <PawPrint className="mt-9 h-5 w-5 text-white/25" />
          </div>

          {/* Product column — front and back of the real tag */}
          <div className="relative hidden items-center justify-center gap-6 lg:flex">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.045] blur-3xl" />
            <div className="relative flex -rotate-6 flex-col items-center">
              <TagProductPreview
                petName={petName}
                tagId={tagId}
                shape="round"
                color="black"
                side="front"
              />
              <p className="mt-3 text-sm font-medium text-white/80">Front</p>
            </div>
            <div className="relative mt-14 flex rotate-6 flex-col items-center">
              <TagProductPreview
                petName={petName}
                tagId={tagId}
                shape="round"
                color="silver"
                side="back"
              />
              <p className="mt-3 text-sm font-medium text-white/80">Back</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — customiser preview + shape/colour tiles */}
      <div className="border-t border-white/10 bg-[#0d1119]">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <p className="font-display text-xl font-bold text-white">Customise Your Tag</p>
            <p className="mt-1.5 text-sm text-white/60">
              Choose your shape, colour and add your pet's name.
            </p>

            <div className="mt-6 grid max-w-sm grid-cols-4 gap-2.5">
              {SHAPE_CHIPS.map((chip, index) => (
                <div
                  key={chip.id}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 ${
                    index === 0
                      ? 'border-sky-400/60 bg-sky-500/10'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <span className={index === 0 ? 'text-sky-300' : 'text-indigo-200/80'}>
                    {chip.id === 'round' && <span className="block h-4 w-4 rounded-full bg-current" />}
                    {chip.id === 'bone' && <Bone className="h-4 w-4" fill="currentColor" strokeWidth={0} />}
                    {chip.id === 'heart' && <Heart className="h-4 w-4" fill="currentColor" strokeWidth={0} />}
                    {chip.id === 'rectangle' && (
                      <Square className="h-4 w-4 rounded-[4px]" fill="currentColor" strokeWidth={0} />
                    )}
                  </span>
                  <span className="text-[10px] font-medium text-white/70">{chip.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex max-w-sm justify-between gap-2">
              {TAG_COLORS.map((c, index) => (
                <div key={c.id} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`h-9 w-9 rounded-full border-2 ${
                      index === 0 ? 'border-white/40' : 'border-white/20'
                    }`}
                    style={{ background: SWATCHES[c.id] }}
                  />
                  <span className="text-[10px] font-medium text-white/60">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {TILE_STYLES.map((tile) => (
              <div
                key={`${tile.shape}-${tile.color}`}
                className="grid h-[150px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1b202c] to-[#0b0f19] sm:h-[170px]"
              >
                <div className="scale-[0.58] sm:scale-[0.64]">
                  <TagProductPreview
                    petName={petName}
                    tagId={tagId}
                    shape={tile.shape}
                    color={tile.color}
                    side="front"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/[0.07] px-8 py-4 sm:px-10">
          <PawPrint className="h-4 w-4 text-white/30" />
          <p className="text-xs text-white/40">More than a tag. It's peace of mind.</p>
          <Logo size={20} className="ml-auto" />
        </div>
      </div>
    </div>
  );
}
