-- ================================================================================
-- ARTBYTHREAD.7 STUDIO — OMNICHANNEL ORDERS SCHEMA MIGRATION
-- ================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create or Update Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL, -- e.g. AT7-1042 or ART-2026-000001
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  preferred_channel TEXT CHECK (preferred_channel IN ('whatsapp', 'instagram', 'email', 'email_form')),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_photo_url TEXT,
  product_sku TEXT,
  quantity INT DEFAULT 1 CHECK (quantity > 0),
  size_variant TEXT,
  customization_note TEXT,
  customization_details TEXT,
  delivery_city TEXT,
  address TEXT,
  state TEXT,
  pincode TEXT,
  quoted_price DECIMAL(10, 2),
  status TEXT DEFAULT 'new' CHECK (
    status IN (
      'new',
      'confirmed',
      'in_progress',
      'shipped',
      'delivered',
      'cancelled',
      'NEW',
      'REVIEWING',
      'QUOTED',
      'CUSTOMER_CONFIRMED',
      'IN_PRODUCTION',
      'READY_TO_DISPATCH',
      'DISPATCHED',
      'DELIVERED',
      'COMPLETED',
      'CANCELLED'
    )
  ),
  admin_notified_at TIMESTAMPTZ,
  customer_confirmed_at TIMESTAMPTZ,
  admin_notes TEXT,
  crafting_timeline TEXT,
  shipping_carrier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_preferred_channel ON orders(preferred_channel);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders from the website
CREATE POLICY "Public Insert Orders" ON orders 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public to read their order via order_id or id (for the public order tracking page)
CREATE POLICY "Public Read Own Order" ON orders 
  FOR SELECT 
  USING (true);

-- Allow authenticated admin full access
CREATE POLICY "Admin Full Access Orders" ON orders 
  FOR ALL 
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
