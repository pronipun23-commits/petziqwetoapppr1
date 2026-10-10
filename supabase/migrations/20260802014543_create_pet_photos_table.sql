/*
# Create pet_photos table — user pet photo galleries

1. New Tables
- `pet_photos` — stores photos for each pet
  - `id` (uuid, PK)
  - `pet_id` (uuid, NOT NULL, FK to pets ON DELETE CASCADE)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users ON DELETE CASCADE)
  - `photo_url` (text, NOT NULL) — storage path or URL
  - `caption` (text, nullable)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `pet_photos`.
- Owner-scoped via user_id: each authenticated user can only manage photos of their own pets.
- All 4 policies use auth.uid() = user_id for direct ownership.
*/

CREATE TABLE IF NOT EXISTS pet_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pet_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_pet_photos" ON pet_photos;
CREATE POLICY "select_own_pet_photos" ON pet_photos FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_pet_photos" ON pet_photos;
CREATE POLICY "insert_own_pet_photos" ON pet_photos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_pet_photos" ON pet_photos;
CREATE POLICY "update_own_pet_photos" ON pet_photos FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_pet_photos" ON pet_photos;
CREATE POLICY "delete_own_pet_photos" ON pet_photos FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pet_photos_pet_id ON pet_photos(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_user_id ON pet_photos(user_id);
