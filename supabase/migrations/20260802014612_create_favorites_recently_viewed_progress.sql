/*
# Create pet_favorites + recently_viewed + user_progress tables

1. New Tables
- `pet_favorites` — stores user's favorited pet breeds (replaces localStorage)
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users)
  - `item_type` (text, NOT NULL) — "breed" or "guide"
  - `item_id` (text, NOT NULL) — the breed or guide ID
  - `created_at` (timestamptz, default now())
  - Unique constraint on (user_id, item_type, item_id) to prevent duplicates

- `recently_viewed` — tracks recently viewed items for logged-in users
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users)
  - `item_type` (text, NOT NULL) — "plant", "breed", "guide"
  - `item_id` (text, NOT NULL)
  - `viewed_at` (timestamptz, default now())
  - Unique constraint on (user_id, item_type, item_id)

- `user_progress` — stores user's progress data (XP, streaks, achievements)
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users, UNIQUE)
  - `xp` (integer, default 0)
  - `care_streak` (integer, default 0) — current consecutive days of care activity
  - `last_care_date` (date, nullable) — last date a care task was completed
  - `tasks_completed` (integer, default 0) — total care tasks completed
  - `achievements` (jsonb, default '[]') — array of achievement IDs earned
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on all three tables.
- Owner-scoped CRUD via auth.uid() = user_id.
- pet_favorites and recently_viewed: full CRUD for owner.
- user_progress: SELECT, INSERT, UPDATE for owner (no manual delete — row auto-created).
*/
CREATE TABLE IF NOT EXISTS pet_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE pet_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pet_favorites" ON pet_favorites;
CREATE POLICY "select_own_pet_favorites" ON pet_favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pet_favorites" ON pet_favorites;
CREATE POLICY "insert_own_pet_favorites" ON pet_favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pet_favorites" ON pet_favorites;
CREATE POLICY "delete_own_pet_favorites" ON pet_favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pet_favorites_user ON pet_favorites(user_id);

CREATE TABLE IF NOT EXISTS recently_viewed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recently_viewed" ON recently_viewed;
CREATE POLICY "select_own_recently_viewed" ON recently_viewed FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_recently_viewed" ON recently_viewed;
CREATE POLICY "insert_own_recently_viewed" ON recently_viewed FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_recently_viewed" ON recently_viewed;
CREATE POLICY "update_own_recently_viewed" ON recently_viewed FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_recently_viewed" ON recently_viewed;
CREATE POLICY "delete_own_recently_viewed" ON recently_viewed FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer NOT NULL DEFAULT 0,
  care_streak integer NOT NULL DEFAULT 0,
  last_care_date date,
  tasks_completed integer NOT NULL DEFAULT 0,
  achievements jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON user_progress;
CREATE POLICY "select_own_progress" ON user_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON user_progress;
CREATE POLICY "insert_own_progress" ON user_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON user_progress;
CREATE POLICY "update_own_progress" ON user_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
