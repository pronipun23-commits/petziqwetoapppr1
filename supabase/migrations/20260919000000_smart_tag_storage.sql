/*
  Petziq Smart Tag storage

  This migration is limited to the existing Smart Tag feature. It is additive:
  it does not remove schema objects or existing rows, reset existing IDs, or
  alter existing pets, plants, reminders, users, or QR mappings.
*/

CREATE SEQUENCE IF NOT EXISTS public.smart_tag_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.smart_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text NOT NULL UNIQUE,
  name text,
  tag_type text NOT NULL DEFAULT 'pet',
  status text NOT NULL DEFAULT 'draft',
  user_id uuid REFERENCES auth.users(id),
  owner_id uuid REFERENCES auth.users(id),
  pet_id uuid REFERENCES public.pets(id),
  plant_id uuid REFERENCES public.user_plants(id),
  qr_url text,
  photo_url text,
  tag_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  visibility jsonb NOT NULL DEFAULT '{}'::jsonb,
  owner_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS tag_type text NOT NULL DEFAULT 'pet';
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS pet_id uuid REFERENCES public.pets(id);
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS plant_id uuid REFERENCES public.user_plants(id);
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS qr_url text;
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS tag_details jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS visibility jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS owner_info jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS activated_at timestamptz;
ALTER TABLE public.smart_tags ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_smart_tags_user_id ON public.smart_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_owner_id ON public.smart_tags(owner_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_pet_id ON public.smart_tags(pet_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_plant_id ON public.smart_tags(plant_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_status ON public.smart_tags(status);

CREATE OR REPLACE FUNCTION public.smart_tag_set_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := NEW.owner_id;
  END IF;
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := NEW.user_id;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgrelid = 'public.smart_tags'::regclass
      AND tgname = 'trg_smart_tag_set_owner'
      AND NOT tgisinternal
  ) THEN
    CREATE TRIGGER trg_smart_tag_set_owner
      BEFORE INSERT OR UPDATE ON public.smart_tags
      FOR EACH ROW
      EXECUTE FUNCTION public.smart_tag_set_owner();
  END IF;
END;
$$;

ALTER TABLE public.smart_tags ENABLE ROW LEVEL SECURITY;

-- Tighten only the known legacy public policy if it exists. No policy or row
-- is removed, and anonymous QR reads use get_public_tag_info() instead.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tags'
      AND policyname = 'public_select_smart_tags'
  ) THEN
    ALTER POLICY public_select_smart_tags
      ON public.smart_tags
      TO authenticated
      USING (auth.uid() = user_id OR auth.uid() = owner_id);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tags'
      AND policyname = 'smart_tags_select_owner'
  ) THEN
    CREATE POLICY smart_tags_select_owner
      ON public.smart_tags
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id OR auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tags'
      AND policyname = 'smart_tags_insert_owner'
  ) THEN
    CREATE POLICY smart_tags_insert_owner
      ON public.smart_tags
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tags'
      AND policyname = 'smart_tags_update_owner'
  ) THEN
    CREATE POLICY smart_tags_update_owner
      ON public.smart_tags
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id OR auth.uid() = owner_id)
      WITH CHECK (auth.uid() = user_id OR auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tags'
      AND policyname = 'smart_tags_delete_owner'
  ) THEN
    CREATE POLICY smart_tags_delete_owner
      ON public.smart_tags
      FOR DELETE TO authenticated
      USING (auth.uid() = user_id OR auth.uid() = owner_id);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_smart_tag_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  candidate text;
BEGIN
  LOOP
    candidate := 'PZ-' || to_char(nextval('public.smart_tag_id_seq'), 'FM000000');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.smart_tags WHERE tag_id = candidate
    );
  END LOOP;
  RETURN candidate;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_smart_tag_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_smart_tag_id() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_public_tag_info(p_tag_id text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT jsonb_build_object(
        'found', true,
        'id', t.id,
        'tag_id', t.tag_id,
        'tag_type', t.tag_type,
        'name', t.name,
        'status', t.status,
        'activated', t.status IN ('active', 'activated'),
        'tag_details', COALESCE(
          (
            SELECT jsonb_object_agg(k, v)
            FROM jsonb_each(t.tag_details) AS details(k, v)
            WHERE COALESCE((t.visibility ->> ('show_' || k))::boolean, false)
          ), '{}'::jsonb
        ),
        'visibility', t.visibility,
        'owner_info', COALESCE(
          (
            SELECT jsonb_object_agg(k, v)
            FROM jsonb_each(t.owner_info) AS owner(k, v)
            WHERE COALESCE((t.visibility ->> ('show_' || k))::boolean, false)
          ), '{}'::jsonb
        ),
        'photo_url', t.photo_url,
        'created_at', t.created_at,
        'updated_at', t.updated_at
      )
      FROM public.smart_tags AS t
      WHERE t.tag_id = p_tag_id
        AND t.status IN ('active', 'activated')
    ),
    jsonb_build_object('found', false)
  );
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_tag_info(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_tag_info(text) TO anon, authenticated;
