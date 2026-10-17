import { useState } from 'react';
import { Search, QrCode, ArrowRight, ShieldCheck, Heart, AlertCircle, Sparkles } from 'lucide-react';

interface FindPetPageProps {
  onNavigate: (path: string) => void;
}

export function FindPetPage({ onNavigate }: FindPetPageProps) {
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let clean = tagInput.trim();
    if (!clean) {
      setError('Please enter a Smart Tag ID or scan a Petziq QR code.');
      return;
    }

    // Support pasted URLs like https://petziqq.com/#/tag/PZ-12345678 or /tag/PZ-12345678
    if (clean.includes('/tag/')) {
      const match = clean.match(/\/tag\/([A-Za-z0-9\-_]+)/);
      if (match && match[1]) {
        clean = match[1];
      }
    }

    // Clean up input
    clean = clean.toUpperCase().replace(/[^A-Z0-9-]/g, '');

    if (clean.length < 4) {
      setError('Please enter a valid Petziq Smart Tag ID (e.g., PZ-A1B2C3D4).');
      return;
    }

    onNavigate(`/tag/${clean}`);
  };

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16 min-h-[75vh] flex flex-col justify-center">
      <div className="mx-auto max-w-xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          Petziq Lost & Found Network
        </div>

        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">
          Found a Pet with a Petziq Smart Tag?
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-300 max-w-md mx-auto">
          Every Petziq Smart Tag carries a laser-etched ID and QR code. Enter the Tag ID below or scan the physical tag to view the pet&apos;s emergency profile and contact the owner safely.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="mt-8 space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-400">
              <QrCode className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setError(null);
              }}
              placeholder="Enter Tag ID (e.g. PZ-ABC12345)"
              className="w-full rounded-2xl border border-white/10 bg-ink-900/90 pl-12 pr-4 py-4 font-mono text-base uppercase text-ink-50 placeholder-ink-500 shadow-2xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="btn-primary flex-1 justify-center py-3.5 bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold uppercase tracking-wider text-xs shadow-glow-blue transition-all"
            >
              <Search className="h-4 w-4 mr-1.5" />
              Find Pet Profile
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/smart-tags')}
              className="btn-secondary justify-center py-3.5 text-xs uppercase tracking-wider"
            >
              Learn About Smart Tags
            </button>
          </div>
        </form>

        {/* Quick Instructions & Assurance */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-3">
              <QrCode className="h-4 w-4" />
            </div>
            <h2 className="text-xs font-bold text-ink-100 uppercase tracking-wide">1. Scan or Type</h2>
            <p className="mt-1 text-xs text-ink-400 leading-relaxed">
              Use any standard phone camera to scan the tag, or type the laser ID printed on the back.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500/10 text-teal-400 mb-3">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-xs font-bold text-ink-100 uppercase tracking-wide">2. View Vitals</h2>
            <p className="mt-1 text-xs text-ink-400 leading-relaxed">
              Instantly check critical medical allergies, diet constraints, and safety guidelines.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-3">
              <Heart className="h-4 w-4" />
            </div>
            <h2 className="text-xs font-bold text-ink-100 uppercase tracking-wide">3. Safe Reunion</h2>
            <p className="mt-1 text-xs text-ink-400 leading-relaxed">
              Connect directly with the verified owner without exposing their private home address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

