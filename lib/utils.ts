import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) return "Price on Enquiry";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function generateWhatsAppMessage(options: {
  productName: string;
  quantity: number;
  sizeOrVariant?: string;
  price?: number | null;
  customization?: string;
  productUrl?: string;
  imageUrl?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryCity?: string;
}): string {
  const {
    productName,
    quantity,
    sizeOrVariant = "Standard Size",
    price,
    customization,
    productUrl,
    imageUrl,
    customerName,
    customerPhone,
    deliveryCity,
  } = options;

  let msg = `*ARTBYTHREAD.7 — ORDER ENQUIRY*\n\n`;
  msg += `Hi ArtByThread.7! I saw this creation on your website and would love to order it:\n\n`;
  msg += `• *Product:* ${productName}\n`;
  msg += `• *Quantity:* ${quantity}\n`;
  msg += `• *Size / Variant:* ${sizeOrVariant}\n`;
  if (price) {
    msg += `• *Listed Price:* ₹${price}\n`;
  }
  if (customization) {
    msg += `• *Customization:* ${customization}\n`;
  }
  
  if (customerName) {
    msg += `• *Customer Name:* ${customerName}\n`;
  }
  if (customerPhone) {
    msg += `• *Phone:* ${customerPhone}\n`;
  }
  if (deliveryCity) {
    msg += `• *Delivery City:* ${deliveryCity}\n`;
  }

  msg += `\nCould you please share availability, crafting time, payment link, and delivery details?\n`;

  if (productUrl) {
    msg += `\n• *Product Link:* ${productUrl}`;
  }

  if (imageUrl) {
    msg += `\n• *Photo:* ${imageUrl}`;
  }

  return msg;
}

export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  // Using standard encodeURIComponent handles UTF-8 characters and line breaks safely
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
}

export function generateOrderId(): string {
  // Generates short, clean, human-friendly order codes like AT7-4821
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `AT7-${randomDigits}`;
}

export function generateWhatsAppOrderConfirmationMessage(options: {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  productName: string;
  quantity: number;
  sizeOrVariant?: string;
  customizationNote?: string;
  deliveryCity?: string;
  productPhotoUrl?: string;
  trackingUrl: string;
}): string {
  const {
    orderId,
    customerName,
    customerPhone,
    customerEmail,
    productName,
    quantity,
    sizeOrVariant,
    customizationNote,
    deliveryCity,
    productPhotoUrl,
    trackingUrl,
  } = options;

  let msg = `*ARTBYTHREAD.7 — ORDER CONFIRMATION*\n\n`;
  msg += `Hi ArtByThread.7 Studio! I just submitted an order on your website:\n\n`;
  msg += `• *Order ID:* ${orderId}\n`;
  msg += `• *Customer Name:* ${customerName}\n`;
  if (customerPhone) {
    msg += `• *Phone / WhatsApp:* ${customerPhone}\n`;
  }
  if (customerEmail) {
    msg += `• *Email:* ${customerEmail}\n`;
  }
  msg += `• *Product:* ${productName} (Qty: ${quantity})\n`;
  if (sizeOrVariant && sizeOrVariant !== "Standard Size") {
    msg += `• *Size / Variant:* ${sizeOrVariant}\n`;
  }
  if (customizationNote) {
    msg += `• *Customization:* ${customizationNote}\n`;
  }
  if (deliveryCity) {
    msg += `• *Delivery City:* ${deliveryCity}\n`;
  }
  if (productPhotoUrl) {
    msg += `• *Photo:* ${productPhotoUrl}\n`;
  }
  msg += `\n• *View Order Card & Live Tracking:* ${trackingUrl}\n\n`;
  msg += `Could you please confirm the crafting timeline, final details, and manual payment?\nThank you!`;

  return msg;
}

export function generateInstagramOrderDMText(options: {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  productName: string;
  quantity: number;
  customizationNote?: string;
  deliveryCity?: string;
  trackingUrl: string;
}): string {
  const { orderId, customerName, customerPhone, productName, quantity, customizationNote, deliveryCity, trackingUrl } = options;
  let text = `Hi ArtByThread.7! I placed an order on your website: ${productName} (Qty: ${quantity}) [Order #${orderId}] by ${customerName}`;
  if (customerPhone) {
    text += ` (Phone: ${customerPhone})`;
  }
  if (customizationNote) {
    text += `. Custom: "${customizationNote}"`;
  }
  if (deliveryCity) {
    text += `. City: ${deliveryCity}`;
  }
  text += `. Order Link: ${trackingUrl}`;
  return text;
}

export function generateInstagramUrl(username: string): string {
  const cleanUsername = username.replace("@", "").trim();
  return `https://instagram.com/${cleanUsername}`;
}

export function generateInstagramCopyText(options: {
  productName: string;
  quantity: number;
  sizeOrVariant?: string;
  productUrl?: string;
  imageUrl?: string;
}): string {
  const { productName, quantity, sizeOrVariant = "Standard Size", productUrl, imageUrl } = options;
  let text = `Hi ArtByThread.7! I'm interested in ordering "${productName}" (Qty: ${quantity}, Size/Variant: ${sizeOrVariant}). Please share pricing and availability details!`;
  if (productUrl) {
    text += ` Link: ${productUrl}`;
  }
  if (imageUrl) {
    text += ` Photo: ${imageUrl}`;
  }
  return text;
}

export function generateEmailUrl(email: string, subject: string, body: string): string {
  const encodedSub = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSub}&body=${encodedBody}`;
}

