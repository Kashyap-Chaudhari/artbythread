import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { initialProducts, initialSiteSettings } from "@/lib/data";
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
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Footer } from "@/components/layout/Footer";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

// Helper to fetch order from Supabase or generate deterministic fallback
async function getOrderDetails(orderIdOrUuid: string) {
  const cleanId = decodeURIComponent(orderIdOrUuid).trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`order_id.eq.${cleanId},id.eq.${cleanId}`)
        .single();

      if (data && !error) {
        return {
          id: data.id,
          order_id: data.order_id || cleanId,
          customer_name: data.customer_name || "Valued Customer",
          customer_phone: data.customer_phone || "",
          customer_email: data.customer_email || "",
          preferred_channel: data.preferred_channel || "whatsapp",
          product_name: data.product_name || "Handmade Creation",
          product_photo_url: data.product_photo_url || "/products/orchid-bouquet-never-fades.jpg",
          quantity: data.quantity || 1,
          size_variant: data.size_variant || "Standard Size",
          customization_note: data.customization_note || data.customization_details || "",
          delivery_city: data.delivery_city || "India",
          status: (data.status || "new").toLowerCase(),
          quoted_price: data.quoted_price || null,
          admin_notes: data.admin_notes || "",
          shipping_carrier: data.shipping_carrier || "",
          tracking_number: data.tracking_number || "",
          created_at: data.created_at || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn("[ORDER FETCH FROM DB WARNING]", e);
    }
  }

  // Graceful fallback for mock / demo / newly created orders
  const sampleProduct = initialProducts[0];
  return {
    id: cleanId,
    order_id: cleanId,
    customer_name: "Art Lover",
    customer_phone: "+91 98765 43210",
    customer_email: "customer@example.com",
    preferred_channel: "whatsapp",
    product_name: sampleProduct?.name || "Personalized Embroidered Handkerchief",
    product_photo_url: sampleProduct?.images?.[0]?.url || "/products/handkerchief-iloveu-embroidery.jpg",
    quantity: 1,
    size_variant: "Standard Size",
    customization_note: "Custom initials with handmade floral border.",
    delivery_city: "Mumbai",
    status: "new",
    quoted_price: sampleProduct?.price || 1250,
    admin_notes: "Handcrafting scheduled in studio queue.",
    shipping_carrier: "",
    tracking_number: "",
    created_at: new Date().toISOString(),
  };
}

// Dynamic Open Graph metadata generator for WhatsApp / Instagram / Social previews
export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderDetails(id);

  const title = `ArtByThread.7 Order #${order.order_id} — ${order.product_name}`;
  const description = `Handmade order for ${order.product_name} (Qty: ${order.quantity}) • Status: ${order.status.toUpperCase()} • Handcrafted in India with heart.`;
  
  // Ensure absolute image URL for Open Graph crawlers
  const photoUrl = order.product_photo_url.startsWith("http")
    ? order.product_photo_url
    : `https://artbythread.com${order.product_photo_url}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: photoUrl,
          width: 800,
          height: 800,
          alt: order.product_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [photoUrl],
    },
  };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderDetails(id);

  if (!order) {
    return notFound();
  }

  // Pipeline status definition
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

  const currentStepIndex = statusMap[order.status] ?? 0;
  const isCancelled = order.status === "cancelled";

  // Pre-filled WhatsApp quick query
  const waQueryMsg = `Hi ArtByThread.7 Studio! 🧵 I am checking on my Order #${order.order_id} (${order.product_name}). Could you please share an update? 🌸`;
  const waQueryUrl = generateWhatsAppUrl(initialSiteSettings.whatsapp_number, waQueryMsg);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-8">
        
        {/* Back Link */}
        <div className="flex items-center justify-between text-xs text-[#8C7D72]">
          <Link
            href="/creations"
            className="inline-flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Creations</span>
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
                  Placed by <strong>{order.customer_name}</strong> for delivery to <strong>{order.delivery_city}</strong>
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
                    No Photo
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
                  <div className="flex items-center gap-3 text-xs text-[#5C4F46] pt-1">
                    <span className="font-semibold text-[#1F1D1B]">
                      Qty: {order.quantity}
                    </span>
                    <span>•</span>
                    <span>Variant: {order.size_variant}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#1F1D1B]">
                      {formatPrice(order.quoted_price)}
                    </span>
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
                      <span className="text-[#8C7D72] shrink-0 font-mono text-xs">📞</span>
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

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7D9D8B] shrink-0" />
                    <div>
                      <strong className="text-[#1F1D1B]">Delivery City:</strong>{" "}
                      {order.delivery_city}
                    </div>
                  </div>

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
                    Connect directly with the studio artisan with Order #{order.order_id}.
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
                  href={initialSiteSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
                  <span>Instagram DM</span>
                </a>

                <a
                  href={`mailto:${initialSiteSettings.email_contact}?subject=${encodeURIComponent(`Query regarding Order #${order.order_id}`)}`}
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
