import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order, OrderStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) return "Price on Request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(isoString?: string): string {
  if (!isoString) return "Recent";
  try {
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function generateCustomerWhatsAppUpdate(order: Order, nextStatus: OrderStatus): string {
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
  const trackingLink = `${storeUrl}/order/${order.order_id}`;

  let statusText = "Enquiry In Review";
  let messageBody = "We have received your order enquiry and are reviewing the crafting queue.";

  if (nextStatus === "confirmed") {
    statusText = "Order Confirmed";
    messageBody = "Your handmade order design and crafting slot have been confirmed!";
  } else if (nextStatus === "in_progress") {
    statusText = "In Production (Thread Work)";
    messageBody = "Our artisan has begun handcrafting your piece slowly and attentively!";
  } else if (nextStatus === "shipped") {
    statusText = "Dispatched / Courier";
    messageBody = `Your package has been securely packed and handed over to ${order.shipping_carrier || "the courier"} (Tracking ID: ${order.tracking_number || "Provided in Link"}).`;
  } else if (nextStatus === "delivered") {
    statusText = "Delivered";
    messageBody = "Your handmade creation has been delivered! We hope it brings a smile to your heart.";
  }

  return (
    `*ARTBYTHREAD.7 — ORDER UPDATE*\n\n` +
    `Hi ${order.customer_name}! 🌸\n\n` +
    `• *Order ID:* ${order.order_id}\n` +
    `• *Product:* ${order.product_name} (Qty: ${order.quantity})\n` +
    `• *New Status:* *${statusText}*\n\n` +
    `${messageBody}\n\n` +
    `• *Live Tracking Card:* ${trackingLink}\n\n` +
    `Thank you for supporting handmade art!\nArtByThread.7 Studio`
  );
}

export function generateWhatsAppUrl(phone?: string, text?: string): string {
  const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  const basePhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(text || "");
  return `https://wa.me/${basePhone}?text=${encodedText}`;
}
