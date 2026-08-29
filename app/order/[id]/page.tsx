"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";
import {
  Sparkles,
  MessageCircle,
  Mail,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Palette,
  Package,
  ArrowLeft,
  Phone,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Footer } from "@/components/layout/Footer";

interface OrderData {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  preferred_channel?: string;
  product_name: string;
  product_photo_url?: string;
  quantity: number;
  size_variant?: string;
  customization_note?: string;
  delivery_city?: string;
  status: string;
  quoted_price?: number | null;
  admin_notes?: string;
  shipping_carrier?: string;
  tracking_number?: string;
  created_at: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const orderId = decodeURIComponent(rawId || "").trim();

  const { settings } = useStore();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!orderId) return;

    let matchedOrder: OrderData | null = null;

    // 1. First priority: Check local storage on customer's device for exact matching order
    try {
      const saved = localStorage.getItem("artbythread_customer_orders");
      if (saved) {
        const ordersList = JSON.parse(saved);
        if (Array.isArray(ordersList)) {
          const found = ordersList.find(
            (o: any) =>
              (o.order_id && o.order_id.toUpperCase() === orderId.toUpperCase()) ||
              (o.id && o.id.toUpperCase() === orderId.toUpperCase())
          );
          if (found) {
            matchedOrder = {
              id: found.order_id,
              order_id: found.order_id,
              customer_name: found.customer_name || "Valued Customer",
              customer_phone: found.customer_phone || "",
              customer_email: found.customer_email || "",
              preferred_channel: found.preferred_channel || "whatsapp",
              product_name: found.product_name || "Handcrafted Creation",
              product_photo_url: found.product_photo_url || "/products/handkerchief-iloveu-embroidery.jpg",
              quantity: found.quantity || 1,
              size_variant: found.size_variant || "Standard Size",
              customization_note: found.customization_note || "",
              delivery_city: found.delivery_city || "India",
              status: found.status || "new",
              quoted_price: found.product_price || null,
              created_at: found.created_at || new Date().toISOString(),
            };
          }
        }
      }
    } catch (e) {
      console.warn("[LOCAL STORAGE ORDER LOOKUP FAILED]", e);
    }

    // 2. Second priority: Query server API / Supabase
    fetch(`/api/orders?id=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders && data.orders.length > 0) {
          const dbOrder = data.orders[0];
          setOrder({
            id: dbOrder.order_id || orderId,
            order_id: dbOrder.order_id || orderId,
            customer_name: dbOrder.customer_name || matchedOrder?.customer_name || "Valued Customer",
            customer_phone: dbOrder.customer_phone || matchedOrder?.customer_phone || "",
            customer_email: dbOrder.customer_email || matchedOrder?.customer_email || "",
            preferred_channel: dbOrder.preferred_channel || matchedOrder?.preferred_channel || "whatsapp",
            product_name: dbOrder.product_name || matchedOrder?.product_name || "Handcrafted Creation",
            product_photo_url: dbOrder.product_photo_url || matchedOrder?.product_photo_url || "/products/handkerchief-iloveu-embroidery.jpg",
            quantity: dbOrder.quantity || matchedOrder?.quantity || 1,
            size_variant: dbOrder.size_variant || matchedOrder?.size_variant || "Standard Size",
            customization_note: dbOrder.customization_note || matchedOrder?.customization_note || "",
            delivery_city: dbOrder.delivery_city || matchedOrder?.delivery_city || "India",
            status: dbOrder.status || matchedOrder?.status || "new",
            quoted_price: dbOrder.product_price || matchedOrder?.quoted_price || null,
            admin_notes: dbOrder.admin_notes || "",
            shipping_carrier: dbOrder.shipping_carrier || "",
            tracking_number: dbOrder.tracking_number || "",
            created_at: dbOrder.created_at || matchedOrder?.created_at || new Date().toISOString(),
          });
        } else if (matchedOrder) {
          setOrder(matchedOrder);
        } else {
          // If viewing an order from another device where Supabase is not connected
          setOrder({
            id: orderId,
            order_id: orderId,
            customer_name: "Customer Order",
            customer_phone: "",
            customer_email: "",
            preferred_channel: "whatsapp",
            product_name: "Handcrafted Thread Creation",
            product_photo_url: "/products/handkerchief-iloveu-embroidery.jpg",
            quantity: 1,
            size_variant: "Standard Size",
            customization_note: "Custom initials / bespoke handmade design",
            delivery_city: "India",
            status: "new",
            quoted_price: null,
            created_at: new Date().toISOString(),
          });
        }
      })
      .catch(() => {
        if (matchedOrder) {
          setOrder(matchedOrder);
        } else {
          setOrder({
            id: orderId,
            order_id: orderId,
            customer_name: "Customer Order",
            customer_phone: "",
            customer_email: "",
            preferred_channel: "whatsapp",
            product_name: "Handcrafted Thread Creation",
            product_photo_url: "/products/handkerchief-iloveu-embroidery.jpg",
            quantity: 1,
            size_variant: "Standard Size",
            customization_note: "Custom initials / bespoke handmade design",
            delivery_city: "India",
            status: "new",
            quoted_price: null,
            created_at: new Date().toISOString(),
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderId]);

  const steps = [
    { key: "new", label: "New Order", desc: "Enquiry logged & reviewed" },
    { key: "confirmed", label: "Confirmed", desc: "Design & slot finalized" },
    { key: "in_progress", label: "In Production", desc: "Being handcrafted" },
    { key: "shipped", label: "Dispatched", desc: "Handed to courier" },
    { key: "delivered", label: "Delivered", desc: "Delivered to customer" },
  ];

  const statusMap: Record<string, number> = {
    new: 0,
    reviewing: 0,
    quoted: 0,
    confirmed: 1,
    customer_confirmed: 1,
    in_progress: 2,
    in_production: 2,
    ready_to_dispatch: 2,
    shipped: 3,
    dispatched: 3,
    delivered: 4,
    completed: 4,
    cancelled: -1,
  };

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-32 pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#C84B31]/30 border-t-[#C84B31] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#8C7D72] uppercase tracking-widest">
            Loading Order #{orderId}...
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusMap[(order.status || "new").toLowerCase()] ?? 0;
  const isCancelled = order.status === "cancelled";

  // Pre-filled WhatsApp quick query
  const waQueryMsg = `Hi ArtByThread.7 Studio! 🧵 I am checking on my Order #${order.order_id} (${order.product_name}). Could you please share an update? 🌸`;
  const waQueryUrl = generateWhatsAppUrl(settings.whatsapp_number, waQueryMsg);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-8">
        
        {/* Back Link */}
        <div className="flex items-center justify-between text-xs text-[#8C7D72]">
          <Link
            href="/track-order"
            className="inline-flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Order History & Tracking</span>
          </Link>
          <span className="font-mono text-[#1F1D1B] bg-[#FFFDF9] px-3 py-1 rounded-full border border-[#E8E0D5]">
            Order #{order.order_id}
          </span>
        </div>

        {/* Main Order Card */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] shadow-lg overflow-hidden">
          {/* Top Thread Stitch Line */}
          <div className="h-2 w-full bg-gradient-to-r from-[#C84B31] via-[#E4929A] to-[#7D9D8B]" />

          <div className="p-6 sm:p-10 space-y-8">
            {/* Header Status & Order ID */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E0D5] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#C84B31]" />
                  <span>ArtByThread.7 Studio Order Card</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1D1B] mt-1 font-normal">
                  Order <span className="text-[#C84B31] font-mono font-bold">#{order.order_id}</span>
                </h1>
                <p className="text-xs text-[#5C4F46] mt-1">
                  Placed by <strong>{order.customer_name}</strong>
                  {order.delivery_city ? ` for delivery to ${order.delivery_city}` : ""}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#8C7D72] uppercase tracking-wider block font-semibold">
                  Live Status
                </span>
                <span
                  className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mt-1 ${
                    isCancelled
                      ? "bg-red-100 text-red-700"
                      : currentStepIndex === 4
                      ? "bg-[#E5EDE8] text-[#2E4B37]"
                      : "bg-[#FFF3CD] text-[#856404] border border-[#FFEEBA]"
                  }`}
                >
                  {isCancelled ? "Cancelled" : steps[currentStepIndex]?.label || "In Review"}
                </span>
              </div>
            </div>

            {/* Visual Order Status Stepper */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8C7D72]">
                Order Progress & Crafting Timeline
              </h2>

              <div className="relative">
                {/* Stepper Progress Bar */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-[#E8E0D5] z-0" />
                {!isCancelled && (
                  <div
                    className="hidden sm:block absolute top-5 left-6 h-0.5 bg-[#C84B31] transition-all duration-500 z-0"
                    style={{
                      width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                    }}
                  />
                )}

                {/* Steps Row */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {steps.map((s, idx) => {
                    const isPassed = !isCancelled && idx <= currentStepIndex;
                    const isCurrent = !isCancelled && idx === currentStepIndex;

                    return (
                      <div
                        key={s.key}
                        className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                            isPassed
                              ? "bg-[#C84B31] text-[#FAF7F2] ring-4 ring-[#FAF7F2] shadow-xs"
                              : "bg-[#FAF7F2] text-[#8C7D72] border border-[#E8E0D5]"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-semibold ${
                              isCurrent ? "text-[#C84B31]" : isPassed ? "text-[#1F1D1B]" : "text-[#8C7D72]"
                            }`}
                          >
                            {s.label}
                          </div>
                          <div className="text-[10px] text-[#8C7D72] leading-tight">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8E0D5]">
              {/* Product Photo Thumbnail */}
              <div className="md:col-span-4 relative aspect-square rounded-2xl overflow-hidden bg-[#FFFDF9] border border-[#E8E0D5] shadow-xs">
                {order.product_photo_url ? (
                  <Image
                    src={order.product_photo_url}
                    alt={order.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8C7D72]">
                    <Package className="w-8 h-8 text-[#C84B31]" />
                  </div>
                )}
              </div>

              {/* Product & Order Details */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
                    Handmade Creation
                  </span>
                  <h3 className="font-serif text-2xl text-[#1F1D1B]">
                    {order.product_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C4F46] pt-1">
                    <span className="font-semibold text-[#1F1D1B]">
                      Qty: {order.quantity}
                    </span>
                    <span>•</span>
                    <span>Variant: {order.size_variant || "Standard Size"}</span>
                    {order.quoted_price && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-[#1F1D1B]">
                          {formatPrice(order.quoted_price)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E8E0D5]/70 text-xs text-[#5C4F46]">
                  {order.customization_note && (
                    <div className="flex items-start gap-2">
                      <Palette className="w-4 h-4 text-[#C84B31] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1F1D1B]">Customization:</strong>{" "}
                        {order.customization_note}
                      </div>
                    </div>
                  )}

                  {order.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#8C7D72] shrink-0" />
                      <div>
                        <strong className="text-[#1F1D1B]">Phone:</strong>{" "}
                        {order.customer_phone}
                      </div>
                    </div>
                  )}

                  {order.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#8C7D72] shrink-0" />
                      <div>
                        <strong className="text-[#1F1D1B]">Email:</strong>{" "}
                        {order.customer_email}
                      </div>
                    </div>
                  )}

                  {order.delivery_city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#7D9D8B] shrink-0" />
                      <div>
                        <strong className="text-[#1F1D1B]">Delivery City:</strong>{" "}
                        {order.delivery_city}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8C7D72] shrink-0" />
                    <div>
                      <strong className="text-[#1F1D1B]">Crafting Time:</strong> Made slowly by hand (3-5 business days)
                    </div>
                  </div>

                  {order.shipping_carrier && order.tracking_number && (
                    <div className="flex items-center gap-2 text-[#2E4B37] bg-[#E5EDE8] p-2.5 rounded-xl">
                      <Truck className="w-4 h-4 text-[#2E4B37] shrink-0" />
                      <div>
                        <strong>Courier:</strong> {order.shipping_carrier} • <strong>Tracking:</strong> {order.tracking_number}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Studio Support & Contact Actions */}
            <div className="p-6 bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
                    Need Help or Want to Modify?
                  </h4>
                  <p className="text-xs text-[#5C4F46] mt-0.5">
                    Connect directly with the studio artisan regarding Order #{order.order_id}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={waQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>WhatsApp Studio</span>
                </a>

                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
                  <span>Instagram DM</span>
                </a>

                <a
                  href={`mailto:${settings.email_contact}?subject=${encodeURIComponent(`Query regarding Order #${order.order_id}`)}`}
                  className="py-3 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#C84B31]" />
                  <span>Email Studio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
