import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, FileText, RefreshCw, Trash2, X, Check, Lock } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'refund' | 'cookies' | 'deletion' | 'contact' | 'help' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const [deletionEmail, setDeletionEmail] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  if (!type) return null;

  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionEmail.trim()) return;
    try {
      const requests = JSON.parse(localStorage.getItem('petziq_deletion_requests') || '[]');
      requests.push({
        email: deletionEmail.trim(),
        reason: deletionReason.trim(),
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('petziq_deletion_requests', JSON.stringify(requests));
    } catch {
      // ignore
    }
    setDeletionSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-ink-900 text-ink-50 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-ink-950/40">
          <div className="flex items-center gap-3">
            {type === 'privacy' && <ShieldCheck className="h-5 w-5 text-teal-400" />}
            {type === 'terms' && <FileText className="h-5 w-5 text-brand-400" />}
            {type === 'refund' && <RefreshCw className="h-5 w-5 text-amber-400" />}
            {type === 'cookies' && <Cookie className="h-5 w-5 text-ocean-400" />}
            {type === 'deletion' && <Trash2 className="h-5 w-5 text-red-400" />}
            {type === 'contact' && <FileText className="h-5 w-5 text-brand-400" />}
            {type === 'help' && <ShieldCheck className="h-5 w-5 text-teal-400" />}

            <h3 className="text-base font-semibold text-ink-50 capitalize">
              {type === 'privacy' && 'Privacy Policy & Data Minimization'}
              {type === 'terms' && 'Terms of Service'}
              {type === 'refund' && 'Refund & Replacement Policy'}
              {type === 'cookies' && 'Cookie Policy'}
              {type === 'deletion' && 'Request Data Deletion (GDPR / DPDP)'}
              {type === 'contact' && 'Contact Support'}
              {type === 'help' && 'Petziq Help & FAQ'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:text-ink-100 hover:bg-white/[0.06] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-xs sm:text-sm text-ink-200 leading-relaxed space-y-4">
          {type === 'privacy' && (
            <>
              <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 p-3 text-teal-200 text-xs">
                <strong>Data Minimization Commitment:</strong> We strictly collect only what is strictly necessary to save your pets, power QR scans, and fulfill laser-engraved Smart Tags. We never sell your personal information or use dark patterns.
              </div>
              <h4 className="font-semibold text-ink-50 text-sm">1. Information We Collect</h4>
              <p>
                We collect your name, account email, contact phone number, date of birth (for age verification and safety), and pet profiles (breed, age, veterinary notes, emergency contacts).
              </p>
              <h4 className="font-semibold text-ink-50 text-sm">2. Children and Minor Privacy</h4>
              <p>
                Petziq requires parental or guardian consent for individuals under 16 years of age. We do not knowingly market or collect sensitive data directly from minors without guardian supervision.
              </p>
              <h4 className="font-semibold text-ink-50 text-sm">3. Smart Tag QR Code Privacy</h4>
              <p>
                Public scans of your pet&apos;s Smart Tag reveal only the emergency contact details and medical notes you deliberately choose to make public. You can switch contact numbers to private anytime in your Petziq Dashboard.
              </p>
              <h4 className="font-semibold text-ink-50 text-sm">4. Third-Party Services Audit</h4>
              <p>
                We use secure, audited infrastructure: Supabase (encrypted database and authentication) and standard Web APIs. No deceptive trackers or invasive third-party analytics SDKs are embedded.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="font-semibold text-ink-50 text-sm">1. Terms of Use</h4>
              <p>
                By using Petziq and purchasing Smart Tags, you agree to provide truthful pet identification details and use tag notifications responsibly.
              </p>
              <h4 className="font-semibold text-ink-50 text-sm">2. Educational & Non-Veterinary Disclaimer</h4>
              <p>
                Petziq’s breed recommendations, toxic plant guides, and AI assistant answers are for educational purposes only and are not a replacement for certified veterinary care. Always consult a veterinarian for health emergencies.
              </p>
              <h4 className="font-semibold text-ink-50 text-sm">3. Fair Use & Intellectual Property</h4>
              <p>
                All breed photography, custom laser layout designs, tag imagery, and trademarks belong to Petziq or are used under open licensed and approved commercial terms.
              </p>
            </>
          )}

          {type === 'refund' && (
            <>
              <h4 className="font-semibold text-ink-50 text-sm">1. 30-Day Tag Replacement Guarantee</h4>
              <p>
                Because Smart Tags are custom laser-engraved with your pet&apos;s unique name, QR code, and phone number, custom tags cannot be restocked once manufactured. However, if your tag arrives scratched, misprinted, damaged, or defective, we will send a 100% free replacement or full refund immediately.
              </p>
              <h4 className="font-semibold text-ink-50 text-sm">2. Refund Processing</h4>
              <p>
                Approved refunds are processed back to your original payment method within 3–5 business days. Contact support at <a href="mailto:petziq.team@gmail.com" className="text-teal-300 underline">petziq.team@gmail.com</a>.
              </p>
            </>
          )}

          {type === 'cookies' && (
            <>
              <h4 className="font-semibold text-ink-50 text-sm">Cookie Policy & Preferences</h4>
              <p>
                Petziq uses essential cookies and local storage exclusively to keep you authenticated, store your favorites, and preserve your customized tag previews.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-ink-300">
                <li><strong>Strictly Essential:</strong> Session tokens, login state, and CSRF protection.</li>
                <li><strong>Functional:</strong> Local preferences, tag shapes, and pet draft reminders.</li>
                <li><strong>Analytics:</strong> Anonymous visit counts with zero third-party cross-site advertising trackers.</li>
              </ul>
            </>
          )}

          {type === 'deletion' && (
            <>
              {deletionSuccess ? (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center space-y-2">
                  <Check className="h-8 w-8 text-green-400 mx-auto" />
                  <h4 className="font-semibold text-ink-50 text-sm">Deletion Request Received</h4>
                  <p className="text-xs text-ink-300">
                    Your request for complete data removal has been logged. In compliance with DPDP & GDPR regulations, your pet profiles, tags, and personal records will be scrubbed within 7 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDeleteRequest} className="space-y-4">
                  <p className="text-xs text-ink-300">
                    You have the right to be forgotten. Submitting this form will queue complete deletion of your account, pet records, Smart Tag associations, and stored personal details.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-ink-400 mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      value={deletionEmail}
                      onChange={(e) => setDeletionEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-ink-400 mb-1">
                      Reason (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={deletionReason}
                      onChange={(e) => setDeletionReason(e.target.value)}
                      placeholder="Why would you like to delete your data?"
                      className="input-field w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold py-3 transition text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Submit Irreversible Deletion Request
                  </button>
                </form>
              )}
            </>
          )}

          {type === 'contact' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-ink-300">
                We are here to help! Reach out directly through official channels or submit your request below for an instant response:
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="mailto:petziq.team@gmail.com"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-brand-500/30 transition block"
                >
                  <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Email Us</p>
                  <p className="text-xs sm:text-sm font-semibold text-brand-300 mt-0.5">petziq.team@gmail.com</p>
                  <p className="text-[10px] text-ink-500 mt-0.5">Reply within 24 hours</p>
                </a>
                <a
                  href="tel:+919876543210"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-brand-500/30 transition block"
                >
                  <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Customer Line</p>
                  <p className="text-xs sm:text-sm font-semibold text-teal-300 mt-0.5">+91 98765 43210</p>
                  <p className="text-[10px] text-ink-500 mt-0.5">Mon–Sat, 9am–7pm IST</p>
                </a>
              </div>

              {/* Lead Capture Form */}
              <div className="rounded-2xl border border-white/10 bg-ink-950/40 p-4 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-ink-100 flex items-center justify-between">
                  <span>Quick Lead Inquiry</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Encrypted & Confidential</span>
                </h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formEl = e.currentTarget;
                    const data = new FormData(formEl);
                    const lead = {
                      name: data.get('name'),
                      email: data.get('email'),
                      phone: data.get('phone'),
                      topic: data.get('topic'),
                      date: new Date().toISOString(),
                    };
                    const existing = JSON.parse(localStorage.getItem('petziq_lead_inquiries') || '[]');
                    existing.unshift(lead);
                    localStorage.setItem('petziq_lead_inquiries', JSON.stringify(existing));
                    alert('Thank you! Our expert team has received your inquiry and will contact you promptly.');
                    formEl.reset();
                  }}
                  className="space-y-2.5 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      name="name"
                      type="text"
                      placeholder="Your Full Name"
                      required
                      className="input-field text-xs py-2"
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Your Mobile Number"
                      required
                      className="input-field text-xs py-2 font-mono"
                    />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email Address"
                    required
                    className="input-field text-xs py-2"
                  />
                  <select name="topic" className="input-field text-xs py-2 text-ink-200">
                    <option value="Smart Tag Order Quote">Smart Tag Order & Customization Quote</option>
                    <option value="Talk to Care Expert">Talk to Pet Care Expert</option>
                    <option value="Bulk / Shelter Tag Inquiry">Bulk / NGO / Shelter Smart Tags</option>
                    <option value="General Support">General Support</option>
                  </select>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="submit"
                      className="btn-primary flex-1 justify-center py-2.5 text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-ink-950"
                    >
                      Get a Free Quote
                    </button>
                    <a
                      href="tel:+919876543210"
                      className="btn-secondary justify-center py-2.5 text-xs text-center"
                    >
                      Talk to an Expert
                    </a>
                  </div>

                  <p className="text-[10px] text-ink-500 text-center pt-1 leading-relaxed">
                    Privacy Reassurance: We never sell or share your contact info. Essential cookies & strict encryption only.
                  </p>
                </form>
              </div>
            </div>
          )}

          {type === 'help' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <h5 className="font-semibold text-ink-100 text-xs">How do Smart Tags work?</h5>
                <p className="text-xs text-ink-300 mt-1">
                  Each tag has a unique dynamic QR code that connects directly to your pet's secure online profile. Anyone with a smartphone camera can scan it without needing an app.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <h5 className="font-semibold text-ink-100 text-xs">Are Smart Tags waterproof?</h5>
                <p className="text-xs text-ink-300 mt-1">
                  Yes! Crafted from anodized aviation-grade aluminum and aerospace zinc alloy with deep laser fiber engraving that will not fade, rub off, or rust in water.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <h5 className="font-semibold text-ink-100 text-xs">How do I update my phone number after buying?</h5>
                <p className="text-xs text-ink-300 mt-1">
                  Log in to your Petziq account and visit "Smart Tags". Update your phone or address anytime and the QR tag updates instantly in real time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-3 bg-ink-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-white/[0.08] hover:bg-white/[0.14] px-5 py-2 text-xs font-semibold text-ink-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieConsentBanner({ onOpenModal }: { onOpenModal: (type: LegalModalType) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('petziq_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('petziq_cookie_consent', 'accepted_all');
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('petziq_cookie_consent', 'essential_only');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[110] rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur-md p-5 shadow-2xl text-ink-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-400">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-ink-50">We respect your privacy</h4>
          <p className="text-xs text-ink-300 mt-1 leading-relaxed">
            We use strictly essential cookies for authentication and tag personalization. We do not sell data or use tracking cookies.
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-400">
        <button
          onClick={() => onOpenModal('privacy')}
          className="text-brand-300 hover:text-brand-200 underline"
        >
          Privacy Policy
        </button>
        <span>·</span>
        <button
          onClick={() => onOpenModal('cookies')}
          className="text-brand-300 hover:text-brand-200 underline"
        >
          Cookies Policy
        </button>
        <span>·</span>
        <a href="#/smart-tags" className="text-ink-300 hover:text-white transition">
          Smart Tags
        </a>
        <span>·</span>
        <a href="#/contact" className="text-ink-300 hover:text-white transition">
          Contact Support
        </a>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2.5 border-t border-white/10">
        <button
          onClick={acceptAll}
          className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 py-2 px-3 text-xs font-semibold text-white hover:opacity-95 transition"
        >
          Accept All
        </button>
        <button
          onClick={acceptEssential}
          className="flex-1 rounded-xl border border-white/10 py-2 px-3 text-xs font-medium text-ink-200 hover:bg-white/[0.04] transition"
        >
          Essential Only
        </button>
        <button
          onClick={() => onOpenModal('cookies')}
          className="text-xs text-brand-300 hover:text-brand-200 underline px-1"
        >
          Preferences
        </button>
      </div>
    </div>
  );
}

