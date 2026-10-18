import { useState } from 'react';
import { X, User, Phone, Calendar, PawPrint, Save, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { profile, updateProfile, session } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [petName, setPetName] = useState(profile?.pet_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.date_of_birth || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await updateProfile({
        full_name: fullName.trim(),
        pet_name: petName.trim(),
        phone: phone.trim(),
        date_of_birth: dateOfBirth,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1200);
      }
    } catch {
      setError('Failed to update account details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-7 text-ink-50 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-50">Customize Account</h3>
              <p className="text-xs text-ink-400">Manage your profile & keeper preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="my-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/15 p-4 text-green-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold">Account customized successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="input-field text-sm pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                Primary Pet Name
              </label>
              <div className="relative">
                <PawPrint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Bruno"
                  className="input-field text-sm pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 96001 54689"
                  className="input-field text-sm pl-9 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                Date of Birth / Anniversary
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="input-field text-sm pl-9 text-ink-200"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-300 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-ink-400">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-brand-400" />
                Encrypted & Private
              </span>
              <span>Email: {session?.user?.email}</span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1 justify-center py-2.5 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 justify-center py-2.5 text-xs bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
