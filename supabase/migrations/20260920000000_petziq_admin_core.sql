/*
  Petziq admin core

  Additive admin data layer for the existing profiles, pets, plants, reminders,
  Smart Tags, and optional Smart Tag orders. This migration does not remove
  schema objects or existing rows and never changes Smart Tag identifiers.
*/

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text;

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
END;
$$;

-- Provision only the already-authorized Petziq accounts. The third admin slot
-- remains unassigned until an address is provided.
UPDATE public.profiles AS p
SET role = 'admin'
FROM auth.users AS u
WHERE p.id = u.id
  AND lower(u.email) IN (
    'pronipun23@gmail.com',
    'petziq.team@gmail.com',
    'nipunmenon2509@gmail.com'
  )
  AND p.role IS DISTINCT FROM 'admin';

UPDATE public.profiles AS p
SET role = 'marketing_admin'
FROM auth.users AS u
WHERE p.id = u.id
  AND lower(u.email) = 'gavishvarun@gmail.com'
  AND p.role IS DISTINCT FROM 'marketing_admin';

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

CREATE TABLE IF NOT EXISTS public.smart_tag_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  shipping_name text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'India',
  quantity integer NOT NULL DEFAULT 1,
  amount numeric(10, 2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_ref text,
  shipping_status text NOT NULL DEFAULT 'pending',
  courier text,
  tracking_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.smart_tag_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.smart_tag_orders(id),
  tag_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_orders_user_id
  ON public.smart_tag_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_orders_created_at
  ON public.smart_tag_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_order_items_order_id
  ON public.smart_tag_order_items(order_id);

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

ALTER TABLE public.activity_events
  ADD COLUMN IF NOT EXISTS actor_name text;

CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at
  ON public.activity_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_event_type
  ON public.activity_events(event_type);

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_tag_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_tag_order_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'activity_events'
      AND policyname = 'admin_read_activity_events'
  ) THEN
    CREATE POLICY admin_read_activity_events
      ON public.activity_events
      FOR SELECT TO authenticated
      USING (public.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tags'
      AND policyname = 'full_admin_read_smart_tags'
  ) THEN
    CREATE POLICY full_admin_read_smart_tags
      ON public.smart_tags
      FOR SELECT TO authenticated
      USING (public.is_full_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tag_orders'
      AND policyname = 'owner_read_smart_tag_orders'
  ) THEN
    CREATE POLICY owner_read_smart_tag_orders
      ON public.smart_tag_orders
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tag_orders'
      AND policyname = 'full_admin_read_smart_tag_orders'
  ) THEN
    CREATE POLICY full_admin_read_smart_tag_orders
      ON public.smart_tag_orders
      FOR SELECT TO authenticated
      USING (public.is_full_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tag_order_items'
      AND policyname = 'owner_read_smart_tag_order_items'
  ) THEN
    CREATE POLICY owner_read_smart_tag_order_items
      ON public.smart_tag_order_items
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.smart_tag_orders AS o
          WHERE o.id = order_id
            AND o.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'smart_tag_order_items'
      AND policyname = 'full_admin_read_smart_tag_order_items'
  ) THEN
    CREATE POLICY full_admin_read_smart_tag_order_items
      ON public.smart_tag_order_items
      FOR SELECT TO authenticated
      USING (public.is_full_admin());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'admin_read_profiles'
  ) THEN
    CREATE POLICY admin_read_profiles
      ON public.profiles
      FOR SELECT TO authenticated
      USING (public.is_full_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'pets'
      AND policyname = 'admin_read_pets'
  ) THEN
    CREATE POLICY admin_read_pets
      ON public.pets
      FOR SELECT TO authenticated
      USING (public.is_full_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_plants'
      AND policyname = 'admin_read_user_plants'
  ) THEN
    CREATE POLICY admin_read_user_plants
      ON public.user_plants
      FOR SELECT TO authenticated
      USING (public.is_full_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'reminders'
      AND policyname = 'admin_read_reminders'
  ) THEN
    CREATE POLICY admin_read_reminders
      ON public.reminders
      FOR SELECT TO authenticated
      USING (public.is_full_admin());
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_log_event(
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

REVOKE EXECUTE ON FUNCTION public.admin_log_event(text, uuid, text, text, text, text, jsonb, text, timestamptz) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.admin_profile_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_log_event(
    'user_registered', NEW.id, NEW.full_name, 'profile', NEW.id::text,
    COALESCE(NULLIF(NEW.full_name, ''), 'A new user') || ' registered on Petziq',
    '{}'::jsonb, 'profile:' || NEW.id::text, NEW.created_at
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_pet_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_log_event(
    'pet_created', NEW.user_id, NULL, 'pet', NEW.id::text,
    'Pet "' || NEW.name || '" was added',
    jsonb_build_object('species', NEW.species, 'breed', NEW.breed),
    'pet:' || NEW.id::text, NEW.created_at
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_plant_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_log_event(
    'plant_created', NEW.user_id, NULL, 'plant', NEW.id::text,
    'Plant "' || NEW.name || '" was added',
    jsonb_build_object('species', NEW.species),
    'plant:' || NEW.id::text, NEW.created_at
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reminder_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_log_event(
    'reminder_created', NEW.user_id, NULL, 'reminder', NEW.id::text,
    'Reminder "' || NEW.title || '" was created',
    jsonb_build_object('type', NEW.type),
    'reminder:' || NEW.id::text, NEW.created_at
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_tag_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_log_event(
    'tag_created', COALESCE(NEW.user_id, NEW.owner_id), NULL,
    'smart_tag', NEW.id::text,
    'Smart Tag ' || NEW.tag_id || ' was created',
    jsonb_build_object('tag_id', NEW.tag_id, 'tag_type', NEW.tag_type, 'status', NEW.status),
    'tag-created:' || NEW.id::text, NEW.created_at
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_tag_status_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.admin_log_event(
      CASE WHEN NEW.status IN ('active', 'activated') THEN 'tag_activated' ELSE 'tag_status_changed' END,
      COALESCE(NEW.user_id, NEW.owner_id), NULL,
      'smart_tag', NEW.id::text,
      'Smart Tag ' || NEW.tag_id || ' changed to ' || NEW.status,
      jsonb_build_object('from', OLD.status, 'to', NEW.status),
      NULL, now()
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_order_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.admin_log_event(
    'order_created', NEW.user_id, NEW.customer_name,
    'order', NEW.id::text,
    'Smart Tag order ' || NEW.order_number || ' was created',
    jsonb_build_object('quantity', NEW.quantity, 'amount', NEW.amount, 'payment_status', NEW.payment_status),
    'order:' || NEW.id::text, NEW.created_at
  );
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.profiles'::regclass AND tgname = 'trg_admin_profile_activity' AND NOT tgisinternal) THEN
    CREATE TRIGGER trg_admin_profile_activity AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.admin_profile_activity();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.pets'::regclass AND tgname = 'trg_admin_pet_activity' AND NOT tgisinternal) THEN
    CREATE TRIGGER trg_admin_pet_activity AFTER INSERT ON public.pets FOR EACH ROW EXECUTE FUNCTION public.admin_pet_activity();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.user_plants'::regclass AND tgname = 'trg_admin_plant_activity' AND NOT tgisinternal) THEN
    CREATE TRIGGER trg_admin_plant_activity AFTER INSERT ON public.user_plants FOR EACH ROW EXECUTE FUNCTION public.admin_plant_activity();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.reminders'::regclass AND tgname = 'trg_admin_reminder_activity' AND NOT tgisinternal) THEN
    CREATE TRIGGER trg_admin_reminder_activity AFTER INSERT ON public.reminders FOR EACH ROW EXECUTE FUNCTION public.admin_reminder_activity();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.smart_tags'::regclass AND tgname = 'trg_admin_tag_activity' AND NOT tgisinternal) THEN
    CREATE TRIGGER trg_admin_tag_activity AFTER INSERT ON public.smart_tags FOR EACH ROW EXECUTE FUNCTION public.admin_tag_activity();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.smart_tags'::regclass AND tgname = 'trg_admin_tag_status_activity' AND NOT tgisinternal) THEN
    CREATE TRIGGER trg_admin_tag_status_activity AFTER UPDATE ON public.smart_tags FOR EACH ROW EXECUTE FUNCTION public.admin_tag_status_activity();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.smart_tag_orders'::regclass AND tgname = 'trg_admin_order_activity' AND NOT tgisinternal) THEN
    CREATE TRIGGER trg_admin_order_activity AFTER INSERT ON public.smart_tag_orders FOR EACH ROW EXECUTE FUNCTION public.admin_order_activity();
  END IF;
END;
$$;

-- Backfill activity from real creation timestamps only. These inserts are
-- idempotent and do not fabricate events or alter source records.
INSERT INTO public.activity_events (event_type, actor_id, actor_name, entity_type, entity_id, summary, dedupe_key, created_at)
SELECT 'user_registered', u.id, p.full_name, 'profile', u.id::text,
       COALESCE(NULLIF(p.full_name, ''), 'A new user') || ' registered on Petziq',
       'profile:' || u.id::text, u.created_at
FROM auth.users AS u
LEFT JOIN public.profiles AS p ON p.id = u.id
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (event_type, actor_id, entity_type, entity_id, summary, metadata, dedupe_key, created_at)
SELECT 'pet_created', p.user_id, 'pet', p.id::text,
       'Pet "' || p.name || '" was added',
       jsonb_build_object('species', p.species, 'breed', p.breed),
       'pet:' || p.id::text, p.created_at
FROM public.pets AS p
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (event_type, actor_id, entity_type, entity_id, summary, metadata, dedupe_key, created_at)
SELECT 'plant_created', p.user_id, 'plant', p.id::text,
       'Plant "' || p.name || '" was added',
       jsonb_build_object('species', p.species),
       'plant:' || p.id::text, p.created_at
FROM public.user_plants AS p
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (event_type, actor_id, entity_type, entity_id, summary, metadata, dedupe_key, created_at)
SELECT 'reminder_created', r.user_id, 'reminder', r.id::text,
       'Reminder "' || r.title || '" was created',
       jsonb_build_object('type', r.type),
       'reminder:' || r.id::text, r.created_at
FROM public.reminders AS r
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (event_type, actor_id, entity_type, entity_id, summary, metadata, dedupe_key, created_at)
SELECT 'tag_created', COALESCE(t.user_id, t.owner_id), 'smart_tag', t.id::text,
       'Smart Tag ' || t.tag_id || ' was created',
       jsonb_build_object('tag_id', t.tag_id, 'tag_type', t.tag_type, 'status', t.status),
       'tag-created:' || t.id::text, t.created_at
FROM public.smart_tags AS t
ON CONFLICT (dedupe_key) DO NOTHING;

INSERT INTO public.activity_events (event_type, actor_id, actor_name, entity_type, entity_id, summary, metadata, dedupe_key, created_at)
SELECT 'order_created', o.user_id, o.customer_name, 'order', o.id::text,
       'Smart Tag order ' || o.order_number || ' was created',
       jsonb_build_object('quantity', o.quantity, 'amount', o.amount, 'payment_status', o.payment_status),
       'order:' || o.id::text, o.created_at
FROM public.smart_tag_orders AS o
ON CONFLICT (dedupe_key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN jsonb_build_object(
    'total_users', (SELECT count(*) FROM auth.users),
    'total_pets', (SELECT count(*) FROM public.pets),
    'total_plants', (SELECT count(*) FROM public.user_plants),
    'total_reminders', (SELECT count(*) FROM public.reminders),
    'total_tags', (SELECT count(*) FROM public.smart_tags),
    'active_tags', (SELECT count(*) FROM public.smart_tags WHERE status IN ('active', 'activated')),
    'draft_tags', (SELECT count(*) FROM public.smart_tags WHERE status = 'draft'),
    'total_orders', (SELECT count(*) FROM public.smart_tag_orders),
    'pending_orders', (SELECT count(*) FROM public.smart_tag_orders WHERE payment_status = 'pending'),
    'paid_orders', (SELECT count(*) FROM public.smart_tag_orders WHERE payment_status = 'paid'),
    'revenue', (SELECT COALESCE(sum(amount), 0) FROM public.smart_tag_orders WHERE payment_status = 'paid')
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_stats() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_activity(p_limit integer DEFAULT 25)
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
  SELECT e.id, e.event_type, e.actor_id, e.actor_name, e.entity_type,
         e.entity_id, e.summary, e.metadata, e.created_at
  FROM public.activity_events AS e
  ORDER BY e.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 25), 200));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_activity(integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_admin_activity(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_users(p_limit integer DEFAULT 100)
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
    COALESCE(p.full_name, u.raw_user_meta_data ->> 'full_name'),
    COALESCE(p.pet_name, u.raw_user_meta_data ->> 'pet_name'),
    p.role,
    u.created_at,
    (SELECT count(*) FROM public.pets AS pets WHERE pets.user_id = u.id),
    (SELECT count(*) FROM public.user_plants AS plants WHERE plants.user_id = u.id),
    (SELECT count(*) FROM public.smart_tags AS tags WHERE tags.user_id = u.id OR tags.owner_id = u.id)
  FROM auth.users AS u
  LEFT JOIN public.profiles AS p ON p.id = u.id
  ORDER BY u.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 100), 500));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_users(integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_admin_users(integer) TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END IF;
END;
$$;
