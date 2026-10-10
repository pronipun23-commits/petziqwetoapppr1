/*
# Create plant_favorites table for saved plants

## Purpose
Allows authenticated users to save/favorite plants they want to revisit.

## New Table: plant_favorites
- `id` (uuid, primary key)
- `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users, cascade delete)
- `plant_id` (text, NOT NULL) — references plant ID from the static plants dataset
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on plant_favorites.
- Owner-scoped CRUD: each authenticated user can only access rows they own.
- 4 policies: select, insert, update, delete — all scoped to auth.uid() = user_id.
- user_id defaults to auth.uid() so frontend inserts omitting user_id still succeed.
- Unique constraint on (user_id, plant_id) prevents duplicate favorites.
*/

CREATE TABLE IF NOT EXISTS public.plant_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, plant_id)
);

ALTER TABLE public.plant_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "select_own_plant_favorites" ON public.plant_favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "insert_own_plant_favorites" ON public.plant_favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "update_own_plant_favorites" ON public.plant_favorites
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_plant_favorites" ON public.plant_favorites;
CREATE POLICY "delete_own_plant_favorites" ON public.plant_favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS plant_favorites_user_id_idx ON public.plant_favorites(user_id);