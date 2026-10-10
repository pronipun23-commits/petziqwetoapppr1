import { useState } from 'react';
import {
  PawPrint, Sprout, Bell, Leaf, Sparkles, Clock, BarChart3, Palette,
  Tag, Rocket, Check, X, Crown, Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PlusSectionProps {
  onNavigate: (path: string) => void;
  onRequireAuth?: (label: string) => boolean;
  /** Compact variant for embedding inside an existing page. */
  embedded?: boolean;
}

interface FeatureRow {
  icon: typeof PawPrint;
  label: string;
  free: string | boolean;
  plus: string | boolean;
}

const FEATURE_ROWS: FeatureRow[] = [
  { icon: PawPrint, label: 'Pets', free: 'Up to 2', plus: 'Unlimited' },
  { icon: Sprout, label: 'Plants', free: 'Up to 3', plus: 'Unlimited' },
  { icon: PawPrint, label: 'Pet profiles', free: 'Basic', plus: 'Advanced' },
  { icon: Sprout, label: 'Plant profiles', free: 'Basic', plus: 'Advanced' },
  { icon: Bell, label: 'Reminders', free: 'Basic', plus: 'Advanced schedules' },
  { icon: Leaf, label: 'Care information', free: 'Basic', plus: 'Expanded' },
  { icon: Sparkles, label: 'Petziq AI usage', free: 'Basic', plus: 'Increased + care suggestions' },
  { icon: PawPrint, label: 'Explore', free: 'Basic', plus: 'Full' },
  { icon: Clock, label: 'Pet & plant history', free: false, plus: true },
  { icon: BarChart3, label: 'Dashboard insights', free: false, plus: true },
  { icon: Palette, label: 'Profile customization', free: false, plus: true },
  { icon: Tag, label: 'Smart Tag management', free: 'QR profile access', plus: 'Enhanced management' },
  { icon: Rocket, label: 'New features', free: 'Standard', plus: 'Priority access' },
];

/**
 * Petziq Plus — Free vs Plus comparison with a Monthly/Yearly selector.
 * Pricing is intentionally not final: ₹— placeholders until launch, and the
 * subscribe button is a disabled Coming Soon state. No payment flow exists.
 */
export function PlusSection({ onNavigate, onRequireAuth, embedded = false }: PlusSectionProps) {
  const { session } = useAuth();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const header = (
    <div className="mx-auto max-w-2xl text-center">
      <span className="chip mx-auto">
        <Crown className="h-3.5 w-3.5 text-brand-300" />
        Petziq Plus
      </span>
      <h2 className={`section-title mt-4 ${embedded ? '' : 'text-balance text-gradient'}`}>
        Free, or go further with Plus
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
        Everything you need to care for your pets and plants — with more depth,
        history, and insight when you're ready for Plus.
      </p>

      {/* Billing period selector */}
      <div className="mx-auto mt-6 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
        {(['monthly', 'yearly'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setBilling(option)}
            aria-pressed={billing === option}
            className={`rounded-full px-5 py-1.5 text-xs font-semibold capitalize transition ${
              billing === option
                ? 'bg-brand-500/20 text-brand-200 ring-1 ring-brand-500/40'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            {option}
            {option === 'yearly' && (
              <span className="ml-1.5 rounded-full bg-teal-500/15 px-1.5 py-0.5 text-[9px] font-bold text-teal-300">
                2 months free
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className={embedded ? '' : 'container-px mt-24 section-glow'}>
      {header}

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
        {/* ── Petziq Free ── */}
        <div className="card-surface flex flex-col p-7 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-bold text-ink-50">Petziq Free</h3>
              <p className="mt-1 text-sm text-ink-400">Everything to get started.</p>
            </div>
            <span className="rounded-full border border-white/[0.10] bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-300">
              Current plan
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-ink-50">₹0</span>
            <span className="text-sm text-ink-400">/ forever</span>
          </div>

          <ul className="mt-6 space-y-2.5 text-sm">
            {FEATURE_ROWS.map((row) => {
              const value = row.free;
              const enabled = value !== false;
              return (
                <li key={row.label} className={`flex items-start gap-2.5 ${enabled ? 'text-ink-200' : 'text-ink-500'}`}>
                  <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${enabled ? 'bg-brand-500/15 text-brand-300' : 'bg-white/[0.05] text-ink-500'}`}>
                    {enabled ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <X className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                  <span>
                    {row.label}:{' '}
                    <span className={enabled ? 'font-medium' : ''}>
                      {typeof value === 'string' ? value : 'Not included'}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => (session ? onNavigate('/dashboard') : onRequireAuth?.('Petziq Free'))}
            className="btn-ghost mt-8 w-full justify-center"
          >
            {session ? 'Go to your dashboard' : 'Start free'}
          </button>
        </div>

        {/* ── Petziq Plus ── */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-b from-brand-500/[0.10] via-ink-850/60 to-ink-900/70 p-[1px] shadow-glow-blue">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-ink-900/40 p-7 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-brand-300" />
                  <h3 className="font-display text-xl font-bold text-ink-50">Petziq Plus</h3>
                </div>
                <p className="mt-1 text-sm text-ink-400">For keepers who want the full picture.</p>
              </div>
              <span className="rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-200">
                Coming soon
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-ink-50">
                ₹—
              </span>
              <span className="text-sm text-ink-400">
                / {billing === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-ink-500">
              Pricing not finalized yet — locks in at launch.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm">
              {FEATURE_ROWS.map((row) => {
                const value = row.plus;
                return (
                  <li key={row.label} className="flex items-start gap-2.5 text-ink-100">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-teal-500/20 text-teal-300">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span>
                      {row.label}:{' '}
                      <span className="font-medium">
                        {typeof value === 'string' ? value : 'Included'}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-2.5">
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Petziq Plus is coming soon — pricing and checkout open at launch"
                className="btn-primary w-full cursor-not-allowed justify-center opacity-60"
              >
                <Loader2 className="h-4 w-4" />
                Coming Soon
              </button>
              <p className="text-center text-[11px] text-ink-500">
                No payment is collected yet. Subscribe when Plus launches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
