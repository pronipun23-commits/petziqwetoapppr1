/*
# Create care_checklists table — daily pet care task tracking

1. New Tables
- `care_checklists` — stores daily care checklist completions per pet
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users ON DELETE CASCADE)
  - `pet_id` (uuid, nullable, FK to pets ON DELETE CASCADE) — optional link to specific pet
  - `task_type` (text, NOT NULL) — "food", "water", "exercise", "grooming", "play", "other"
  - `task_label` (text, NOT NULL) — custom label for "other" tasks
  - `completed_date` (date, NOT NULL, default today)
  - `is_completed` (boolean, default false)
  - `completed_at` (timestamptz, nullable)
  - `created_at` (timestamptz, default now())
  - Unique constraint on (user_id, pet_id, task_type, completed_date)

2. Security
- Enable RLS on `care_checklists`.
- Owner-scoped via user_id.
*/
CREATE TABLE IF NOT EXISTS care_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  task_label text NOT NULL DEFAULT '',
  completed_date date NOT NULL DEFAULT CURRENT_DATE,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, pet_id, task_type, completed_date)
);

ALTER TABLE care_checklists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_checklists" ON care_checklists;
CREATE POLICY "select_own_checklists" ON care_checklists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_checklists" ON care_checklists;
CREATE POLICY "insert_own_checklists" ON care_checklists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_checklists" ON care_checklists;
CREATE POLICY "update_own_checklists" ON care_checklists FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_checklists" ON care_checklists;
CREATE POLICY "delete_own_checklists" ON care_checklists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_checklists_user_date ON care_checklists(user_id, completed_date DESC);
