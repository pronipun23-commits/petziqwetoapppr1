/*
# Create pet_activities table — pet activity tracker

1. New Tables
- `pet_activities` — stores activity logs for each pet
  - `id` (uuid, PK)
  - `pet_id` (uuid, NOT NULL, FK to pets ON DELETE CASCADE)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users ON DELETE CASCADE)
  - `activity_type` (text, NOT NULL) — "walk", "play", "exercise", "training", "grooming", "other"
  - `duration_minutes` (integer, nullable) — optional duration
  - `notes` (text, nullable)
  - `activity_date` (date, NOT NULL, default today) — when the activity occurred
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `pet_activities`.
- Owner-scoped via user_id.
*/

CREATE TABLE IF NOT EXISTS pet_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  duration_minutes integer,
  notes text,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pet_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pet_activities" ON pet_activities;
CREATE POLICY "select_own_pet_activities" ON pet_activities FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pet_activities" ON pet_activities;
CREATE POLICY "insert_own_pet_activities" ON pet_activities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pet_activities" ON pet_activities;
CREATE POLICY "update_own_pet_activities" ON pet_activities FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pet_activities" ON pet_activities;
CREATE POLICY "delete_own_pet_activities" ON pet_activities FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pet_activities_pet_id ON pet_activities(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_activities_user_date ON pet_activities(user_id, activity_date DESC);
