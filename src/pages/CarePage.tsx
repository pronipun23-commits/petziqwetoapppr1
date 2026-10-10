import { useState } from 'react';
import { Clock, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { CARE_GUIDES } from '@/data/care';
import { CATEGORY_MAP } from '@/data/categories';
import { SectionHeader } from '@/components/ui';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { CareGuide, CategoryId } from '@/data/types';

interface CarePageProps {
  initialGuide?: string;
  onNavigate: (path: string) => void;
}

export function CarePage({ initialGuide, onNavigate }: CarePageProps) {
  const [activeId, setActiveId] = useState<string>(
    initialGuide ?? CARE_GUIDES[0].id,
  );
  const active: CareGuide =
    CARE_GUIDES.find((g) => g.id === activeId) ?? CARE_GUIDES[0];

  return (
    <div className="container-px pt-12 pb-10">
      <SectionHeader
        eyebrow="Care guides"
        title="Practical, vet-informed guidance"
        subtitle="Bite-sized guides covering the fundamentals of husbandry across species. Educational only — always confirm with a qualified veterinarian."
      />

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent-500/20 bg-accent-500/5 p-4 text-sm text-ink-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
        <p>
          Petziq provides educational content only. It is not a substitute for
          professional veterinary advice, diagnosis, or treatment. Always
          consult a qualified veterinarian for health concerns. For questions or
          feedback about Petziq, email the{' '}
          <a
            href="mailto:petziq.team@gmail.com"
            className="font-medium text-brand-300 underline decoration-brand-400/40 underline-offset-2 transition hover:text-brand-500"
          >
            Petziq Team
          </a>
          .
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Guide list */}
        <div className="space-y-2">
          {CARE_GUIDES.map((g, i) => {
            const cat =
              g.category === 'all' ? null : CATEGORY_MAP[g.category as CategoryId];
            return (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={`group w-full rounded-2xl border p-4 text-left transition animate-fade-up ${
                  active.id === g.id
                    ? 'border-brand-400/40 bg-brand-500/10'
                    : 'border-white/[0.08] bg-ink-850/50 hover:border-white/[0.10] hover:bg-ink-850'
                }`}
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <div className="flex items-center gap-2 text-xs text-ink-400">
                  {cat ? (
                    <>
                      <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
                      <span>{cat.name}</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>All species</span>
                    </>
                  )}
                  <span className="h-1 w-1 rounded-full bg-ink-600" />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {g.readTime}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-ink-50">
                  {g.title}
                </h3>
                <p className="mt-1 text-sm text-ink-300 line-clamp-2">
                  {g.excerpt}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active guide */}
        <article className="lg:col-span-2">
          <div className="card-surface p-7 sm:p-9 animate-fade-in" key={active.id}>
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <Clock className="h-3.5 w-3.5" />
              {active.readTime} read
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink-50 sm:text-3xl">
              {active.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-200">
              {active.excerpt}
            </p>

            <div className="mt-8 space-y-7">
              {active.sections.map((s, i) => (
                <div key={i} className="border-l-2 border-brand-500/30 pl-5">
                  <h3 className="font-display text-lg font-semibold text-ink-50">
                    {s.heading}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-200">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.10] pt-6">
              <p className="text-xs text-ink-400">
                Educational guidance only. Consult a veterinarian for specific cases.
              </p>
              <button
                onClick={() => onNavigate('/problems')}
                className="btn-subtle"
              >
                Problem Solver
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
