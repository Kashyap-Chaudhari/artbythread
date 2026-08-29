export type CreationCategory =
  | "handkerchiefs"
  | "thread-art"
  | "flowers"
  | "bouquets"
  | "charms"
  | "keychains"
  | "wearables"
  | "gifts"
  | "custom";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  order: number;
}

export interface ProductVariant {
  id?: string;
  name: string; // e.g. "6-inch Hoop", "Standard Posy"
  size?: string;
  price?: number | null;
}

export interface Product {
  id: string;
  sku?: string;
  slug: string;
  name: string;
  category: CreationCategory;
  category_id?: string;
  collection_id?: string;
  short_description: string;
  description: string;
  price?: number | null; // null means "Price on Request"
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_published: boolean;
  images: ProductImage[];
  variants?: ProductVariant[];
  materials: string[];
  dimensions?: string;
  making_time: string; // e.g. "3-5 business days"
  care_instructions: string;
  customization_options: string;
  shipping_info: string;
  story?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: CreationCategory;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  item_count?: number;
  order: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  product_ids: string[];
  is_featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  caption?: string;
  instagram_post_url?: string;
  attached_product_id?: string;
  likes_count?: number;
  created_at: string;
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "in_progress"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "NEW"
  | "REVIEWING"
  | "QUOTED"
  | "CUSTOMER_CONFIRMED"
  | "IN_PRODUCTION"
  | "READY_TO_DISPATCH"
  | "DISPATCHED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type PreferredContactChannel = "whatsapp" | "instagram" | "email" | "email_form";

export interface OrderEnquiry {
  id: string;
  order_id: string; // e.g. "AT7-1042" or "ART-2026-000001"
  product_id?: string;
  product_name: string;
  product_sku?: string;
  product_slug?: string;
  product_photo_url?: string;
  product_image_url?: string;
  quantity: number;
  size_variant?: string;
  customization_note?: string;
  customization_details?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  preferred_channel?: PreferredContactChannel;
  channel?: "whatsapp" | "instagram" | "email_form" | "email";
  delivery_city?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  additional_notes?: string;
  quoted_price?: number | null;
  status: OrderStatus;
  admin_notified_at?: string;
  customer_confirmed_at?: string;
  admin_notes?: string;
  crafting_timeline?: string;
  shipping_carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  created_at: string;
  updated_at?: string;
}

export type Order = OrderEnquiry;

export type CustomRequestStatus =
  | "NEW"
  | "REVIEWING"
  | "QUOTED"
  | "CUSTOMER_CONFIRMED"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "REJECTED";

export interface CustomRequest {
  id: string;
  request_id: string; // e.g. "CUST-2026-000001"
  full_name: string;
  phone: string;
  email: string;
  creation_type: string;
  description: string;
  reference_image_url?: string;
  approximate_size?: string;
  color_palette?: string[];
  quantity?: number;
  target_date?: string;
  budget_range?: string;
  delivery_address?: string;
  additional_notes?: string;
  status: CustomRequestStatus;
  quoted_price?: number | null;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_location?: string;
  rating: number;
  review: string;
  product_name?: string;
  photo_url?: string;
  is_approved: boolean;
  created_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_published: boolean;
}

export interface SiteSettings {
  brand_name: string;
  tagline_primary: string;
  tagline_secondary: string;
  whatsapp_number: string;
  whatsapp_default_message: string;
  instagram_url: string;
  instagram_username: string;
  email_contact: string;
  announcement_banner_text: string;
  announcement_banner_enabled: boolean;
  meta_title: string;
  meta_description: string;
  location_text: string;
  making_time_default: string;
  hero_headline_line1: string;
  hero_headline_line2: string;
  hero_subheading: string;
  updated_at: string;
}

export interface AnalyticsStats {
  whatsapp_clicks: number;
  instagram_clicks: number;
  email_clicks: number;
  custom_requests_count: number;
  total_product_views: number;
  total_site_visits: number;
}
