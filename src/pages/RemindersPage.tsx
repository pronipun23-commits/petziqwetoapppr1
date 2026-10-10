import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  Circle,
  X,
  Calendar,
  Clock,
  Repeat,
  Loader2,
  AlertCircle,
  Clock3,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { SectionHeader, EmptyState } from '@/components/ui';

interface Reminder {
  id: string;
  title: string;
  notes: string | null;
  type: string;
  due_at: string;
  is_repeating: boolean;
  repeat_interval: string | null;
  is_completed: boolean;
  completed_at: string | null;
}

const REMINDER_TYPES = [
  { value: 'pet_care', label: 'Pet care' },
  { value: 'plant_care', label: 'Plant care' },
  { value: 'water_plant', label: 'Watering' },
  { value: 'feed_pet', label: 'Feeding' },
  { value: 'exercise_pet', label: 'Exercise' },
  { value: 'repot_plant', label: 'Repotting' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'vet_appointment', label: 'Vet appointment' },
  { value: 'other', label: 'Custom reminder' },
];

const REPEAT_INTERVALS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function isUpcoming(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d > now && !isToday(iso);
}

function isOverdue(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d < now && !isToday(iso);
}

export function RemindersPage() {
  const { session } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);

  const fetchReminders = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('due_at', { ascending: true });
    if (error) setError(error.message);
    else setReminders(data as Reminder[]);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const active = reminders.filter((r) => !r.is_completed);
  const completed = reminders.filter((r) => r.is_completed);

  const today = active.filter((r) => isToday(r.due_at));
  const overdue = active.filter((r) => isOverdue(r.due_at));
  const upcoming = active.filter((r) => isUpcoming(r.due_at));

  const markComplete = async (id: string) => {
    const nowIso = new Date().toISOString();
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, is_completed: true, completed_at: nowIso } : r,
      ),
    );
    await supabase
      .from('reminders')
      .update({ is_completed: true, completed_at: nowIso, updated_at: nowIso })
      .eq('id', id);
  };

  const markIncomplete = async (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, is_completed: false, completed_at: null } : r,
      ),
    );
    await supabase
      .from('reminders')
      .update({ is_completed: false, completed_at: null, updated_at: new Date().toISOString() })
      .eq('id', id);
  };

  const snoozeReminder = async (id: string) => {
    const snoozed = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // +1 hour
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, due_at: snoozed } : r)),
    );
    await supabase
      .from('reminders')
      .update({ due_at: snoozed, updated_at: new Date().toISOString() })
      .eq('id', id);
    fetchReminders();
  };

  const deleteReminder = async (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    await supabase.from('reminders').delete().eq('id', id);
  };

  const openEdit = (r: Reminder) => {
    setEditing(r);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const onSaved = () => {
    closeForm();
    fetchReminders();
  };

  return (
    <div className="container-px pt-10 pb-24 lg:pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Reminders"
          title="Your care reminders"
          subtitle="Never miss a watering, feeding, or vet appointment. Create one-time or repeating reminders for all your care tasks."
        />
        <button onClick={() => setShowForm(true)} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          New reminder
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Bell className="h-7 w-7" />}
            title="No reminders yet"
            description="Create your first reminder to get notified about plant waterings, pet feedings, vet appointments, and more."
            action={
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus className="h-4 w-4" />
                Create reminder
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <ReminderSection
            title="Overdue"
            icon={<AlertCircle className="h-5 w-5 text-red-600" />}
            reminders={overdue}
            onMarkComplete={markComplete}
            onMarkIncomplete={markIncomplete}
            onSnooze={snoozeReminder}
            onDelete={deleteReminder}
            onEdit={openEdit}
            highlight="overdue"
          />
          <ReminderSection
            title="Today"
            icon={<Clock className="h-5 w-5 text-brand-300" />}
            reminders={today}
            onMarkComplete={markComplete}
            onMarkIncomplete={markComplete}
            onSnooze={snoozeReminder}
            onDelete={deleteReminder}
            onEdit={openEdit}
            highlight="today"
          />
          <ReminderSection
            title="Upcoming"
            icon={<Calendar className="h-5 w-5 text-ink-300" />}
            reminders={upcoming}
            onMarkComplete={markComplete}
            onMarkIncomplete={markIncomplete}
            onSnooze={snoozeReminder}
            onDelete={deleteReminder}
            onEdit={openEdit}
          />
          <ReminderSection
            title="Completed"
            icon={<CheckCircle2 className="h-5 w-5 text-brand-400" />}
            reminders={completed}
            onMarkComplete={markComplete}
            onMarkIncomplete={markIncomplete}
            onSnooze={snoozeReminder}
            onDelete={deleteReminder}
            onEdit={openEdit}
          />
        </div>
      )}

      {showForm && (
        <ReminderForm
          existing={editing}
          onClose={onSaved}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}

function ReminderSection({
  title,
  icon,
  reminders,
  onMarkComplete,
  onMarkIncomplete,
  onSnooze,
  onDelete,
  onEdit,
  highlight,
}: {
  title: string;
  icon: React.ReactNode;
  reminders: Reminder[];
  onMarkComplete: (id: string) => void;
  onMarkIncomplete: (id: string) => void;
  onSnooze: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (r: Reminder) => void;
  highlight?: 'overdue' | 'today';
}) {
  if (reminders.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        {icon}
        <h2 className="font-display text-lg font-semibold text-ink-50">{title}</h2>
        <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-xs font-semibold text-ink-300">
          {reminders.length}
        </span>
      </div>
      <div className="grid gap-3">
        {reminders.map((r) => (
          <ReminderItem
            key={r.id}
            reminder={r}
            onMarkComplete={onMarkComplete}
            onMarkIncomplete={onMarkIncomplete}
            onSnooze={onSnooze}
            onDelete={onDelete}
            onEdit={onEdit}
            highlight={highlight}
          />
        ))}
      </div>
    </section>
  );
}

function ReminderItem({
  reminder,
  onMarkComplete,
  onMarkIncomplete,
  onSnooze,
  onDelete,
  onEdit,
  highlight,
}: {
  reminder: Reminder;
  onMarkComplete: (id: string) => void;
  onMarkIncomplete: (id: string) => void;
  onSnooze: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (r: Reminder) => void;
  highlight?: 'overdue' | 'today';
}) {
  const typeLabel =
    REMINDER_TYPES.find((t) => t.value === reminder.type)?.label ?? 'Other';

  return (
    <div
      className={`card-surface flex items-center gap-4 p-4 transition hover:border-white/[0.10] ${
        highlight === 'overdue' ? 'border-red-500/30 bg-red-500/5' : ''
      } ${highlight === 'today' ? 'border-brand-500/30' : ''} ${
        reminder.is_completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() =>
          reminder.is_completed
            ? onMarkIncomplete(reminder.id)
            : onMarkComplete(reminder.id)
        }
        className="shrink-0 transition hover:scale-110"
        aria-label={reminder.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {reminder.is_completed ? (
          <CheckCircle2 className="h-6 w-6 text-brand-400" />
        ) : (
          <Circle className="h-6 w-6 text-ink-400 transition hover:text-brand-300" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`font-display text-sm font-semibold text-ink-50 ${
              reminder.is_completed ? 'line-through' : ''
            }`}
          >
            {reminder.title}
          </h3>
          <span className="chip">{typeLabel}</span>
          {reminder.is_repeating && (
            <span className="chip">
              <Repeat className="h-3 w-3" />
              {reminder.repeat_interval}
            </span>
          )}
        </div>
        {reminder.notes && (
          <p className="mt-1 text-xs text-ink-400">{reminder.notes}</p>
        )}
        <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-400">
          <Clock className="h-3 w-3" />
          {formatDateTime(reminder.due_at)}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!reminder.is_completed && (
          <button
            onClick={() => onSnooze(reminder.id)}
            className="rounded-full p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-brand-300"
            aria-label="Snooze 1 hour"
            title="Snooze 1 hour"
          >
            <Clock3 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => onEdit(reminder)}
          className="rounded-full p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-ink-50"
          aria-label="Edit reminder"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="rounded-full p-2 text-ink-400 transition hover:bg-red-500/10 hover:text-red-600"
          aria-label="Delete reminder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ReminderForm({
  existing,
  onClose,
  onCancel,
}: {
  existing: Reminder | null;
  onClose: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(existing?.title ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [type, setType] = useState(existing?.type ?? 'other');
  const [dueDate, setDueDate] = useState(
    existing ? existing.due_at.slice(0, 16) : '',
  );
  const [isRepeating, setIsRepeating] = useState(existing?.is_repeating ?? false);
  const [repeatInterval, setRepeatInterval] = useState(
    existing?.repeat_interval ?? 'weekly',
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a reminder title.');
      return;
    }
    if (!dueDate) {
      setError('Please choose a date and time.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      notes: notes.trim() || null,
      type,
      due_at: new Date(dueDate).toISOString(),
      is_repeating: isRepeating,
      repeat_interval: isRepeating ? repeatInterval : null,
    };

    if (existing) {
      const { error: updateError } = await supabase
        .from('reminders')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (updateError) setError(updateError.message);
    } else {
      const { error: insertError } = await supabase
        .from('reminders')
        .insert(payload);
      if (insertError) setError(insertError.message);
    }

    setSaving(false);
    if (!error) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 glass-light backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-lg animate-scale-in">
        <div className="card-surface p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-50">
              {existing ? 'Edit reminder' : 'New reminder'}
            </h2>
            <button
              onClick={onCancel}
              className="rounded-full p-2 text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Water the Monstera"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
              >
                {REMINDER_TYPES.map((t) => (
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
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
                required
              />
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

            <div className="rounded-xl border border-white/[0.08] bg-ink-900/60 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isRepeating}
                  onChange={(e) => setIsRepeating(e.target.checked)}
                  className="h-4 w-4 rounded border-white/[0.10] accent-brand-500"
                />
                <span className="flex items-center gap-2 text-sm font-medium text-ink-50">
                  <Repeat className="h-4 w-4 text-brand-300" />
                  Repeating reminder
                </span>
              </label>
              {isRepeating && (
                <div className="mt-3">
                  <select
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(e.target.value)}
                    className="input-field"
                  >
                    {REPEAT_INTERVALS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                  <>{existing ? 'Save changes' : 'Create reminder'}</>
                )}
              </button>
              <button type="button" onClick={onCancel} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
