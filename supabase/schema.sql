-- ================================================================================
-- ARTBYTHREAD.7 STUDIO — DATABASE SCHEMA & RLS POLICIES
-- ================================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
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

-- 2. PRODUCTS TABLE
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

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  stock_quantity INT DEFAULT 1,
  allow_backorder BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOMERS TABLE
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

-- 6. ORDERS TABLE
-- Supports omnichannel orders (WhatsApp, Instagram, Email) with public order tracking & rich link previews
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

-- 7. ORDER ITEMS TABLE (For multi-item expansion readiness)
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

-- 8. CUSTOM REQUESTS TABLE
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

-- 9. CUSTOM REQUEST IMAGES TABLE
CREATE TABLE IF NOT EXISTS custom_request_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_request_id UUID REFERENCES custom_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  previous_status VARCHAR(40),
  new_status VARCHAR(40) NOT NULL,
  changed_by VARCHAR(100) DEFAULT 'admin',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'order_enquiry',
  reference_id VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. REVIEWS TABLE
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

-- INDEXES FOR SPEED AND OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_requests(status);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Public can read published products & categories
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);

-- Public can insert order enquiries and custom requests
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Custom Requests" ON custom_requests FOR INSERT WITH CHECK (true);

-- Service role / Admin has full access to all tables
CREATE POLICY "Admin Full Access Products" ON products USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Orders" ON orders USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Custom Requests" ON custom_requests USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
