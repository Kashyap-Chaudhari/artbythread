-- ================================================================================
-- ARTBYTHREAD.7 STUDIO — DATABASE SCHEMA & RLS POLICIES
-- ================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================================
-- [CHANGED/ADDED] 0. ADMIN AUTHORIZATION SYSTEM
-- ================================================================================

-- Table to store authorized admin UUIDs from Supabase Auth
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current requester is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically promote the owner email on sign-up
CREATE OR REPLACE FUNCTION auto_make_admin()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  IF NEW.email = 'kashyapchaudhari299@gmail.com' THEN
    INSERT INTO public.admin_users (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auto_make_admin();


-- ================================================================================
-- 1. CATEGORIES TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  tagline TEXT,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 2. PRODUCTS TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) UNIQUE,
  slug VARCHAR(150) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_slug VARCHAR(100) NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  price DECIMAL(10, 2), -- NULL means "Price on Request"
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT TRUE,
  materials TEXT[] DEFAULT '{}',
  dimensions VARCHAR(100),
  variants JSONB DEFAULT '[]'::jsonb, -- e.g. [{"size": "6-inch", "price": 1500}, ...]
  making_time VARCHAR(100) DEFAULT '3-5 business days',
  care_instructions TEXT,
  customization_options TEXT,
  shipping_info TEXT,
  story TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 3. PRODUCT IMAGES TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 4. INVENTORY TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  stock_quantity INT DEFAULT 1,
  allow_backorder BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 5. CUSTOMERS TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  whatsapp_number VARCHAR(30),
  email VARCHAR(150),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 6. ORDERS TABLE
-- Supports omnichannel orders (WhatsApp, Instagram, Email) with public order tracking & rich link previews
-- Status naming supports BOTH lowercase (dashboard pipeline) and uppercase (custom requests workflow)
-- ================================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL, -- Format: AT7-1042 or ART-2026-000001
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

-- ================================================================================
-- 7. ORDER ITEMS TABLE (For multi-item expansion readiness)
-- ================================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  size_variant VARCHAR(100),
  unit_price DECIMAL(10, 2),
  customization_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 8. CUSTOM REQUESTS TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS custom_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. CUST-2026-000001
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150) NOT NULL,
  creation_type VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  reference_image_url TEXT,
  approximate_size VARCHAR(100),
  color_palette TEXT[] DEFAULT '{}',
  quantity INT DEFAULT 1,
  target_date DATE,
  budget_range VARCHAR(100),
  delivery_address TEXT,
  additional_notes TEXT,
  status VARCHAR(40) DEFAULT 'NEW' CHECK (
    status IN ('NEW', 'REVIEWING', 'QUOTED', 'CUSTOMER_CONFIRMED', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED')
  ),
  quoted_price DECIMAL(10, 2),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 9. CUSTOM REQUEST IMAGES TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS custom_request_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_request_id UUID REFERENCES custom_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 10. ORDER STATUS HISTORY TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  previous_status VARCHAR(40),
  new_status VARCHAR(40) NOT NULL,
  changed_by VARCHAR(100) DEFAULT 'admin',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 11. NOTIFICATIONS TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'order_enquiry',
  reference_id VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- 12. REVIEWS TABLE
-- ================================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(150) NOT NULL,
  location VARCHAR(100),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  photo_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================================
-- INDEXES FOR SPEED AND OPTIMIZATION
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_requests(status);


-- ================================================================================
-- [CHANGED/ADDED] AUTOMATIC TIMESTAMP UPDATE TRIGGERS
-- ================================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_updated_at_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_inventory BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_custom_requests BEFORE UPDATE ON custom_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ================================================================================
-- [CHANGED/ADDED] ROW LEVEL SECURITY (RLS) ACTIVATION
-- Explicitly enable RLS on every single table in the schema
-- ================================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_request_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;


-- ================================================================================
-- [CHANGED/ADDED] RLS POLICIES DESIGN
-- Public (anonymous) clients can only perform selected operations.
-- Admins check is_admin() for authentication authorization (no basic 'authenticated' access).
-- ================================================================================

-- 1. admin_users policies
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users" ON admin_users FOR SELECT TO authenticated USING (auth.uid() = id);

-- 2. categories policies
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin Full Access Categories" ON categories;
CREATE POLICY "Admin Full Access Categories" ON categories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 3. products policies
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "Admin Full Access Products" ON products;
CREATE POLICY "Admin Full Access Products" ON products FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4. product_images policies
DROP POLICY IF EXISTS "Public Read Product Images" ON product_images;
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin Full Access Product Images" ON product_images;
CREATE POLICY "Admin Full Access Product Images" ON product_images FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 5. inventory policies (No public access allowed)
DROP POLICY IF EXISTS "Admin Full Access Inventory" ON inventory;
CREATE POLICY "Admin Full Access Inventory" ON inventory FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 6. customers policies (No public access allowed)
DROP POLICY IF EXISTS "Admin Full Access Customers" ON customers;
CREATE POLICY "Admin Full Access Customers" ON customers FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 7. orders policies (Public can insert only, no public select/read allowed)
DROP POLICY IF EXISTS "Public Insert Orders" ON orders;
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Orders" ON orders;
CREATE POLICY "Admin Full Access Orders" ON orders FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 8. order_items policies (Public can insert only)
DROP POLICY IF EXISTS "Public Insert Order Items" ON order_items;
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Order Items" ON order_items;
CREATE POLICY "Admin Full Access Order Items" ON order_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 9. custom_requests policies (Public can insert only)
DROP POLICY IF EXISTS "Public Insert Custom Requests" ON custom_requests;
CREATE POLICY "Public Insert Custom Requests" ON custom_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Custom Requests" ON custom_requests;
CREATE POLICY "Admin Full Access Custom Requests" ON custom_requests FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 10. custom_request_images policies (Public can insert only)
DROP POLICY IF EXISTS "Public Insert Custom Request Images" ON custom_request_images;
CREATE POLICY "Public Insert Custom Request Images" ON custom_request_images FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Custom Request Images" ON custom_request_images;
CREATE POLICY "Admin Full Access Custom Request Images" ON custom_request_images FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 11. order_status_history policies (No public access)
DROP POLICY IF EXISTS "Admin Full Access Order Status History" ON order_status_history;
CREATE POLICY "Admin Full Access Order Status History" ON order_status_history FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 12. notifications policies (Public can insert only)
DROP POLICY IF EXISTS "Public Insert Notifications" ON notifications;
CREATE POLICY "Public Insert Notifications" ON notifications FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Notifications" ON notifications;
CREATE POLICY "Admin Full Access Notifications" ON notifications FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 13. reviews policies (Public select for approved only, public insert allowed)
DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT TO anon, authenticated USING (is_approved = true);

DROP POLICY IF EXISTS "Public Insert Reviews" ON reviews;
CREATE POLICY "Public Insert Reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Full Access Reviews" ON reviews;
CREATE POLICY "Admin Full Access Reviews" ON reviews FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ================================================================================
-- [CHANGED/ADDED] 14. REALTIME PUBLICATION SETUP
-- Enable Supabase Realtime WebSocket streaming for instant live dashboard sync
-- ================================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE custom_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE products;


