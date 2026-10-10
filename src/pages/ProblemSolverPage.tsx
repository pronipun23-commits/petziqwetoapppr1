import { useMemo, useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  AlertCircle,
  Search,
  ChevronDown,
} from 'lucide-react';
import { PROBLEM_TOPICS } from '@/data/care';
import { CATEGORY_MAP } from '@/data/categories';
import { SectionHeader, EmptyState } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { CategoryId, ProblemTopic } from '@/data/types';

const SEVERITY_STYLES: Record<
  ProblemTopic['severity'],
  { ring: string; text: string; label: string; icon: typeof AlertCircle }
> = {
  Low: { ring: 'border-brand-400/30', text: 'text-brand-300', label: 'Low severity', icon: AlertCircle },
  Medium: { ring: 'border-accent-500/30', text: 'text-accent-500', label: 'Medium severity', icon: AlertTriangle },
  High: { ring: 'border-red-500/40', text: 'text-red-600', label: 'High severity', icon: AlertTriangle },
};

interface ProblemSolverPageProps {
  onNavigate: (path: string) => void;
}

export function ProblemSolverPage({ onNavigate }: ProblemSolverPageProps) {
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo<ProblemTopic[]>(() => {
    let list = PROBLEM_TOPICS.slice();
    if (category !== 'all') list = list.filter((t) => t.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((t) =>
        [t.title, t.symptoms, ...t.guidance].join(' ').toLowerCase().includes(q),
      );
    }
    return list;
  }, [category, query]);

  const categoriesWithTopics = Object.values(CATEGORY_MAP).filter((c) =>
    PROBLEM_TOPICS.some((t) => t.category === c.id),
  );

  return (
    <div className="container-px pt-12 pb-10">
      <SectionHeader
        eyebrow="Problem solver"
        title="Educational triage for common concerns"
        subtitle="Browse common pet situations and read structured, educational guidance. This is not a diagnosis — always consult a veterinarian."
      />

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-sm text-ink-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
        <p>
          <span className="font-semibold text-ink-50">Veterinarian disclaimer.</span>{' '}
          Petziq's Problem Solver offers general educational information only. It
          is not a substitute for professional veterinary diagnosis, treatment, or
          emergency care. If your pet is in distress, contact a licensed
          veterinarian immediately. For app support or feedback, email the{' '}
          <a
            href="mailto:petziq.team@gmail.com"
            className="font-medium text-brand-300 underline decoration-brand-400/40 underline-offset-2 transition hover:text-brand-500"
          >
            Petziq Team
          </a>
          .
        </p>
      </div>

      {/* Controls */}
      <div className="mt-8 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symptoms or keywords..."
            className="input-field pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`chip transition ${
              category === 'all'
                ? 'border-brand-400/40 bg-brand-500/15 text-brand-500'
                : 'hover:bg-white/[0.06]/80'
            }`}
          >
            All species
          </button>
          {categoriesWithTopics.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`chip transition ${
                category === c.id
                  ? 'border-brand-400/40 bg-brand-500/15 text-brand-500'
                  : 'hover:bg-white/[0.06]/80'
              }`}
            >
              <CategoryIcon name={c.icon} className="h-3.5 w-3.5" />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Stethoscope className="h-6 w-6" />}
            title="No matching topics"
            description="Try a different search or category. For urgent concerns, contact a veterinarian."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {filtered.map((t, i) => {
            const sev = SEVERITY_STYLES[t.severity];
            const isOpen = openId === t.id;
            const cat =
              t.category === 'all' ? null : CATEGORY_MAP[t.category as CategoryId];
            return (
              <div
                key={t.id}
                className={`card-surface overflow-hidden border-l-2 ${sev.ring} animate-fade-up`}
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : t.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] ${sev.text}`}>
                    <sev.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold text-ink-50">
                        {t.title}
                      </h3>
                      <span className={`text-xs font-semibold ${sev.text}`}>
                        {sev.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink-300 line-clamp-1">
                      {t.symptoms}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-ink-400 transition ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-white/[0.10] px-5 pb-5 pt-4 animate-fade-in">
                    {cat && (
                      <div className="mb-3 flex items-center gap-1.5 text-xs text-ink-400">
                        <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
                        {cat.name}
                      </div>
                    )}
                    <p className="text-sm font-semibold text-ink-100">
                      Common signs
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-300">
                      {t.symptoms}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-ink-100">
                      Educational guidance
                    </p>
                    <ol className="mt-2 space-y-2">
                      {t.guidance.map((g, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm leading-relaxed text-ink-200"
                        >
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-300">
                            {idx + 1}
                          </span>
                          {g}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-xs text-ink-400">
                      This guidance is educational only. For diagnosis or
                      treatment, consult a licensed veterinarian.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-ink-850/60 p-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink-50">
            Need deeper knowledge?
          </h3>
          <p className="mt-1 text-sm text-ink-300">
            Browse structured care guides for everyday husbandry.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('/care')} className="btn-primary">
            Open care guides
          </button>
          <a
            href="mailto:petziq.team@gmail.com"
            className="btn-ghost"
          >
            Contact Petziq
          </a>
        </div>
      </div>
    </div>
  );
}
