/*
# Create admin and tag management functions (SECURITY DEFINER)

1. Functions
   - is_admin(): checks if auth.uid() has role='admin'
   - generate_smart_tags(p_count int): creates N tags with unique PZ-XXXXXX IDs (admin only)
   - activate_smart_tag(p_tag_id text, p_pet_id uuid): user activates a tag to their pet
   - deactivate_smart_tag(p_tag_id text): admin disables a tag
   - update_tag_status(p_tag_id text, p_status text): admin changes tag status
   - create_smart_tag_order(...): user creates a Smart Tag order
   - update_order_status(...): admin updates order
   - assign_tags_to_order(...): admin assigns tags to an order
   - get_admin_stats(): returns aggregate counts for admin dashboard
   - get_public_tag_info(p_tag_id text): public — returns safe info for QR scanning

2. Security
   - All functions SECURITY DEFINER, SET search_path = public
   - Admin functions check is_admin() before any action
   - activate_smart_tag prevents unauthorized reassignment
   - EXECUTE revoked from anon; granted to authenticated (except get_public_tag_info)
*/

-- ============================================================================
-- Helper: is_admin
-- ============================================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ============================================================================
-- Generate Smart Tags (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_smart_tags(p_count int)
RETURNS TABLE (tag_id text, qr_url text)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_seq bigint;
  v_tag_id text;
  v_qr_url text;
  i int;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_count IS NULL OR p_count < 1 OR p_count > 1000 THEN
    RAISE EXCEPTION 'Invalid count: must be between 1 and 1000';
  END IF;

  FOR i IN 1..p_count LOOP
    v_seq := nextval('smart_tag_id_seq');
    v_tag_id := 'PZ-' || lpad(v_seq::text, 6, '0');
    v_qr_url := 'https://petziqq.com/tag/' || v_tag_id;

    INSERT INTO smart_tags (tag_id, status, qr_url)
    VALUES (v_tag_id, 'available', v_qr_url);

    tag_id := v_tag_id;
    qr_url := v_qr_url;
    RETURN NEXT;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION generate_smart_tags(int) FROM anon;
GRANT EXECUTE ON FUNCTION generate_smart_tags(int) TO authenticated;

-- ============================================================================
-- Activate Smart Tag (user activates tag to their pet)
-- ============================================================================
CREATE OR REPLACE FUNCTION activate_smart_tag(p_tag_id text, p_pet_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_tag record;
  v_pet record;
BEGIN
  SELECT * INTO v_tag FROM smart_tags WHERE tag_id = p_tag_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tag not found';
  END IF;

  IF v_tag.status IN ('disabled', 'lost', 'retired') THEN
    RAISE EXCEPTION 'This tag is no longer available';
  END IF;

  IF v_tag.status = 'activated' AND v_tag.owner_id IS NOT NULL AND v_tag.owner_id != auth.uid() THEN
    RAISE EXCEPTION 'This tag is already activated by another owner';
  END IF;

  SELECT * INTO v_pet FROM pets WHERE id = p_pet_id AND user_id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pet not found or does not belong to you';
  END IF;

  UPDATE smart_tags
  SET
    status = 'activated',
    pet_id = p_pet_id,
    owner_id = auth.uid(),
    activated_at = now(),
    updated_at = now()
  WHERE tag_id = p_tag_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION activate_smart_tag(text, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION activate_smart_tag(text, uuid) TO authenticated;

-- ============================================================================
-- Deactivate Smart Tag (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION deactivate_smart_tag(p_tag_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE smart_tags SET status = 'disabled', updated_at = now()
  WHERE tag_id = p_tag_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION deactivate_smart_tag(text) FROM anon;
GRANT EXECUTE ON FUNCTION deactivate_smart_tag(text) TO authenticated;

-- ============================================================================
-- Update Tag Status (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_tag_status(p_tag_id text, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_status NOT IN ('available', 'reserved', 'sold', 'shipped', 'activated', 'disabled', 'lost', 'retired') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE smart_tags SET status = p_status, updated_at = now()
  WHERE tag_id = p_tag_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION update_tag_status(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION update_tag_status(text, text) TO authenticated;

-- ============================================================================
-- Create Order (user creates a Smart Tag order)
-- ============================================================================
CREATE OR REPLACE FUNCTION create_smart_tag_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_shipping_name text,
  p_address text,
  p_city text,
  p_state text,
  p_postal_code text,
  p_country text,
  p_quantity int,
  p_amount numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_order_num text;
  v_seq bigint;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 OR p_quantity > 100 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  v_seq := nextval('smart_tag_order_num_seq');
  v_order_num := 'PZO-' || lpad(v_seq::text, 6, '0');

  INSERT INTO smart_tag_orders (
    user_id, order_number, customer_name, phone, email,
    shipping_name, address, city, state, postal_code, country,
    quantity, amount, payment_status, shipping_status
  ) VALUES (
    auth.uid(), v_order_num, p_customer_name, p_phone, p_email,
    p_shipping_name, p_address, p_city, p_state, p_postal_code, p_country,
    p_quantity, p_amount, 'pending', 'pending'
  )
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION create_smart_tag_order(text, text, text, text, text, text, text, text, text, int, numeric) FROM anon;
GRANT EXECUTE ON FUNCTION create_smart_tag_order(text, text, text, text, text, text, text, text, text, int, numeric) TO authenticated;

-- ============================================================================
-- Update Order Status (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id uuid,
  p_payment_status text DEFAULT NULL,
  p_shipping_status text DEFAULT NULL,
  p_courier text DEFAULT NULL,
  p_tracking_number text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_payment_status IS NOT NULL AND p_payment_status NOT IN ('pending', 'processing', 'paid', 'failed', 'refunded') THEN
    RAISE EXCEPTION 'Invalid payment status';
  END IF;

  IF p_shipping_status IS NOT NULL AND p_shipping_status NOT IN ('pending', 'processing', 'packed', 'shipped', 'in_transit', 'delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid shipping status';
  END IF;

  UPDATE smart_tag_orders
  SET
    payment_status = COALESCE(p_payment_status, payment_status),
    shipping_status = COALESCE(p_shipping_status, shipping_status),
    courier = COALESCE(p_courier, courier),
    tracking_number = COALESCE(p_tracking_number, tracking_number),
    updated_at = now()
  WHERE id = p_order_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION update_order_status(uuid, text, text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION update_order_status(uuid, text, text, text, text) TO authenticated;

-- ============================================================================
-- Assign Tags to Order (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION assign_tags_to_order(
  p_order_id uuid,
  p_tag_ids text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_tag text;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  FOREACH v_tag IN ARRAY p_tag_ids LOOP
    UPDATE smart_tags
    SET status = 'sold', order_id = p_order_id, updated_at = now()
    WHERE tag_id = v_tag AND status = 'available';

    INSERT INTO smart_tag_order_items (order_id, tag_id)
    VALUES (p_order_id, v_tag)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION assign_tags_to_order(uuid, text[]) FROM anon;
GRANT EXECUTE ON FUNCTION assign_tags_to_order(uuid, text[]) TO authenticated;

-- ============================================================================
-- Get Admin Stats (admin only)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT jsonb_build_object(
    'total_customers', (SELECT count(*) FROM profiles),
    'total_pets', (SELECT count(*) FROM pets),
    'total_plants', (SELECT count(*) FROM user_plants),
    'total_orders', (SELECT count(*) FROM smart_tag_orders),
    'pending_orders', (SELECT count(*) FROM smart_tag_orders WHERE payment_status = 'pending'),
    'paid_orders', (SELECT count(*) FROM smart_tag_orders WHERE payment_status = 'paid'),
    'total_smart_tags', (SELECT count(*) FROM smart_tags),
    'activated_tags', (SELECT count(*) FROM smart_tags WHERE status = 'activated'),
    'available_tags', (SELECT count(*) FROM smart_tags WHERE status = 'available'),
    'sold_tags', (SELECT count(*) FROM smart_tags WHERE status = 'sold'),
    'revenue', (SELECT COALESCE(sum(amount), 0) FROM smart_tag_orders WHERE payment_status = 'paid')
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_admin_stats() FROM anon;
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;

-- ============================================================================
-- Get Public Tag Info (public — no auth required)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_public_tag_info(p_tag_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_tag record;
  v_pet record;
  v_result jsonb;
BEGIN
  SELECT * INTO v_tag FROM smart_tags WHERE tag_id = p_tag_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  IF v_tag.status != 'activated' OR v_tag.pet_id IS NULL THEN
    RETURN jsonb_build_object('found', true, 'activated', false, 'tag_id', p_tag_id);
  END IF;

  SELECT name, species, breed, photo_url INTO v_pet
  FROM pets WHERE id = v_tag.pet_id;

  v_result := jsonb_build_object(
    'found', true,
    'activated', true,
    'tag_id', p_tag_id,
    'pet_name', v_pet.name,
    'species', v_pet.species,
    'breed', v_pet.breed,
    'photo_url', v_pet.photo_url
  );

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_public_tag_info(text) FROM anon;
GRANT EXECUTE ON FUNCTION get_public_tag_info(text) TO anon, authenticated;
