import { Mail } from 'lucide-react';
import { Logo } from './Logo';
import { CATEGORIES } from '@/data/categories';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-ink-950/60">
      <div className="container-px py-14">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5"
            >
              <Logo size={36} withWordmark />
            </button>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Petziq helps pet owners track, understand, and manage their pets’ everyday care — all in one place.
            </p>
            <div className="mt-5">
              <a
                href="mailto:petziq.team@gmail.com"
                aria-label="Email Petziq Team"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/15"
              >
                <Mail className="h-4 w-4" />
                Contact the Petziq team
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: 'All Breeds', path: '/explore' },
                { label: 'Categories', path: '/categories' },
                { label: 'Care Guides', path: '/care' },
                { label: 'Problem Solver', path: '/problems' },
                { label: 'Blog', path: '/blog' },
                { label: 'Favorites', path: '/favorites' },
              ].map((l) => (
                <li key={l.path}>
                  <button
                    onClick={() => onNavigate(l.path)}
                    className="text-ink-300 transition hover:text-ink-50"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Top Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate(`/categories/${c.id}`)}
                    className="text-ink-300 transition hover:text-ink-50"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              About
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-ink-300 transition hover:text-ink-50"
                >
                  About Petziq
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="text-ink-300 transition hover:text-ink-50"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/help')}
                  className="text-ink-300 transition hover:text-ink-50"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Contact
            </h4>
            <div className="mt-4 space-y-1.5 text-sm">
              <p className="font-medium text-ink-200">Petziq Team</p>
              <a
                href="mailto:petziq.team@gmail.com"
                className="inline-flex items-center gap-2 text-ink-300 transition hover:text-brand-300"
              >
                <Mail className="h-3.5 w-3.5" />
                petziq.team@gmail.com
              </a>
              <p className="pt-2 text-xs leading-relaxed text-ink-400">
                Questions, support, feedback, or business inquiries — we'd love to hear from you.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.10] pt-6 text-xs text-ink-400 sm:flex-row">
          <p>Created by <span className="font-semibold text-ink-200">Nipun</span>.</p>
          <p>© {new Date().getFullYear()} Petziq. Educational guidance only — not a substitute for veterinary care.</p>
        </div>
      </div>
    </footer>
  );
}
