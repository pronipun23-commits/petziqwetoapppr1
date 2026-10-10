import { useState, useMemo } from 'react';
import { Apple, AlertTriangle, CheckCircle2, XCircle, Search, ArrowLeft } from 'lucide-react';
import { FOOD_GUIDES } from '@/data/food';
import { SectionHeader, EmptyState } from '@/components/ui';

interface FoodGuidePageProps {
  foodId?: string;
  onNavigate: (path: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  staple: 'Staple Food',
  supplement: 'Supplement',
  treat: 'Treat',
  avoid: 'Avoid',
};

const CATEGORY_COLORS: Record<string, string> = {
  staple: 'text-brand-300 bg-brand-500/10 border-brand-500/20',
  supplement: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  treat: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20',
  avoid: 'text-red-600 bg-red-500/10 border-red-500/20',
};

export function FoodGuidePage({ foodId, onNavigate }: FoodGuidePageProps) {
  const [query, setQuery] = useState('');
  const [petType, setPetType] = useState('all');

  const petTypes = useMemo(() => {
    const types = new Set(FOOD_GUIDES.map((f) => f.petType));
    return ['all', ...Array.from(types).sort()];
  }, []);

  if (foodId) {
    const item = FOOD_GUIDES.find((f) => f.id === foodId);
    if (!item) {
      return (
        <div className="container-px pt-20 pb-24 lg:pb-16 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink-50">Food guide not found</h1>
          <button onClick={() => onNavigate('/food')} className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" />Back to Food Guide</button>
        </div>
      );
    }
    return (
      <div className="container-px pt-8 pb-24 lg:pb-16">
        <button onClick={() => onNavigate('/food')} className="mb-6 inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-ink-50">
          <ArrowLeft className="h-4 w-4" />Food Guide
        </button>
        <div className="max-w-2xl">
          <span className={`chip ${CATEGORY_COLORS[item.category]} border`}>{CATEGORY_LABELS[item.category]}</span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-50">{item.name}</h1>
          <p className="mt-1 text-sm text-ink-400">For {item.petType}</p>

          <div className="mt-6 card-surface p-6">
            <h3 className="font-display text-sm font-semibold text-ink-50">General Information</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">{item.generalInfo}</p>
          </div>

          <div className="mt-4 card-surface p-6">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="font-display text-sm font-semibold text-ink-50">Safety Notes</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">{item.safetyNotes}</p>
          </div>

          {item.suitable.length > 0 && (
            <div className="mt-4 card-surface p-6">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-brand-400" />
                <h3 className="font-display text-sm font-semibold text-ink-50">Suitable For</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {item.suitable.map((s, i) => <li key={i} className="flex items-center gap-2.5 text-sm text-ink-200"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />{s}</li>)}
              </ul>
            </div>
          )}

          {item.unsuitable.length > 0 && (
            <div className="mt-4 card-surface p-6">
              <div className="flex items-center gap-2.5">
                <XCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-display text-sm font-semibold text-ink-50">Not Suitable For</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {item.unsuitable.map((s, i) => <li key={i} className="flex items-center gap-2.5 text-sm text-ink-200"><XCircle className="h-4 w-4 shrink-0 text-red-600" />{s}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <p className="text-sm leading-relaxed text-ink-200">
                This information is educational only and is not a substitute for veterinary advice. Always consult your veterinarian about your pet's specific dietary needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filtered = FOOD_GUIDES.filter((f) => {
    if (petType !== 'all' && f.petType !== petType) return false;
    if (query) {
      const q = query.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.petType.toLowerCase().includes(q) || f.generalInfo.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="container-px pt-10 pb-24 lg:pb-16">
      <SectionHeader
        eyebrow="Food Guide"
        title="Pet food information"
        subtitle="Browse general food information for different pet types. Always consult your veterinarian for specific dietary advice."
      />

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-ink-850/60 p-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search foods..." className="input-field pl-11" />
        </div>
        <div className="flex flex-wrap gap-2">
          {petTypes.map((pt) => (
            <button key={pt} onClick={() => setPetType(pt)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${petType === pt ? 'bg-brand-500 text-white' : 'border border-white/[0.08] text-ink-300 hover:text-ink-50'}`}>
              {pt === 'all' ? 'All Pets' : pt}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-400">{filtered.length} food item{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <EmptyState icon={<Apple className="h-7 w-7" />} title="No food items found" description="Try a different search or pet type filter." />
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <button key={item.id} onClick={() => onNavigate(`/food/${item.id}`)} className="card-surface p-5 text-left transition hover:border-white/[0.10]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-50">{item.name}</h3>
                  <p className="mt-0.5 text-xs text-ink-400">For {item.petType}</p>
                </div>
                <span className={`chip shrink-0 ${CATEGORY_COLORS[item.category]} border`}>{CATEGORY_LABELS[item.category]}</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-300">{item.generalInfo}</p>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
          <p className="text-sm leading-relaxed text-ink-200">
            Petziq's food guide provides general educational information only. It is not a substitute for professional veterinary advice. Always consult your veterinarian before making dietary changes.
          </p>
        </div>
      </div>
    </div>
  );
}
