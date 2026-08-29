export type OrderStatus =
  | "new"
  | "confirmed"
  | "in_progress"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  order_id: string;
  created_at: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  preferred_channel?: "whatsapp" | "instagram" | "email" | "email_form";
  product_id?: string;
  product_name: string;
  product_photo_url?: string;
  product_sku?: string;
  quantity: number;
  size_variant?: string;
  customization_note?: string;
  delivery_city?: string;
  address?: string;
  state?: string;
  pincode?: string;
  quoted_price?: number | null;
  status: OrderStatus;
  admin_notified_at?: string | null;
  customer_confirmed_at?: string | null;
  admin_notes?: string;
  crafting_timeline?: string;
  shipping_carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  sku?: string;
  slug: string;
  name: string;
  category_slug: string;
  short_description?: string;
  description: string;
  price?: number | null;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_published: boolean;
  materials?: string[];
  dimensions?: string;
  making_time?: string;
  image_url: string;
  images?: string[];
  created_at: string;
}

export interface CustomRequest {
  id: string;
  request_id: string;
  full_name: string;
  phone: string;
  email: string;
  creation_type: string;
  description: string;
  reference_image_url?: string;
  approximate_size?: string;
  color_palette?: string[];
  quantity: number;
  target_date?: string;
  delivery_address?: string;
  additional_notes?: string;
  status: "NEW" | "REVIEWING" | "QUOTED" | "IN_PRODUCTION" | "COMPLETED" | "REJECTED";
  quoted_price?: number | null;
  admin_notes?: string;
  created_at: string;
}
