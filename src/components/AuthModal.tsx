import { useState, type FormEvent } from 'react';
import {
  PawPrint,
  Mail,
  Lock,
  User,
  Heart,
  Loader2,
  AlertCircle,
  ArrowRight,
  X,
  ArrowLeft,
  Phone,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  featureLabel?: string;
}

export function AuthModal({ open, onClose, featureLabel }: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [fullName, setFullName] = useState('');
  const [petName, setPetName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const switchMode = (next: 'login' | 'register' | 'forgot') => {
    setMode(next);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your email to reset password.');
          setLoading(false);
          return;
        }
        const { error: resetErr } = await resetPassword(email);
        if (resetErr) {
          setError(resetErr);
        } else {
          setSuccess('Password reset link sent! Check your email inbox.');
        }
        setLoading(false);
        return;
      }

      if (mode === 'register') {
        if (!fullName.trim() || !petName.trim()) {
          setError('Please fill in your name and your pet\u2019s name.');
          setLoading(false);
          return;
        }
        if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
          setError('Please enter a valid 10-digit mobile number for order and security updates.');
          setLoading(false);
          return;
        }
        if (!dateOfBirth) {
          setError('Please enter your Date of Birth.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const { error: signUpError } = await signUp(
          email,
          password,
          fullName.trim(),
          petName.trim(),
          phone.trim(),
          dateOfBirth
        );
        if (signUpError) {
          setError(signUpError);
        } else {
          onClose();
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError);
        } else {
          onClose();
        }
      }
    } catch (err) {
      console.error('Auth form submit error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 glass-light backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="card-surface p-7 sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-50">
                  {mode === 'login' ? 'Welcome back' : 'Join Petziq'}
                </h2>
                <p className="text-xs text-ink-400">
                  {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {featureLabel && (
            <div className="mb-5 rounded-xl border border-brand-500/20 bg-brand-500/10 px-4 py-3 text-sm text-brand-500">
              Log in or create an account to use{' '}
              <span className="font-semibold">{featureLabel}</span>.
            </div>
          )}

          <div className="mb-6 flex rounded-xl border border-white/[0.08] bg-ink-900/80 p-1">
            <button
              onClick={() => switchMode('login')}
              disabled={loading}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-brand-500 text-white shadow-[0_4px_20px_-8px_rgba(15,118,110,0.6)]'
                  : 'text-ink-300 hover:text-ink-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('register')}
              disabled={loading}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-brand-500 text-white shadow-[0_4px_20px_-8px_rgba(15,118,110,0.6)]'
                  : 'text-ink-300 hover:text-ink-50'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      disabled={loading}
                      className="input-field pl-11"
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                    Pet's Name
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Buddy"
                      disabled={loading}
                      className="input-field pl-11"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        disabled={loading}
                        required
                        className="input-field pl-11 font-mono"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        disabled={loading}
                        required
                        max={new Date().toISOString().split('T')[0]}
                        className="input-field pl-11 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-brand-300 hover:text-brand-200 transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
                    disabled={loading}
                    required
                    className="input-field pl-11"
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-fade-in">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 animate-fade-in">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-300">
            {mode === 'login' && (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => switchMode('register')}
                  className="font-semibold text-brand-300 transition hover:text-brand-500 link-underline"
                  disabled={loading}
                >
                  Register here
                </button>
              </>
            )}
            {mode === 'register' && (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="font-semibold text-brand-300 transition hover:text-brand-500 link-underline"
                  disabled={loading}
                >
                  Sign in
                </button>
              </>
            )}
            {mode === 'forgot' && (
              <>
                Remembered your password?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="font-semibold text-brand-300 transition hover:text-brand-500 link-underline"
                  disabled={loading}
                >
                  Back to Sign In
                </button>
              </>
            )}
          </p>

          <button
            onClick={onClose}
            className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-ink-400 transition hover:text-ink-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
