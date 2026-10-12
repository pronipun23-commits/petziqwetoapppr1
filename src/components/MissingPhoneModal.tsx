import { useState } from 'react';
import { Phone, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function MissingPhoneModal() {
  const { session, profile, updateProfile, loading: authLoading } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If not logged in, or already has phone, or dismissed, do not show
  if (authLoading || !session || dismissed) {
    return null;
  }

  // Profile loaded and phone exists and has length >= 10
  if (profile?.phone && profile.phone.trim().replace(/\D/g, '').length >= 10) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateErr } = await updateProfile({ phone: clean });
      if (updateErr) {
        setError(updateErr);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setDismissed(true);
        }, 1500);
      }
    } catch {
      setError('Failed to update phone number. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-ink-900 via-ink-900 to-ink-950 p-6 sm:p-8 text-ink-50 shadow-2xl animate-scale-in">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-brand-500/15 blur-2xl" />

        <div className="flex items-center gap-3 mb-5">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink-50">
              Verify Your Mobile Number
            </h3>
            <p className="text-xs text-ink-400">
              Required for security, tag QR scans & order SMS notifications
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-ink-300 mb-6 leading-relaxed">
          Please add your primary contact number. When your Smart Tag is scanned by a Good Samaritan or your orders are dispatched, you&apos;ll receive immediate alerts.
        </p>

        {success ? (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/15 p-4 text-green-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Phone number verified!</p>
              <p className="text-xs text-green-400/80">Updating your Petziq account profile...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1.5">
                10-Digit Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-ink-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={12}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  disabled={isSubmitting}
                  autoFocus
                  required
                  className="w-full rounded-xl border border-white/10 bg-ink-800/80 pl-14 pr-4 py-3 font-mono text-sm text-ink-50 placeholder-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-ink-400 pt-1">
              <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
              <span>We adhere to data minimization. Your phone is never shared or used for spam.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-xs sm:text-sm font-medium text-ink-300 hover:text-ink-100 hover:bg-white/[0.04] transition"
              >
                Remind Me Later
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 py-3 text-xs sm:text-sm font-semibold text-white shadow-glow hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save & Verify'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

