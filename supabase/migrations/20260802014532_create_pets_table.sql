/*
# Create pets table — user pet profiles

1. New Tables
- `pets` — stores each user's pet profiles
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users)
  - `name` (text, NOT NULL) — pet name
  - `species` (text, NOT NULL) — e.g. "Dog", "Cat", "Rabbit"
  - `breed` (text, nullable) — breed name
  - `age` (text, nullable) — age as text for flexibility ("3 years", "6 months")
  - `birth_date` (date, nullable) — optional birth date
  - `photo_url` (text, nullable) — profile photo URL (Supabase Storage path)
  - `notes` (text, nullable) — free-form notes about the pet
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `pets`.
- Owner-scoped CRUD: each authenticated user can only access their own pet rows.
- All 4 policies (select/insert/update/delete) use auth.uid() = user_id.
- user_id defaults to auth.uid() so frontend inserts that omit user_id succeed.

3. Indexes
- Index on user_id for fast per-user queries.
*/

CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  age text,
  birth_date date,
  photo_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pets" ON pets;
CREATE POLICY "select_own_pets" ON pets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pets" ON pets;
CREATE POLICY "insert_own_pets" ON pets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pets" ON pets;
CREATE POLICY "update_own_pets" ON pets FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pets" ON pets;
CREATE POLICY "delete_own_pets" ON pets FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
