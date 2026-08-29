import { z } from "zod";

export const PreferredChannelSchema = z.enum(["whatsapp", "instagram", "email"], {
  message: "Please select a valid contact channel (WhatsApp, Instagram, or Email).",
});

export type PreferredChannel = z.infer<typeof PreferredChannelSchema>;

export const OrderFormSchema = z.object({
  // Customer Details
  customer_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (minimum 2 characters).")
    .max(100, "Name is too long."),
  customer_phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number (minimum 7 digits).")
    .max(25, "Phone number is too long.")
    .regex(/^[+0-9\s\-()]+$/, "Please enter a valid phone number with digits."),
  customer_email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(150, "Email is too long."),
  preferred_channel: PreferredChannelSchema,
  
  // Order Specifics
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(50, "For bulk orders of more than 50 items, please message us directly."),
  customization_note: z
    .string()
    .trim()
    .max(500, "Customization notes cannot exceed 500 characters.")
    .optional()
    .or(z.literal("")),
  delivery_city: z
    .string()
    .trim()
    .min(2, "Please provide your delivery city (e.g. Mumbai, Bangalore, Delhi).")
    .max(100, "City name is too long."),

  // Product References (Auto-filled)
  product_id: z.string().optional().or(z.literal("")),
  product_name: z.string().min(1, "Product name is required."),
  product_photo_url: z.string().optional().or(z.literal("")),
  product_sku: z.string().optional().or(z.literal("")),
  product_price: z.number().nullable().optional(),
  size_variant: z.string().optional().or(z.literal("")),
  
  // Optional Detailed Address
  address: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),

  // Honeypot anti-spam
  hp_field: z.string().optional().or(z.literal("")),
});

export type OrderFormValues = z.infer<typeof OrderFormSchema>;

export const OrderStatusSchema = z.enum([
  "new",
  "confirmed",
  "in_progress",
  "shipped",
  "delivered",
  "cancelled",
]);

export type OrderStatusType = z.infer<typeof OrderStatusSchema>;
