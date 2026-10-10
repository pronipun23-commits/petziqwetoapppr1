/*
# Create reminders table for Petziq care reminders

## Purpose
Supports the new Reminders feature — users can create one-time or repeating
reminders for plant/pet care tasks (water plant, feed pet, vet appointment, etc.).

## New Table: reminders
- `id` (uuid, primary key)
- `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users, cascade delete)
- `title` (text, NOT NULL) — reminder title
- `notes` (text, nullable) — optional notes
- `type` (text, NOT NULL, default 'other') — category: water_plant, fertilize_plant,
  repot_plant, check_sunlight, feed_pet, exercise_pet, vet_appointment, other
- `due_at` (timestamptz, NOT NULL) — when the reminder fires
- `is_repeating` (boolean, default false) — whether it repeats
- `repeat_interval` (text, nullable) — 'daily' | 'weekly' | 'monthly'
- `is_completed` (boolean, default false) — completion status
- `completed_at` (timestamptz, nullable) — when it was marked complete
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

## Security
- RLS enabled on reminders.
- Owner-scoped CRUD: each authenticated user can only access rows they own.
- 4 policies: select, insert, update, delete — all scoped to auth.uid() = user_id.
- user_id defaults to auth.uid() so frontend inserts omitting user_id still succeed.
*/

CREATE TABLE IF NOT EXISTS public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  notes text,
  type text NOT NULL DEFAULT 'other',
  due_at timestamptz NOT NULL,
  is_repeating boolean NOT NULL DEFAULT false,
  repeat_interval text,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reminders" ON public.reminders;
CREATE POLICY "select_own_reminders" ON public.reminders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reminders" ON public.reminders;
CREATE POLICY "insert_own_reminders" ON public.reminders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reminders" ON public.reminders;
CREATE POLICY "update_own_reminders" ON public.reminders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reminders" ON public.reminders;
CREATE POLICY "delete_own_reminders" ON public.reminders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS reminders_due_at_idx ON public.reminders(due_at);
CREATE INDEX IF NOT EXISTS reminders_completed_idx ON public.reminders(is_completed);