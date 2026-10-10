/*
# Create Smart Tags, Orders, and Order Items tables

1. New Tables
   - `smart_tag_orders`: Customer orders for Smart Tags
   - `smart_tags`: Physical Petziq Smart Tags with unique Tag IDs and QR codes
   - `smart_tag_order_items`: Links order → specific tags

2. Security — RLS
   - smart_tags: public SELECT (QR scanning works without login); mutations via functions only
   - smart_tag_orders: owner-scoped SELECT/INSERT; mutations via functions only
   - smart_tag_order_items: owner-scoped SELECT; mutations via functions only

3. Sequences
   - smart_tag_id_seq: generates PZ-XXXXXX IDs
   - smart_tag_order_num_seq: generates PZO-XXXXXX order numbers
*/

-- ============================================================================
-- SMART TAG ORDERS (created first because smart_tags references it)
-- ============================================================================
CREATE TABLE IF NOT EXISTS smart_tag_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
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
  quantity int NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 100),
  amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')
  ),
  payment_ref text,
  shipping_status text NOT NULL DEFAULT 'pending' CHECK (
    shipping_status IN ('pending', 'processing', 'packed', 'shipped', 'in_transit', 'delivered', 'cancelled')
  ),
  courier text,
  tracking_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON smart_tag_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON smart_tag_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_shipping ON smart_tag_orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON smart_tag_orders(created_at DESC);

ALTER TABLE smart_tag_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON smart_tag_orders;
CREATE POLICY "select_own_orders"
ON smart_tag_orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON smart_tag_orders;
CREATE POLICY "insert_own_orders"
ON smart_tag_orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SMART TAGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS smart_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (
    status IN ('available', 'reserved', 'sold', 'shipped', 'activated', 'disabled', 'lost', 'retired')
  ),
  pet_id uuid REFERENCES pets(id) ON DELETE SET NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id uuid REFERENCES smart_tag_orders(id) ON DELETE SET NULL,
  qr_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_smart_tags_status ON smart_tags(status);
CREATE INDEX IF NOT EXISTS idx_smart_tags_owner ON smart_tags(owner_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_pet ON smart_tags(pet_id);
CREATE INDEX IF NOT EXISTS idx_smart_tags_order ON smart_tags(order_id);

ALTER TABLE smart_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_smart_tags" ON smart_tags;
CREATE POLICY "public_select_smart_tags"
ON smart_tags FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================================
-- SMART TAG ORDER ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS smart_tag_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES smart_tag_orders(id) ON DELETE CASCADE,
  tag_id text NOT NULL REFERENCES smart_tags(tag_id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON smart_tag_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_tag ON smart_tag_order_items(tag_id);

ALTER TABLE smart_tag_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON smart_tag_order_items;
CREATE POLICY "select_own_order_items"
ON smart_tag_order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM smart_tag_orders
    WHERE smart_tag_orders.id = smart_tag_order_items.order_id
    AND smart_tag_orders.user_id = auth.uid()
  )
);

-- ============================================================================
-- SEQUENCES for tag IDs and order numbers
-- ============================================================================
CREATE SEQUENCE IF NOT EXISTS smart_tag_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS smart_tag_order_num_seq START 1;
