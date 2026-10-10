import { useState, useRef, useEffect, type FormEvent } from 'react';
import { X, Bell, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface QuickReminderModalProps {
  open: boolean;
  onClose: () => void;
  plantName: string;
  defaultType?: string;
}

const PLANT_REMINDER_TYPES = [
  { value: 'water_plant', label: 'Water plant', defaultDays: 7 },
  { value: 'fertilize_plant', label: 'Fertilize plant', defaultDays: 30 },
  { value: 'repot_plant', label: 'Repot plant', defaultDays: 90 },
  { value: 'check_sunlight', label: 'Check sunlight', defaultDays: 14 },
  { value: 'other', label: 'Custom care reminder', defaultDays: 7 },
];

export function QuickReminderModal({
  open,
  onClose,
  plantName,
  defaultType = 'water_plant',
}: QuickReminderModalProps) {
  const { session } = useAuth();
  const [type, setType] = useState(defaultType);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setType(defaultType);
      setDueDate('');
      setNotes('');
      setError(null);
      setSuccess(false);
      setSaving(false);
    }
  }, [open, defaultType]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  if (!open) return null;

  const selectedType = PLANT_REMINDER_TYPES.find((t) => t.value === type);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    const t = PLANT_REMINDER_TYPES.find((pt) => pt.value === newType);
    if (t && !dueDate) {
      const date = new Date();
      date.setDate(date.getDate() + t.defaultDays);
      setDueDate(date.toISOString().slice(0, 16));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dueDate) {
      setError('Please choose a date and time.');
      return;
    }

    setSaving(true);
    if (!session) {
      setSaving(false);
      setError('Please log in to create reminders.');
      return;
    }
    const label = PLANT_REMINDER_TYPES.find((t) => t.value === type)?.label ?? 'Plant care';
    const { error: insertError } = await supabase.from('reminders').insert({
      user_id: session.user.id,
      title: `${label}: ${plantName}`,
      type,
      due_at: new Date(dueDate).toISOString(),
      notes: notes.trim() || null,
      is_repeating: false,
      repeat_interval: null,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    successTimerRef.current = setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 glass-light backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="card-surface p-7">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                <Bell className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-50">Add reminder</h2>
                <p className="text-xs text-ink-400">For {plantName}</p>
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

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
                <Bell className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink-50">Reminder created!</h3>
              <p className="mt-2 text-sm text-ink-300">
                View it in your Reminders dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Reminder type
                </label>
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="input-field"
                >
                  {PLANT_REMINDER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Date & time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-field pl-11"
                    required
                  />
                </div>
                {selectedType && !dueDate && (
                  <p className="mt-1.5 text-xs text-ink-400">
                    Suggested: {selectedType.defaultDays} days from now
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any extra details..."
                  rows={2}
                  className="input-field resize-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Bell className="h-4 w-4" />
                      Create reminder
                    </>
                  )}
                </button>
                <button type="button" onClick={onClose} className="btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
