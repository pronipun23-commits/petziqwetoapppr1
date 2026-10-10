/*
# Add gender to pets + Create user_plants table + plant-photos storage bucket

1. Modified Tables
- `pets` — add `gender` column (text, nullable) to store pet gender

2. New Tables
- `user_plants` — stores each user's personal plant collection
  - `id` (uuid, PK)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users ON DELETE CASCADE)
  - `name` (text, NOT NULL) — plant name given by user
  - `species` (text, nullable) — plant species/type
  - `care_level` (text, nullable) — "easy", "moderate", "advanced"
  - `watering_frequency` (text, nullable) — e.g. "Every 7 days"
  - `location` (text, nullable) — e.g. "Living room window"
  - `photo_url` (text, nullable) — storage path
  - `notes` (text, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

3. Storage
- Create private bucket "plant-photos" for user plant photo uploads (5MB limit, image types only)
- Storage policies: users can CRUD only files in their own folder (user_id/<path>)

4. Security
- Enable RLS on `user_plants` — owner-scoped CRUD via auth.uid() = user_id
- All 4 policies (select/insert/update/delete) for authenticated users only
- user_id defaults to auth.uid() so inserts that omit user_id succeed
*/

ALTER TABLE pets ADD COLUMN IF NOT EXISTS gender text;

CREATE TABLE IF NOT EXISTS user_plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text,
  care_level text,
  watering_frequency text,
  location text,
  photo_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_plants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_user_plants" ON user_plants;
CREATE POLICY "select_own_user_plants" ON user_plants FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_user_plants" ON user_plants;
CREATE POLICY "insert_own_user_plants" ON user_plants FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_user_plants" ON user_plants;
CREATE POLICY "update_own_user_plants" ON user_plants FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_user_plants" ON user_plants;
CREATE POLICY "delete_own_user_plants" ON user_plants FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_plants_user_id ON user_plants(user_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plant-photos',
  'plant-photos',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "read_own_plant_photos" ON storage.objects;
CREATE POLICY "read_own_plant_photos" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'plant-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "upload_own_plant_photos" ON storage.objects;
CREATE POLICY "upload_own_plant_photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'plant-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "update_own_plant_photos" ON storage.objects;
CREATE POLICY "update_own_plant_photos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'plant-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'plant-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "delete_own_plant_photos" ON storage.objects;
CREATE POLICY "delete_own_plant_photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'plant-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
