import { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Sun,
  Droplets,
  Sprout,
  Thermometer,
  CheckCircle2,
  Sparkles,
  Wind,
  Bell,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { PLANT_MAP, PLANT_CATEGORY_MAP } from '@/data/plants';
import { Stat } from '@/components/ui';
import { QuickReminderModal } from '@/components/QuickReminderModal';
import { useAuth } from '@/hooks/useAuth';

interface PlantDetailPageProps {
  plantId: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigate: (path: string) => void;
  onRequireAuth: (featureLabel: string) => void;
}

export function PlantDetailPage({
  plantId,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  onRequireAuth,
}: PlantDetailPageProps) {
  const { session } = useAuth();
  const [showReminder, setShowReminder] = useState(false);
  const plant = PLANT_MAP[plantId];

  if (!plant) {
    return (
      <div className="container-px pt-20 pb-24 lg:pb-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-50">Plant not found</h1>
        <p className="mt-3 text-ink-300">We could not find that plant.</p>
        <button onClick={() => onNavigate('/plants')} className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to plants
        </button>
      </div>
    );
  }

  const careEntries = [
    { icon: Droplets, label: 'Watering', text: plant.care.watering },
    { icon: Sun, label: 'Sunlight', text: plant.care.sunlight },
    { icon: Sprout, label: 'Soil', text: plant.care.soil },
    { icon: Thermometer, label: 'Temperature', text: plant.care.temperature },
    { icon: Wind, label: 'Humidity', text: plant.care.humidity },
    { icon: Sparkles, label: 'Fertilizing', text: plant.care.fertilizing },
  ];

  const growthEntries = [
    { label: 'Mature size', value: plant.growth.matureSize },
    { label: 'Growth rate', value: plant.growth.growthRate },
    { label: 'Lifespan', value: plant.growth.lifespan },
    { label: 'Bloom time', value: plant.growth.bloomTime },
  ];

  const handleReminderClick = () => {
    if (!session) {
      onRequireAuth('Add plant reminders');
      return;
    }
    setShowReminder(true);
  };

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <button
        onClick={() => onNavigate('/plants')}
        className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-ink-50"
      >
        <ArrowLeft className="h-4 w-4" />
        All plants
      </button>

      {/* Hero */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08]">
          <img
            src={plant.image}
            alt={plant.name}
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-1.5">
            {plant.category.map((catId) => (
              <span key={catId} className="chip">
                {PLANT_CATEGORY_MAP[catId]?.name}
              </span>
            ))}
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl">
            {plant.name}
          </h1>
          <p className="mt-1 text-base italic text-ink-400">{plant.scientificName}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-200">{plant.summary}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Sunlight" value={plant.sunlight} />
            <Stat label="Watering" value={plant.watering} />
            <Stat label="Difficulty" value={plant.difficulty} />
            <Stat label="Environment" value={plant.environment} />
            <Stat label="Temperature" value={plant.temperature} />
            <Stat label="Soil" value={plant.soil} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onToggleFavorite(plant.id)}
              className={isFavorite ? 'btn-primary' : 'btn-ghost'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-ink-950' : ''}`} />
              {isFavorite ? 'Saved' : 'Save plant'}
            </button>
            <button onClick={handleReminderClick} className="btn-ghost">
              <Bell className="h-4 w-4" />
              Add Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Growth info */}
      <div className="mt-12">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 text-brand-300" />
          <h2 className="section-title">Growth information</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {growthEntries.map((g) => (
            <div key={g.label} className="card-surface p-5">
              <div className="text-xs uppercase tracking-wide text-ink-400">{g.label}</div>
              <div className="mt-2 font-display text-sm font-semibold text-ink-50">{g.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Care details */}
      <div className="mt-12">
        <h2 className="section-title">Care guide</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careEntries.map((entry) => (
            <div key={entry.label} className="card-surface p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-300">
                  <entry.icon className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-semibold text-ink-50">{entry.label}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{entry.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common problems */}
      {plant.commonProblems.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-accent-400" />
            <h2 className="section-title">Common problems</h2>
          </div>
          <div className="mt-6 space-y-3">
            {plant.commonProblems.map((p, i) => (
              <div key={i} className="card-surface p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-semibold text-ink-50">{p.problem}</h3>
                    <p className="mt-1 text-xs text-ink-400">
                      <span className="font-semibold text-accent-400">Cause: </span>
                      {p.cause}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-ink-200">
                      <span className="font-semibold text-brand-300">Solution: </span>
                      {p.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Good for + tips */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h3 className="font-display text-lg font-semibold text-ink-50">Good for</h3>
          <ul className="mt-4 space-y-2.5">
            {plant.goodFor.map((g) => (
              <li key={g} className="flex items-center gap-2.5 text-sm text-ink-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                {g}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-6">
          <h3 className="font-display text-lg font-semibold text-ink-50">Care tips</h3>
          <ul className="mt-4 space-y-2.5">
            {plant.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-200">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fun fact */}
      <div className="mt-8 rounded-2xl border border-brand-500/20 bg-brand-500/10 p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
          <div>
            <h4 className="font-display text-sm font-semibold text-brand-500">Did you know?</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-200">{plant.funFact}</p>
          </div>
        </div>
      </div>

      <QuickReminderModal
        open={showReminder}
        onClose={() => setShowReminder(false)}
        plantName={plant.name}
      />
    </div>
  );
}
