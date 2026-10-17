import type { ReactNode } from 'react';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 section-title text-balance">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-ink-300">{subtitle}</p>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-ink-850/40 px-6 py-16 text-center animate-fade-in">
      {icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-ink-300">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-ink-50">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function TraitBar({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-300">{label}</span>
        <span className="font-semibold text-ink-100">{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 transition-[width] duration-700 ease-out"
          style={{ width: `${value}%`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-ink-850/60 p-4">
      <div className="text-xs uppercase tracking-wide text-ink-400">{label}</div>
      <div className="mt-1 font-display text-base font-semibold text-ink-50">
        {value}
      </div>
    </div>
  );
}
