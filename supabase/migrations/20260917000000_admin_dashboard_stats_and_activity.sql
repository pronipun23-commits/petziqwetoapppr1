/*
# Non-destructive Petziq admin dashboard migration

This migration is safe to run against the existing Petziq database:
- It never drops tables, deletes rows, or resets sequences.
- It creates missing tables, columns, functions, indexes, policies, and triggers.
- It preserves existing user, pet, plant, reminder, profile, Smart Tag, and QR data.
- It creates profiles.role when the earlier role migration was not applied.
- It preserves PZ-000001 and every other existing Smart Tag identifier.
*/

-- ============================================================================
-- 1. Existing profile authorization schema
-- ============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text;

-- Add the role constraint only when the database does not already have one.
-- An existing constraint is left untouched so this migration never drops a
-- constraint or changes existing rows.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%role%'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('user', 'admin', 'marketing_admin'));
  END IF;
END $$;

-- Keep role server-controlled while retaining normal profile editing.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, pet_name) ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;

-- Existing administrator assignments remain owned by the existing Petziq
-- authorization setup. This migration never assigns or changes user roles.

-- ============================================================================
-- 2. Server-side authorization functions
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'marketing_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_full_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_full_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_full_admin() TO authenticated;

-- ============================================================================
-- 3. Smart Tag order tables
-- ============================================================================

CREATE SEQUENCE IF NOT EXISTS public.smart_tag_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.smart_tag_order_num_seq START 1;

CREATE TABLE IF NOT EXISTS public.smart_tag_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  shipping_name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  quantity int NOT NULL DEFAULT 1,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_ref text,
  shipping_status text NOT NULL DEFAULT 'pending',
  courier text,
  tracking_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_tag_orders
  ADD COLUMN IF NOT EXISTS payment_ref text;
ALTER TABLE public.smart_tag_orders
  ADD COLUMN IF NOT EXISTS courier text;
ALTER TABLE public.smart_tag_orders
  ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE public.smart_tag_orders
  ADD COLUMN IF NOT EXISTS notes text;

CREATE INDEX IF NOT EXISTS idx_orders_user
  ON public.smart_tag_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment
  ON public.smart_tag_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_shipping
  ON public.smart_tag_orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_orders_created
  ON public.smart_tag_orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.smart_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text UNIQUE NOT NULL,
  name text,
  tag_type text NOT NULL DEFAULT 'pet',
  status text NOT NULL DEFAULT 'draft',
  user_id uuid REFERENCES auth.users(id),
  owner_id uuid REFERENCES auth.users(id),
  pet_id uuid REFERENCES public.pets(id),
  plant_id uuid REFERENCES public.user_plants(id),
  order_id uuid REFERENCES public.smart_tag_orders(id),
  qr_url text,
  photo_url text,
  tag_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  visibility jsonb NOT NULL DEFAULT '{}'::jsonb,
  owner_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS tag_type text NOT NULL DEFAULT 'pet';
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS plant_id uuid REFERENCES public.user_plants(id);
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS tag_details jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS visibility jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS owner_info jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS qr_url text;
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES public.smart_tag_orders(id);
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS activated_at timestamptz;
ALTER TABLE public.smart_tags
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Ownership backfill changes only missing ownership fields. Tag IDs and QR URLs
-- are never changed.
UPDATE public.smart_tags
SET user_id = owner_id
WHERE user_id IS NULL
  AND owner_id IS NOT NULL;

UPDATE public.smart_tags
SET owner_id = user_id
WHERE owner_id IS NULL
  AND user_id IS NOT NULL;

-- Add a status constraint only when none exists. Existing constraints are not
-- dropped or replaced by this migration.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.smart_tags'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  ) THEN
    ALTER TABLE public.smart_tags
      ADD CONSTRAINT smart_tags_status_check
      CHECK (
        status IN (
          'draft', 'ready', 'coming_soon', 'active',
          'available', 'reserved', 'sold', 'shipped',
          'activated', 'disabled', 'lost', 'retired'
        )
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_smart_tags_status
  ON public.smart_tags(status);
CREATE INDEX IF NOT EXISTS idx_smart_tags_owner
  ON public.smart_tags(owner_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_user
  ON public.smart_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_pet
  ON public.smart_tags(pet_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_type
  ON public.smart_tags(tag_type);

CREATE TABLE IF NOT EXISTS public.smart_tag_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.smart_tag_orders(id),
  tag_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order
  ON public.smart_tag_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_tag
  ON public.smart_tag_order_items(tag_id);

CREATE OR REPLACE FUNCTION public.sync_smart_tag_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := NEW.owner_id;
  END IF;

  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;

  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgrelid = 'public.smart_tags'::regclass
      AND tgname = 'trg_sync_smart_tag_owner'
      AND NOT tgisinternal
  ) THEN
    CREATE TRIGGER trg_sync_smart_tag_owner
      BEFORE INSERT OR UPDATE ON public.smart_tags
      FOR EACH ROW
      EXECUTE FUNCTION public.sync_smart_tag_owner();
  END IF;
END $$;

-- ============================================================================
-- 4. RLS and policies
-- ============================================================================

ALTER TABLE public.smart_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_tag_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_tag_order_items ENABLE ROW LEVEL SECURITY;

-- If the old public Smart Tag policy exists, tighten it without dropping it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tags'
      AND policyname = 'public_select_smart_tags'
  ) THEN
    ALTER POLICY "public_select_smart_tags"
      ON public.smart_tags
      TO authenticated
      USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tags'
      AND policyname = 'select_own_smart_tags'
  ) THEN
    CREATE POLICY "select_own_smart_tags"
      ON public.smart_tags FOR SELECT TO authenticated
      USING (auth.uid() = user_id OR auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tags'
      AND policyname = 'select_admin_smart_tags'
  ) THEN
    CREATE POLICY "select_admin_smart_tags"
      ON public.smart_tags FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tags'
      AND policyname = 'insert_own_smart_tags'
  ) THEN
    CREATE POLICY "insert_own_smart_tags"
      ON public.smart_tags FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tags'
      AND policyname = 'update_own_smart_tags'
  ) THEN
    CREATE POLICY "update_own_smart_tags"
      ON public.smart_tags FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tag_orders'
      AND policyname = 'select_own_orders'
  ) THEN
    CREATE POLICY "select_own_orders"
      ON public.smart_tag_orders FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tag_orders'
      AND policyname = 'select_admin_orders'
  ) THEN
    CREATE POLICY "select_admin_orders"
      ON public.smart_tag_orders FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tag_orders'
      AND policyname = 'insert_own_orders'
  ) THEN
    CREATE POLICY "insert_own_orders"
      ON public.smart_tag_orders FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tag_order_items'
      AND policyname = 'select_own_order_items'
  ) THEN
    CREATE POLICY "select_own_order_items"
      ON public.smart_tag_order_items FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.smart_tag_orders o
          WHERE o.id = smart_tag_order_items.order_id
            AND o.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'smart_tag_order_items'
      AND policyname = 'select_admin_order_items'
  ) THEN
    CREATE POLICY "select_admin_order_items"
      ON public.smart_tag_order_items FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- Add admin read policies without removing owner policies.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'select_admin_profiles'
  ) THEN
    CREATE POLICY "select_admin_profiles"
      ON public.profiles FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pets'
      AND policyname = 'select_admin_pets'
  ) THEN
    CREATE POLICY "select_admin_pets"
      ON public.pets FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_plants'
      AND policyname = 'select_admin_user_plants'
  ) THEN
    CREATE POLICY "select_admin_user_plants"
      ON public.user_plants FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'reminders'
      AND policyname = 'select_admin_reminders'
  ) THEN
    CREATE POLICY "select_admin_reminders"
      ON public.reminders FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pet_activities'
      AND policyname = 'select_admin_pet_activities'
  ) THEN
    CREATE POLICY "select_admin_pet_activities"
      ON public.pet_activities FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

-- ============================================================================
-- 5. Real activity table and triggers
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  actor_id uuid REFERENCES auth.users(id),
  actor_name text,
  entity_type text,
  entity_id text,
  summary text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  dedupe_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_events_created
  ON public.activity_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_type
  ON public.activity_events(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_events_actor
  ON public.activity_events(actor_id);

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'activity_events'
      AND policyname = 'select_admin_activity_events'
  ) THEN
    CREATE POLICY "select_admin_activity_events"
      ON public.activity_events FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.log_activity(
  p_event_type text,
  p_actor_id uuid,
  p_actor_name text,
  p_entity_type text,
  p_entity_id text,
  p_summary text,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_dedupe_key text DEFAULT NULL,
  p_created_at timestamptz DEFAULT now()
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.activity_events (
    event_type,
    actor_id,
    actor_name,
    entity_type,
    entity_id,
    summary,
    metadata,
    dedupe_key,
    created_at
  )
  VALUES (
    p_event_type,
    p_actor_id,
    p_actor_name,
    p_entity_type,
    p_entity_id,
    p_summary,
    COALESCE(p_metadata, '{}'::jsonb),
    p_dedupe_key,
    COALESCE(p_created_at, now())
  )
  ON CONFLICT (dedupe_key) DO NOTHING;
$$;

REVOKE EXECUTE ON FUNCTION public.log_activity(
  text, uuid, text, text, text, text, jsonb, text, timestamptz
) FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.trg_log_profile_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_activity(
    'user_registered',
    NEW.id,
    NEW.full_name,
    'profile',
    NEW.id::text,
    COALESCE(NULLIF(NEW.full_name, ''), 'A new user') || ' registered on Petziq',
    '{}'::jsonb,
    'profile:' || NEW.id::text,
    COALESCE(NEW.created_at, now())
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_log_pet_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_activity(
    'pet_created',
    NEW.user_id,
    NULL,
    'pet',
    NEW.id::text,
    'Pet "' || NEW.name || '" (' || NEW.species || ') was added',
    jsonb_build_object('species', NEW.species, 'breed', NEW.breed),
    'pet:' || NEW.id::text,
    COALESCE(NEW.created_at, now())
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_log_plant_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_activity(
    'plant_created',
    NEW.user_id,
    NULL,
    'plant',
    NEW.id::text,
    'Plant "' || NEW.name || '" was added',
    jsonb_build_object('species', NEW.species),
    'plant:' || NEW.id::text,
    COALESCE(NEW.created_at, now())
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_log_reminder_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_activity(
    'reminder_created',
    NEW.user_id,
    NULL,
    'reminder',
    NEW.id::text,
    'Reminder "' || NEW.title || '" was created',
    jsonb_build_object('type', NEW.type, 'due_at', NEW.due_at),
    'reminder:' || NEW.id::text,
    COALESCE(NEW.created_at, now())
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_log_order_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_activity(
    'order_created',
    NEW.user_id,
    NEW.customer_name,
    'order',
    NEW.id::text,
    'Smart Tag order ' || NEW.order_number || ' was created',
    jsonb_build_object(
      'quantity', NEW.quantity,
      'amount', NEW.amount,
      'payment_status', NEW.payment_status
    ),
    'order:' || NEW.id::text,
    COALESCE(NEW.created_at, now())
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_log_smart_tag_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_activity(
    'tag_created',
    COALESCE(NEW.user_id, NEW.owner_id),
    NULL,
    'smart_tag',
    NEW.tag_id,
    'Smart Tag ' || NEW.tag_id || ' was created',
    jsonb_build_object('tag_type', NEW.tag_type, 'status', NEW.status),
    'tag-created:' || NEW.tag_id,
    COALESCE(NEW.created_at, now())
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_log_smart_tag_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.log_activity(
      CASE
        WHEN NEW.status = 'activated' THEN 'tag_activated'
        ELSE 'tag_status_changed'
      END,
      COALESCE(NEW.user_id, NEW.owner_id),
      NULL,
      'smart_tag',
      NEW.tag_id,
      'Smart Tag ' || NEW.tag_id || ' changed to ' || NEW.status,
      jsonb_build_object('from', OLD.status, 'to', NEW.status),
      NULL,
      now()
    );
  END IF;

  IF NEW.pet_id IS DISTINCT FROM OLD.pet_id
     AND NEW.pet_id IS NOT NULL THEN
    PERFORM public.log_activity(
      'tag_linked_to_pet',
      COALESCE(NEW.user_id, NEW.owner_id),
      NULL,
      'smart_tag',
      NEW.tag_id,
      'Smart Tag ' || NEW.tag_id || ' was linked to a pet',
      jsonb_build_object('pet_id', NEW.pet_id),
      NULL,
      now()
    );
  END IF;

  RETURN NEW;
END;
$$;

DO $$
DECLARE
  trigger_record record;
BEGIN
  FOR trigger_record IN
    SELECT * FROM (VALUES
      ('trg_activity_profile_insert', 'public.profiles'::regclass, 'public.trg_log_profile_insert()'),
      ('trg_activity_pet_insert', 'public.pets'::regclass, 'public.trg_log_pet_insert()'),
      ('trg_activity_plant_insert', 'public.user_plants'::regclass, 'public.trg_log_plant_insert()'),
      ('trg_activity_reminder_insert', 'public.reminders'::regclass, 'public.trg_log_reminder_insert()'),
      ('trg_activity_order_insert', 'public.smart_tag_orders'::regclass, 'public.trg_log_order_insert()'),
      ('trg_activity_smart_tag_insert', 'public.smart_tags'::regclass, 'public.trg_log_smart_tag_insert()'),
      ('trg_activity_smart_tag_update', 'public.smart_tags'::regclass, 'public.trg_log_smart_tag_update()')
    ) AS trigger_data(trigger_name, relation_name, function_call)
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgrelid = trigger_record.relation_name
        AND tgname = trigger_record.trigger_name
        AND NOT tgisinternal
    ) THEN
      IF trigger_record.trigger_name = 'trg_activity_profile_insert' THEN
        CREATE TRIGGER trg_activity_profile_insert
          AFTER INSERT ON public.profiles
          FOR EACH ROW EXECUTE FUNCTION public.trg_log_profile_insert();
      ELSIF trigger_record.trigger_name = 'trg_activity_pet_insert' THEN
        CREATE TRIGGER trg_activity_pet_insert
          AFTER INSERT ON public.pets
          FOR EACH ROW EXECUTE FUNCTION public.trg_log_pet_insert();
      ELSIF trigger_record.trigger_name = 'trg_activity_plant_insert' THEN
        CREATE TRIGGER trg_activity_plant_insert
          AFTER INSERT ON public.user_plants
          FOR EACH ROW EXECUTE FUNCTION public.trg_log_plant_insert();
      ELSIF trigger_record.trigger_name = 'trg_activity_reminder_insert' THEN
        CREATE TRIGGER trg_activity_reminder_insert
          AFTER INSERT ON public.reminders
          FOR EACH ROW EXECUTE FUNCTION public.trg_log_reminder_insert();
      ELSIF trigger_record.trigger_name = 'trg_activity_order_insert' THEN
        CREATE TRIGGER trg_activity_order_insert
          AFTER INSERT ON public.smart_tag_orders
          FOR EACH ROW EXECUTE FUNCTION public.trg_log_order_insert();
      ELSIF trigger_record.trigger_name = 'trg_activity_smart_tag_insert' THEN
        CREATE TRIGGER trg_activity_smart_tag_insert
          AFTER INSERT ON public.smart_tags
          FOR EACH ROW EXECUTE FUNCTION public.trg_log_smart_tag_insert();
      ELSIF trigger_record.trigger_name = 'trg_activity_smart_tag_update' THEN
        CREATE TRIGGER trg_activity_smart_tag_update
          AFTER UPDATE ON public.smart_tags
          FOR EACH ROW EXECUTE FUNCTION public.trg_log_smart_tag_update();
      END IF;
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- 6. Historical activity backfill
-- ============================================================================

INSERT INTO public.activity_events (
  event_type, actor_id, actor_name, entity_type, entity_id,
  summary, dedupe_key, created_at
)
SELECT
  'user_registered',
  u.id,
  p.full_name,
  'profile',
  u.id::text,
  COALESCE(NULLIF(p.full_name, ''), 'A new user') || ' registered on Petziq',
  'profile:' || u.id::text,
  COALESCE(u.created_at, now())
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (
  event_type, actor_id, entity_type, entity_id,
  summary, metadata, dedupe_key, created_at
)
SELECT
  'pet_created',
  p.user_id,
  'pet',
  p.id::text,
  'Pet "' || p.name || '" (' || p.species || ') was added',
  jsonb_build_object('species', p.species, 'breed', p.breed),
  'pet:' || p.id::text,
  COALESCE(p.created_at, now())
FROM public.pets p
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (
  event_type, actor_id, entity_type, entity_id,
  summary, metadata, dedupe_key, created_at
)
SELECT
  'plant_created',
  p.user_id,
  'plant',
  p.id::text,
  'Plant "' || p.name || '" was added',
  jsonb_build_object('species', p.species),
  'plant:' || p.id::text,
  COALESCE(p.created_at, now())
FROM public.user_plants p
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (
  event_type, actor_id, entity_type, entity_id,
  summary, metadata, dedupe_key, created_at
)
SELECT
  'tag_created',
  COALESCE(t.user_id, t.owner_id),
  'smart_tag',
  t.tag_id,
  'Smart Tag ' || t.tag_id || ' was created',
  jsonb_build_object('tag_type', t.tag_type, 'status', t.status),
  'tag-created:' || t.tag_id,
  COALESCE(t.created_at, now())
FROM public.smart_tags t
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (
  event_type, actor_id, entity_type, entity_id,
  summary, metadata, dedupe_key, created_at
)
SELECT
  'tag_activated',
  COALESCE(t.user_id, t.owner_id),
  'smart_tag',
  t.tag_id,
  'Smart Tag ' || t.tag_id || ' was activated',
  jsonb_build_object('status', t.status),
  'tag-activated:' || t.tag_id,
  COALESCE(t.activated_at, t.created_at, now())
FROM public.smart_tags t
WHERE t.status = 'activated'
  AND t.activated_at IS NOT NULL
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (
  event_type, actor_id, entity_type, entity_id,
  summary, metadata, dedupe_key, created_at
)
SELECT
  'reminder_created',
  r.user_id,
  'reminder',
  r.id::text,
  'Reminder "' || r.title || '" was created',
  jsonb_build_object('type', r.type, 'due_at', r.due_at),
  'reminder:' || r.id::text,
  COALESCE(r.created_at, now())
FROM public.reminders r
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (
  event_type, actor_id, actor_name, entity_type, entity_id,
  summary, metadata, dedupe_key, created_at
)
SELECT
  'order_created',
  o.user_id,
  o.customer_name,
  'order',
  o.id::text,
  'Smart Tag order ' || o.order_number || ' was created',
  jsonb_build_object(
    'quantity', o.quantity,
    'amount', o.amount,
    'payment_status', o.payment_status
  ),
  'order:' || o.id::text,
  COALESCE(o.created_at, now())
FROM public.smart_tag_orders o
ON CONFLICT (dedupe_key) DO NOTHING;

-- ============================================================================
-- 7. Admin statistics and activity readers
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT count(*) FROM auth.users),
    'total_profiles', (SELECT count(*) FROM public.profiles),
    'total_pets', (SELECT count(*) FROM public.pets),
    'total_plants', (SELECT count(*) FROM public.user_plants),
    'total_tags', (SELECT count(*) FROM public.smart_tags),
    'active_tags', (SELECT count(*) FROM public.smart_tags WHERE status = 'activated'),
    'draft_tags', (SELECT count(*) FROM public.smart_tags WHERE status = 'draft'),
    'total_reminders', (SELECT count(*) FROM public.reminders),
    'total_orders', (SELECT count(*) FROM public.smart_tag_orders),
    'pending_orders', (SELECT count(*) FROM public.smart_tag_orders WHERE payment_status = 'pending'),
    'paid_orders', (SELECT count(*) FROM public.smart_tag_orders WHERE payment_status = 'paid'),
    'revenue', (SELECT COALESCE(sum(amount), 0) FROM public.smart_tag_orders WHERE payment_status = 'paid'),
    'total_customers', (SELECT count(*) FROM public.profiles),
    'total_smart_tags', (SELECT count(*) FROM public.smart_tags),
    'activated_tags', (SELECT count(*) FROM public.smart_tags WHERE status = 'activated'),
    'available_tags', (SELECT count(*) FROM public.smart_tags WHERE status = 'available'),
    'sold_tags', (SELECT count(*) FROM public.smart_tags WHERE status = 'sold'),
    'generated_at', now()
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_stats() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_activity(p_limit int DEFAULT 25)
RETURNS TABLE (
  id uuid,
  event_type text,
  actor_id uuid,
  actor_name text,
  entity_type text,
  entity_id text,
  summary text,
  metadata jsonb,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    e.id,
    e.event_type,
    e.actor_id,
    e.actor_name,
    e.entity_type,
    e.entity_id,
    e.summary,
    e.metadata,
    e.created_at
  FROM public.activity_events e
  ORDER BY e.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 25), 200));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_activity(int) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_admin_activity(int) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_users(p_limit int DEFAULT 100)
RETURNS TABLE (
  id uuid,
  full_name text,
  pet_name text,
  role text,
  created_at timestamptz,
  pet_count bigint,
  plant_count bigint,
  tag_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_full_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    COALESCE(NULLIF(p.full_name, ''), 'Unnamed user'),
    p.pet_name,
    COALESCE(p.role, 'user'),
    u.created_at,
    (SELECT count(*) FROM public.pets x WHERE x.user_id = u.id),
    (SELECT count(*) FROM public.user_plants x WHERE x.user_id = u.id),
    (
      SELECT count(*)
      FROM public.smart_tags x
      WHERE x.user_id = u.id OR x.owner_id = u.id
    )
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  ORDER BY u.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 100), 500));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_users(int) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_admin_users(int) TO authenticated;

-- ============================================================================
-- 8. Privacy-filtered public QR reader
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_public_tag_info(p_tag_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tag_row public.smart_tags;
  pet_row public.pets;
  details jsonb := '{}'::jsonb;
  owner_data jsonb := '{}'::jsonb;
  photo text := NULL;
BEGIN
  SELECT *
  INTO tag_row
  FROM public.smart_tags
  WHERE tag_id = p_tag_id
    AND status <> 'retired';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  SELECT COALESCE(jsonb_object_agg(d.key, d.value), '{}'::jsonb)
  INTO details
  FROM jsonb_each_text(tag_row.tag_details) AS d(key, value)
  WHERE COALESCE(tag_row.visibility ->> d.key, 'false') = 'true';

  SELECT COALESCE(jsonb_object_agg(o.key, o.value), '{}'::jsonb)
  INTO owner_data
  FROM jsonb_each_text(tag_row.owner_info) AS o(key, value)
  WHERE COALESCE(tag_row.visibility ->> o.key, 'false') = 'true';

  IF COALESCE(tag_row.visibility ->> 'photo', 'false') = 'true' THEN
    photo := tag_row.photo_url;
  END IF;

  IF tag_row.pet_id IS NOT NULL THEN
    SELECT * INTO pet_row
    FROM public.pets
    WHERE id = tag_row.pet_id;
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'tag_id', tag_row.tag_id,
    'tag_type', tag_row.tag_type,
    'name', tag_row.name,
    'status', tag_row.status,
    'photo_url', photo,
    'tag_details', details,
    'owner_info', owner_data,
    'visibility', COALESCE(tag_row.visibility, '{}'::jsonb),
    'created_at', tag_row.created_at,
    'updated_at', tag_row.updated_at,
    'activated', tag_row.status = 'activated',
    'pet_name', COALESCE(tag_row.name, pet_row.name),
    'species', pet_row.species,
    'breed', pet_row.breed
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_tag_info(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_public_tag_info(text) TO anon, authenticated;

-- ============================================================================
-- 9. ID-preserving Smart Tag generation and activation
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_smart_tags(p_count int)
RETURNS TABLE (tag_id text, qr_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sequence_value bigint;
  generated_tag text;
  generated_qr text;
  attempt int;
  item int;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  IF p_count IS NULL OR p_count < 1 OR p_count > 1000 THEN
    RAISE EXCEPTION 'Invalid count: must be between 1 and 1000';
  END IF;

  FOR item IN 1..p_count LOOP
    FOR attempt IN 1..1000 LOOP
      sequence_value := nextval('public.smart_tag_id_seq');
      generated_tag := 'PZ-' || lpad(sequence_value::text, 6, '0');

      EXIT WHEN NOT EXISTS (
        SELECT 1
        FROM public.smart_tags
        WHERE tag_id = generated_tag
      );
    END LOOP;

    generated_qr := 'https://petziqq.com/tag/' || generated_tag;

    INSERT INTO public.smart_tags (
      tag_id,
      status,
      qr_url,
      tag_type
    )
    VALUES (
      generated_tag,
      'available',
      generated_qr,
      'pet'
    );

    tag_id := generated_tag;
    qr_url := generated_qr;
    RETURN NEXT;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_smart_tags(int) FROM anon;
GRANT EXECUTE ON FUNCTION public.generate_smart_tags(int) TO authenticated;

CREATE OR REPLACE FUNCTION public.activate_smart_tag(
  p_tag_id text,
  p_pet_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tag_row record;
BEGIN
  SELECT *
  INTO tag_row
  FROM public.smart_tags
  WHERE tag_id = p_tag_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tag not found';
  END IF;

  IF tag_row.status IN ('disabled', 'lost', 'retired') THEN
    RAISE EXCEPTION 'This tag is no longer available';
  END IF;

  IF tag_row.owner_id IS NOT NULL
     AND tag_row.owner_id <> auth.uid() THEN
    RAISE EXCEPTION 'This tag is already activated by another owner';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.pets
    WHERE id = p_pet_id
      AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Pet not found or does not belong to you';
  END IF;

  UPDATE public.smart_tags
  SET status = 'activated',
      pet_id = p_pet_id,
      owner_id = auth.uid(),
      user_id = COALESCE(user_id, auth.uid()),
      activated_at = COALESCE(activated_at, now()),
      updated_at = now()
  WHERE tag_id = p_tag_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.activate_smart_tag(text, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.activate_smart_tag(text, uuid) TO authenticated;

-- ============================================================================
-- 10. Realtime publication
-- ============================================================================

DO $$
DECLARE
  table_name text;
  target_tables text[] := ARRAY[
    'activity_events',
    'smart_tags',
    'profiles',
    'pets',
    'user_plants',
    'reminders',
    'smart_tag_orders'
  ];
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    FOREACH table_name IN ARRAY target_tables LOOP
      BEGIN
        EXECUTE format(
          'ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',
          table_name
        );
      EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN undefined_table THEN NULL;
      END;
    END LOOP;
  END IF;
END $$;

-- ============================================================================
-- 11. Preserve all existing PZ identifiers
-- ============================================================================

DO $$
DECLARE
  highest_existing bigint;
  current_sequence bigint;
  sequence_called boolean;
BEGIN
  BEGIN
    SELECT last_value, is_called
    INTO current_sequence, sequence_called
    FROM public.smart_tag_id_seq;
  EXCEPTION
    WHEN OTHERS THEN
      current_sequence := 0;
      sequence_called := true;
  END;

  SELECT max((regexp_replace(tag_id, '^PZ-', ''))::bigint)
  INTO highest_existing
  FROM public.smart_tags
  WHERE tag_id ~ '^PZ-[0-9]{6}$';

  -- Move the sequence forward only. If PZ-000001 already exists and the
  -- sequence has not been called, setval(..., true) makes the next ID PZ-000002.
  IF highest_existing IS NOT NULL
     AND (
       highest_existing > COALESCE(current_sequence, 0)
       OR (
         highest_existing = COALESCE(current_sequence, 0)
         AND NOT sequence_called
       )
     ) THEN
    PERFORM setval(
      'public.smart_tag_id_seq',
      highest_existing,
      true
    );
  END IF;
END $$;
