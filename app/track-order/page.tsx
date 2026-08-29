"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Trash2,
  ShoppingBag,
  HeartHandshake,
  MapPin,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/lib/store";
import { formatPrice, generateWhatsAppUrl } from "@/lib/utils";

export interface StoredOrder {
  order_id: string;
  product_name: string;
  product_photo_url?: string;
  quantity: number;
  size_variant?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_city?: string;
  customization_note?: string;
  product_price?: number | null;
  status: string;
  created_at: string;
}

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("id") || "";
  const { settings, trackEvent } = useStore();

  const [searchId, setSearchId] = useState<string>(initialQuery);
  const [storedOrders, setStoredOrders] = useState<StoredOrder[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");

  // Load customer order history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("artbythread_customer_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setStoredOrders(parsed);
        }
      }
    } catch (err) {
      console.warn("[FAILED TO LOAD SAVED ORDERS]", err);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim().toUpperCase();
    if (!clean) {
      setSearchError("Please enter a valid Order ID (e.g. AT7-3587).");
      return;
    }
    setSearchError("");
    setIsSearching(true);
    trackEvent("page_visit", { query: clean });
    router.push(`/order/${clean}`);
  };

  const removeStoredOrder = (orderId: string) => {
    try {
      const updated = storedOrders.filter((o) => o.order_id !== orderId);
      setStoredOrders(updated);
      localStorage.setItem("artbythread_customer_orders", JSON.stringify(updated));
    } catch (err) {
      console.warn("[FAILED TO REMOVE STORED ORDER]", err);
    }
  };

  const clearAllHistory = () => {
    if (confirm("Are you sure you want to clear your local order history on this device?")) {
      try {
        localStorage.removeItem("artbythread_customer_orders");
        setStoredOrders([]);
      } catch (err) {
        console.warn("[FAILED TO CLEAR HISTORY]", err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "new").toLowerCase();
    if (s === "delivered" || s === "completed") {
      return {
        label: "Delivered",
        bg: "bg-[#E5EDE8] text-[#2E4B37] border-[#C2D6C9]",
        dot: "bg-[#2E4B37]",
      };
    }
    if (s === "shipped" || s === "dispatched") {
      return {
        label: "Dispatched / Courier",
        bg: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
        dot: "bg-[#0284C7]",
      };
    }
    if (s === "in_progress" || s === "in_production") {
      return {
        label: "Handcrafting in Studio",
        bg: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
        dot: "bg-[#D97706]",
      };
    }
    if (s === "confirmed") {
      return {
        label: "Order Confirmed",
        bg: "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]",
        dot: "bg-[#9333EA]",
      };
    }
    return {
      label: "Enquiry In Review",
      bg: "bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]",
      dot: "bg-[#C84B31]",
    };
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-32 pb-16 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-xs font-semibold text-[#8C7D72] shadow-xs">
            <Package className="w-3.5 h-3.5 text-[#C84B31]" />
            <span className="uppercase tracking-widest text-[10px]">Studio Order Hub</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1F1D1B] font-normal leading-tight">
            Track Order & History
          </h1>

          <p className="text-xs sm:text-sm text-[#5C4F46] leading-relaxed">
            Look up your live handcrafting status, view past orders placed on this device, or chat directly with the studio artisan.
          </p>
        </div>

        {/* Live Search & Track Card */}
        <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#E8E0D5] shadow-lg max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold border-b border-[#E8E0D5]/60 pb-3">
            <Search className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Search by Order ID</span>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    if (searchError) setSearchError("");
                  }}
                  placeholder="e.g. AT7-3587"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-sm text-[#1F1D1B] font-mono outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] transition-all uppercase placeholder:normal-case placeholder:font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="py-3.5 px-6 rounded-2xl bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
              >
                {isSearching ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Track Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {searchError && (
              <p className="text-xs text-[#C84B31] pl-1 font-medium">
                {searchError}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between text-[11px] text-[#8C7D72] pt-1">
              <span>Order IDs are formatted as <strong>AT7-XXXX</strong> (from your email or WhatsApp message).</span>
            </div>
          </form>
        </div>

        {/* Customer Order History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-4">
            <div>
              <h2 className="font-serif text-2xl text-[#1F1D1B]">
                Orders on this Device ({storedOrders.length})
              </h2>
              <p className="text-xs text-[#8C7D72] mt-0.5">
                Automatically saved locally whenever you place an order enquiry on ArtByThread.7.
              </p>
            </div>

            {storedOrders.length > 0 && (
              <button
                type="button"
                onClick={clearAllHistory}
                className="text-xs text-[#8C7D72] hover:text-[#C84B31] flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-[#FFFDF9] transition-colors cursor-pointer"
                title="Clear local order history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
          </div>

          {storedOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {storedOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                const orderDate = new Date(ord.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const waQueryUrl = generateWhatsAppUrl(
                  settings.whatsapp_number,
                  `Hi ArtByThread.7 Studio! I am checking on my Order #${ord.order_id} (${ord.product_name}). Could you please share an update?`
                );

                return (
                  <motion.div
                    key={ord.order_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Header: ID & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm font-bold text-[#C84B31] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8E0D5]">
                          #{ord.order_id}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      {/* Product Thumbnail & Details */}
                      <div className="flex items-start gap-4 pt-1">
                        <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E0D5] shrink-0">
                          {ord.product_photo_url ? (
                            <Image
                              src={ord.product_photo_url}
                              alt={ord.product_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-[#8C7D72]">
                              <Package className="w-6 h-6 text-[#C84B31]" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="font-serif text-base sm:text-lg text-[#1F1D1B] truncate font-normal">
                            {ord.product_name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C4F46]">
                            <span>Qty: {ord.quantity}</span>
                            <span>•</span>
                            <span>{ord.size_variant || "Standard Size"}</span>
                            {ord.product_price && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-[#1F1D1B]">
                                  {formatPrice(ord.product_price)}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="text-[11px] text-[#8C7D72] flex items-center gap-2 pt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#7D9D8B]" />
                              <span>{ord.delivery_city || "India"}</span>
                            </span>
                            <span>•</span>
                            <span>{orderDate}</span>
                          </div>
                        </div>
                      </div>

                      {ord.customization_note && (
                        <div className="mt-3 text-xs bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E0D5] text-[#5C4F46]">
                          <strong className="text-[#1F1D1B]">Custom Note:</strong>{" "}
                          <span className="italic">&ldquo;{ord.customization_note}&rdquo;</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#E8E0D5]/70">
                      <Link
                        href={`/order/${ord.order_id}`}
                        className="flex-1 py-2.5 px-3.5 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>View Tracking Card</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={waQueryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors flex items-center justify-center shadow-xs"
                        title="Chat on WhatsApp regarding this order"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                      </a>

                      <button
                        type="button"
                        onClick={() => removeStoredOrder(ord.order_id)}
                        className="p-2.5 rounded-full bg-[#FAF7F2] hover:bg-red-50 text-[#8C7D72] hover:text-red-600 transition-colors border border-[#E8E0D5] cursor-pointer"
                        title="Remove from device history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#C84B31] flex items-center justify-center mx-auto shadow-xs">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-xl text-[#1F1D1B]">
                  No Orders Saved On This Device Yet
                </h3>
                <p className="text-xs text-[#8C7D72] max-w-sm mx-auto leading-relaxed">
                  When you submit an order enquiry for handkerchiefs, bouquets, or keychains, your order history will automatically appear here.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/creations"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold tracking-wide shadow-md transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
                  <span>Browse Handmade Creations</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 5-Step Crafting Process Explanation */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 sm:p-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
              Artisan Crafting Pipeline
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
              How Your Handmade Order Progresses
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4">
            {[
              {
                step: "01",
                title: "Enquiry Logged",
                desc: "Order ID generated and delivered to studio inbox.",
              },
              {
                step: "02",
                title: "Studio Confirmation",
                desc: "Design, thread color, and slot finalized on WhatsApp.",
              },
              {
                step: "03",
                title: "Thread Work",
                desc: "Handcrafted slowly and attentively one stitch at a time.",
              },
              {
                step: "04",
                title: "Courier Dispatch",
                desc: "Packed with protective luxury box and handed to courier.",
              },
              {
                step: "05",
                title: "Delivered",
                desc: "Arrives at your doorstep across India.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-2 relative"
              >
                <div className="text-xs font-mono font-bold text-[#C84B31]">
                  {item.step}
                </div>
                <h4 className="text-xs font-semibold text-[#1F1D1B]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#8C7D72] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5C4F46]">
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-[#C84B31] shrink-0" />
              <span>
                Need to change initials, color choice, or delivery address? Reach out anytime on WhatsApp with your Order ID.
              </span>
            </div>

            <a
              href={generateWhatsAppUrl(
                settings.whatsapp_number,
                "Hi ArtByThread.7 Studio! I have a question regarding my order."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-full bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
              <span>Chat Studio</span>
            </a>
          </div>
        </div>

      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
