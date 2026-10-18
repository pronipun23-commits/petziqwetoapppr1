import { useState, useEffect, useRef } from 'react';
import { Phone, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowLeft, KeyRound, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function MissingPhoneModal() {
  const { session, profile, sendPhoneOtp, verifyPhoneOtp, loading: authLoading } = useAuth();
  const [step, setStep] = useState<'input_phone' | 'enter_otp'>('input_phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend (60-second rate limiting defense)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // If not logged in, or already has phone, or dismissed, do not show
  if (authLoading || !session || dismissed) {
    return null;
  }

  // Profile loaded and phone exists and has length >= 10
  if (profile?.phone && profile.phone.trim().replace(/\D/g, '').length >= 10) {
    return null;
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPhoneOtp(clean);
      if (res.error) {
        setError(res.error);
      } else {
        setStep('enter_otp');
        setCountdown(60); // 60-second rate-limiting cool-down
        // Auto-focus first OTP digit input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      }
    } catch {
      setError('Failed to send verification code. Please check the number and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1); // Only accept single digit
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    // Auto-advance to next input field
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-verify
    const fullCode = newOtp.join('');
    if (fullCode.length === 6) {
      handleConfirmOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmOtp = async (codeToVerify?: string) => {
    setError(null);
    const code = codeToVerify || otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyPhoneOtp(phone, code);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setDismissed(true);
        }, 1500);
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartWhatsAppVerification = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    // Generate secure 6-digit verification pin
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();

    // Save session storage active pin for instant match
    const payload = {
      phone: `+91${clean}`,
      code: randomPin,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    };
    sessionStorage.setItem('petziq_active_otp', JSON.stringify(payload));

    // Construct WhatsApp prefilled message
    const msg = encodeURIComponent(`Hello Petziq! Please verify my Petziq Companion mobile number (+91 ${clean}). My Security Passkey is: ${randomPin}`);
    // Support direct WhatsApp Web / App
    const whatsappUrl = `https://wa.me/919600154689?text=${msg}`;
    window.open(whatsappUrl, '_blank');

    setStep('enter_otp');
    setCountdown(60);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-ink-900 via-ink-900 to-ink-950 p-6 sm:p-8 text-ink-50 shadow-2xl animate-scale-in">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-brand-500/15 blur-2xl" />

        <div className="flex items-center gap-3 mb-5">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {step === 'input_phone' ? <Phone className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink-50">
              {step === 'input_phone' ? 'Verify Your Mobile Number' : 'Enter 6-Digit Passkey'}
            </h3>
            <p className="text-xs text-ink-400">
              {step === 'input_phone'
                ? 'Instant 100% free verification via WhatsApp or SMS'
                : `Sent for +91 ${phone.replace(/\D/g, '')}`}
            </p>
          </div>
        </div>

        {success ? (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/15 p-4 text-green-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Phone verified successfully!</p>
              <p className="text-xs text-green-400/80">Updating your Petziq account profile...</p>
            </div>
          </div>
        ) : step === 'input_phone' ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-ink-300 mb-2 leading-relaxed">
              To protect your pet&apos;s smart tag from fraudulent claims, verify your mobile number. Choose your preferred instant verification method:
            </p>

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
                  className="w-full rounded-xl border border-white/10 bg-ink-800/80 pl-14 pr-4 py-3 font-mono text-sm text-ink-50 placeholder-ink-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Verification Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleStartWhatsAppVerification}
                disabled={isSubmitting || phone.replace(/\D/g, '').length < 10}
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-ink-950 font-bold py-3 text-xs sm:text-sm shadow-glow-blue transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4 fill-current" />
                Verify via WhatsApp (Instant & Free)
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSubmitting || phone.replace(/\D/g, '').length < 10}
                className="w-full rounded-xl border border-white/10 py-2.5 text-xs text-ink-300 hover:text-ink-100 hover:bg-white/[0.04] transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Send via SMS'}
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="text-xs text-ink-500 hover:text-ink-300 transition"
              >
                Remind Me Later
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-300">
                One-Time Security Passkey
              </label>
              <button
                type="button"
                onClick={() => { setStep('input_phone'); setError(null); }}
                className="text-xs text-teal-400 hover:text-teal-300 inline-flex items-center gap-1 transition"
              >
                <ArrowLeft className="h-3 w-3" /> Change number
              </button>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-ink-200 space-y-1.5">
              <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> WhatsApp Opened
              </p>
              <p className="text-[12px] text-ink-300 leading-relaxed">
                We opened WhatsApp with your pre-filled 6-digit passkey in the chat input. Check the 6-digit number in that message, then enter it below.
              </p>
              <button
                type="button"
                onClick={() => {
                  const clean = phone.replace(/\D/g, '');
                  const stored = sessionStorage.getItem('petziq_active_otp');
                  const code = stored ? JSON.parse(stored).code : '';
                  const msg = encodeURIComponent(`Hello Petziq! Please verify my Petziq Companion mobile number (+91 ${clean}). My Security Passkey is: ${code}`);
                  window.open(`https://wa.me/919600154689?text=${msg}`, '_blank');
                }}
                className="text-emerald-400 hover:text-emerald-300 underline font-medium text-[11px] pt-1 inline-block"
              >
                Re-open WhatsApp chat &rarr;
              </button>
            </div>

            {/* 6 Digit Inputs */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={isSubmitting}
                  className="h-12 w-12 text-center font-mono text-lg font-bold rounded-xl border border-white/10 bg-ink-800/80 text-ink-50 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-ink-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Valid for 10 minutes
              </span>

              {countdown > 0 ? (
                <span className="text-ink-500 font-mono">Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleStartWhatsAppVerification}
                  disabled={isSubmitting}
                  className="text-emerald-400 hover:text-emerald-300 transition font-medium flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Resend via WhatsApp
                </button>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-xs sm:text-sm font-medium text-ink-300 hover:text-ink-100 hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmOtp()}
                disabled={isSubmitting || otp.join('').length < 6}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs sm:text-sm font-semibold text-ink-950 shadow-glow hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm & Verify'}
              </button>
            </div>
          </div>
        )}

        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
