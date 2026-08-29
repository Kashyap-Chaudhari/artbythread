"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatPrice, generateWhatsAppUrl, generateEmailUrl } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  Package,
  Inbox,
  Image as ImageIcon,
  Star,
  Settings,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Mail,
  Eye,
  Lock,
  Search,
  Save,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import {
  Product,
  CustomRequest,
  CustomRequestStatus,
  OrderEnquiry,
  OrderStatus,
  Testimonial,
  GalleryItem,
  CreationCategory,
} from "@/lib/types";

const orderStatuses: OrderStatus[] = [
  "new",
  "confirmed",
  "in_progress",
  "shipped",
  "delivered",
  "cancelled",
];

const KANBAN_COLUMNS = [
  { id: "new", title: "New Enquiries", color: "#C84B31", bg: "#FBE8EB", badge: "Awaiting Review" },
  { id: "confirmed", title: "Confirmed", color: "#856404", bg: "#FFF3CD", badge: "Slot Confirmed" },
  { id: "in_progress", title: "In Production", color: "#1D4ED8", bg: "#EFF6FF", badge: "Crafting in Studio" },
  { id: "shipped", title: "Dispatched", color: "#6B21A8", bg: "#F3E8FF", badge: "In Transit" },
  { id: "delivered", title: "Delivered", color: "#166534", bg: "#DCFCE7", badge: "Completed" },
];

export default function AdminPage() {
  const {
    settings,
    updateSettings,
    products,
    saveProduct,
    deleteProduct,
    customRequests,
    updateCustomRequestStatus,
    orderEnquiries,
    updateOrderEnquiryStatus,
    galleryItems,
    saveGalleryItem,
    deleteGalleryItem,
    testimonials,
    toggleTestimonialApproval,
    saveTestimonial,
    deleteTestimonial,
    analytics,
    isAdminAuthenticated,
    setAdminAuthenticated,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "creations" | "requests" | "enquiries" | "gallery" | "testimonials" | "settings"
  >("dashboard");

  // Order view mode & channel filtering
  const [orderViewMode, setOrderViewMode] = useState<"kanban" | "list">("kanban");
  const [orderChannelFilter, setOrderChannelFilter] = useState<"all" | "whatsapp" | "instagram" | "email">("all");

  // Login credentials state
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Product Editor Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Gallery Item Editor Modal State
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Settings local state
  const [localSettings, setLocalSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Tracking edit state for orders
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState<string | null>(null);
  const [trackingForm, setTrackingForm] = useState({
    carrier: "",
    tracking_number: "",
    admin_notes: "",
    quoted_price: "",
  });

  // Capacity calculations (Max 12 pieces crafted per week)
  const WEEKLY_CAPACITY_LIMIT = 12;
  const activeOrdersInQueue = orderEnquiries.filter((o) => {
    const st = (o.status || "").toLowerCase();
    return st === "new" || st === "reviewing" || st === "quoted" || st === "confirmed" || st === "customer_confirmed" || st === "in_progress" || st === "in_production";
  });
  const queueCount = activeOrdersInQueue.length;
  const capacityPercent = Math.min(100, Math.round((queueCount / WEEKLY_CAPACITY_LIMIT) * 100));

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "thread123" || adminPassword === "admin" || adminPassword === "artbythread") {
      setAdminAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect admin passphrase. (Use 'thread123' for demo access)");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center mx-auto text-[#C84B31]">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-3xl text-[#1F1D1B]">Studio Dashboard</h1>
            <p className="text-xs text-[#8C7D72]">
              ArtByThread.7 Studio Owner Authentication
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                Admin Passphrase
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter passphrase (demo: thread123)"
                className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
              />
              {authError && <p className="text-[11px] text-[#C84B31] mt-1">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold shadow-md transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const orderStatuses: OrderStatus[] = [
    "NEW",
    "REVIEWING",
    "QUOTED",
    "CUSTOMER_CONFIRMED",
    "IN_PRODUCTION",
    "READY_TO_DISPATCH",
    "DISPATCHED",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col pt-20">
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 gap-8">
        
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block space-y-6">
          <div className="p-4 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] space-y-1 shadow-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold px-3 block mb-2">
              Studio Operations
            </span>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "dashboard" ? "bg-[#1F1D1B] text-[#FAF7F2]" : "text-[#5C4F46] hover:bg-[#FAF7F2]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("enquiries")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "enquiries" ? "bg-[#1F1D1B] text-[#FAF7F2]" : "text-[#5C4F46] hover:bg-[#FAF7F2]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Order Enquiries</span>
              </div>
              {orderEnquiries.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#C84B31] text-white">
                  {orderEnquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "requests" ? "bg-[#1F1D1B] text-[#FAF7F2]" : "text-[#5C4F46] hover:bg-[#FAF7F2]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Custom Leads</span>
              </div>
              {customRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#7D9D8B] text-white">
                  {customRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("creations")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "creations" ? "bg-[#1F1D1B] text-[#FAF7F2]" : "text-[#5C4F46] hover:bg-[#FAF7F2]"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Product Catalogue</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "gallery" ? "bg-[#1F1D1B] text-[#FAF7F2]" : "text-[#5C4F46] hover:bg-[#FAF7F2]"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery Lookbook</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeTab === "settings" ? "bg-[#1F1D1B] text-[#FAF7F2]" : "text-[#5C4F46] hover:bg-[#FAF7F2]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site Settings</span>
            </button>
          </div>

          <button
            onClick={() => setAdminAuthenticated(false)}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium text-[#C84B31] hover:bg-[#FBE8EB] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Dashboard</span>
          </button>
        </aside>

        {/* Main Panel Content */}
        <main className="flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl text-[#1F1D1B]">Studio Operations Overview</h1>
                <p className="text-xs text-[#8C7D72]">
                  Human-confirmed ordering platform performance & inquiry activity.
                </p>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
                    Order Enquiries
                  </span>
                  <p className="text-2xl font-serif font-semibold text-[#1F1D1B]">{orderEnquiries.length}</p>
                  <span className="text-[11px] text-[#5E7A68]">Website & Direct Channels</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
                    Custom Requests
                  </span>
                  <p className="text-2xl font-serif font-semibold text-[#C84B31]">{customRequests.length}</p>
                  <span className="text-[11px] text-[#8C7D72]">Bespoke Hoop & Flower Leads</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
                    WhatsApp Clicks
                  </span>
                  <p className="text-2xl font-serif font-semibold text-[#25D366]">{analytics.whatsapp_clicks}</p>
                  <span className="text-[11px] text-[#8C7D72]">Direct Chat Conversions</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-1 shadow-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
                    Instagram DMs
                  </span>
                  <p className="text-2xl font-serif font-semibold text-[#E4929A]">{analytics.instagram_clicks}</p>
                  <span className="text-[11px] text-[#8C7D72]">Profile & DM Copy Clicks</span>
                </div>
              </div>

              {/* Order Status Workflow Guide Banner */}
              <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1D1B]">
                  <ShieldCheck className="w-4 h-4 text-[#C84B31]" />
                  <span>No-Login Ordering Lifecycle (10 Production Stages)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {orderStatuses.map((st) => (
                    <span key={st} className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#3D342D]">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OMNICHANNEL ORDERS & KANBAN PIPELINE */}
          {activeTab === "enquiries" && (
            <div className="space-y-6">
              {/* Header & Capacity Overview */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl text-[#1F1D1B]">Omnichannel Orders Pipeline</h1>
                  <p className="text-xs text-[#8C7D72]">
                    Unified order inbox capturing orders from WhatsApp, Instagram, and Website forms.
                  </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-[#FFFDF9] p-1.5 rounded-2xl border border-[#E8E0D5]">
                  <button
                    type="button"
                    onClick={() => setOrderViewMode("kanban")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      orderViewMode === "kanban"
                        ? "bg-[#1F1D1B] text-[#FAF7F2] shadow-xs"
                        : "text-[#5C4F46] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    Kanban Board
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderViewMode("list")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      orderViewMode === "list"
                        ? "bg-[#1F1D1B] text-[#FAF7F2] shadow-xs"
                        : "text-[#5C4F46] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    List View
                  </button>
                </div>
              </div>

              {/* Handmade Made-to-Order Capacity Card */}
              <div className="p-5 sm:p-6 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
                    <Clock className="w-4 h-4 text-[#C84B31]" />
                    <span>Studio Crafting Capacity</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#1F1D1B]">
                    {queueCount} of {WEEKLY_CAPACITY_LIMIT} pieces in queue
                  </h3>
                  <p className="text-xs text-[#5C4F46]">
                    Handmade production workload tracker to prevent overcommitting.
                  </p>
                </div>

                <div className="md:col-span-7 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#8C7D72]">Weekly Slot Fill Rate</span>
                    <span
                      className={
                        capacityPercent >= 90
                          ? "text-[#C84B31]"
                          : capacityPercent >= 60
                          ? "text-[#856404]"
                          : "text-[#5E7A68]"
                      }
                    >
                      {capacityPercent}% Booked ({Math.max(0, WEEKLY_CAPACITY_LIMIT - queueCount)} slots available)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        capacityPercent >= 90
                          ? "bg-[#C84B31]"
                          : capacityPercent >= 60
                          ? "bg-[#E9C46A]"
                          : "bg-[#7D9D8B]"
                      }`}
                      style={{ width: `${Math.max(5, capacityPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#8C7D72] mr-1">Filter Channel:</span>
                  {(["all", "whatsapp", "instagram", "email"] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setOrderChannelFilter(ch)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                        orderChannelFilter === ch
                          ? "bg-[#C84B31] text-[#FAF7F2] font-semibold shadow-xs"
                          : "bg-[#FFFDF9] text-[#5C4F46] border border-[#E8E0D5] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-[#8C7D72]">
                  Showing {
                    orderEnquiries.filter((o) => {
                      if (orderChannelFilter === "all") return true;
                      const c = (o.preferred_channel || o.channel || "").toLowerCase();
                      return c.includes(orderChannelFilter);
                    }).length
                  } order(s)
                </span>
              </div>

              {/* ========================================================================= */}
              {/* KANBAN BOARD VIEW */}
              {/* ========================================================================= */}
              {orderViewMode === "kanban" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                  {KANBAN_COLUMNS.map((col) => {
                    const colOrders = orderEnquiries.filter((enq) => {
                      const st = (enq.status || "new").toLowerCase();
                      const matchesCol =
                        col.id === "new"
                          ? st === "new" || st === "reviewing" || st === "quoted"
                          : col.id === "confirmed"
                          ? st === "confirmed" || st === "customer_confirmed"
                          : col.id === "in_progress"
                          ? st === "in_progress" || st === "in_production"
                          : col.id === "shipped"
                          ? st === "shipped" || st === "dispatched" || st === "ready_to_dispatch"
                          : col.id === "delivered"
                          ? st === "delivered" || st === "completed"
                          : false;

                      if (!matchesCol) return false;
                      if (orderChannelFilter === "all") return true;
                      const ch = (enq.preferred_channel || enq.channel || "").toLowerCase();
                      return ch.includes(orderChannelFilter);
                    });

                    return (
                      <div
                        key={col.id}
                        className="bg-[#FAF7F2] rounded-3xl border border-[#E8E0D5] p-3.5 space-y-3 min-h-[400px]"
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-1.5 pt-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: col.color }}
                            />
                            <h4 className="font-serif text-sm font-semibold text-[#1F1D1B]">
                              {col.title}
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[11px] font-bold text-[#1F1D1B]">
                            {colOrders.length}
                          </span>
                        </div>

                        {/* Order Cards List */}
                        <div className="space-y-3">
                          {colOrders.map((enq) => {
                            const reqName = enq.customer_name || "Customer";
                            const reqPhone = enq.customer_phone || settings.whatsapp_number;
                            const channelKey = (enq.preferred_channel || enq.channel || "whatsapp").toLowerCase();

                            const waReplyUrl = generateWhatsAppUrl(
                              reqPhone,
                              `Hi ${reqName}! 🧵 ArtByThread.7 here regarding your order #${enq.order_id} (${enq.product_name}). Current status: ${col.title}. Tracking: https://artbythread.com/order/${enq.order_id}`
                            );

                            return (
                              <div
                                key={enq.id}
                                className="p-4 bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] shadow-xs space-y-3 hover:shadow-md transition-shadow"
                              >
                                {/* Card Top: ID & Channel Badge */}
                                <div className="flex items-center justify-between gap-2">
                                  <Link
                                    href={`/order/${enq.order_id}`}
                                    target="_blank"
                                    className="font-mono text-xs font-bold text-[#C84B31] hover:underline flex items-center gap-1"
                                    title="Open customer tracking page"
                                  >
                                    <span>#{enq.order_id}</span>
                                    <ExternalLink className="w-3 h-3 text-[#8C7D72]" />
                                  </Link>

                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                                      channelKey.includes("whatsapp")
                                        ? "bg-[#25D366]/10 text-[#1E7E34]"
                                        : channelKey.includes("instagram")
                                        ? "bg-[#FAF7F2] text-[#E4929A] border border-[#E8E0D5]"
                                        : "bg-[#C84B31]/10 text-[#C84B31]"
                                    }`}
                                  >
                                    {channelKey.includes("whatsapp") ? (
                                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                                    ) : channelKey.includes("instagram") ? (
                                      <InstagramIcon className="w-3 h-3 text-[#E4929A]" />
                                    ) : (
                                      <Mail className="w-3 h-3 text-[#C84B31]" />
                                    )}
                                    <span className="capitalize">{channelKey.replace("_form", "")}</span>
                                  </span>
                                </div>

                                {/* Product & Customer */}
                                <div>
                                  <h5 className="font-serif text-sm text-[#1F1D1B] font-medium leading-tight">
                                    {enq.product_name}
                                  </h5>
                                  <p className="text-[11px] text-[#8C7D72] mt-0.5">
                                    Qty: {enq.quantity} • {formatPrice(enq.quoted_price)}
                                  </p>
                                </div>

                                <div className="text-[11px] text-[#5C4F46] bg-[#FAF7F2] p-2 rounded-xl border border-[#E8E0D5] space-y-0.5">
                                  <div className="font-semibold text-[#1F1D1B]">{reqName}</div>
                                  <div className="truncate">{enq.customer_phone || enq.customer_email}</div>
                                  {enq.delivery_city && <div>📍 {enq.delivery_city}</div>}
                                  {enq.customization_note && (
                                    <div className="text-[#C84B31] font-medium italic pt-0.5 truncate">
                                      &quot;{enq.customization_note}&quot;
                                    </div>
                                  )}
                                </div>

                                {/* Status Mover Buttons */}
                                <div className="space-y-1.5 pt-1">
                                  <select
                                    value={enq.status || "new"}
                                    onChange={(e) => updateOrderEnquiryStatus(enq.id, e.target.value as OrderStatus)}
                                    className="w-full px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#FAF7F2] border border-[#E8E0D5] text-[#1F1D1B]"
                                  >
                                    <option value="new">➔ Move to New</option>
                                    <option value="confirmed">➔ Move to Confirmed</option>
                                    <option value="in_progress">➔ Move to In Production</option>
                                    <option value="shipped">➔ Move to Dispatched</option>
                                    <option value="delivered">➔ Move to Delivered</option>
                                    <option value="cancelled">➔ Cancel Order</option>
                                  </select>

                                  <a
                                    href={waReplyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-1.5 px-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1E7E34] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>WhatsApp Customer</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}

                          {colOrders.length === 0 && (
                            <div className="text-center py-8 text-[11px] text-[#8C7D72] italic">
                              No orders in {col.title}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ========================================================================= */
                /* LIST VIEW */
                /* ========================================================================= */
                <div className="space-y-4">
                  {orderEnquiries
                    .filter((enq) => {
                      if (orderChannelFilter === "all") return true;
                      const ch = (enq.preferred_channel || enq.channel || "").toLowerCase();
                      return ch.includes(orderChannelFilter);
                    })
                    .map((enq) => {
                      const reqName = enq.customer_name || "Customer";
                      const reqPhone = enq.customer_phone || settings.whatsapp_number;
                      const whatsappReplyUrl = generateWhatsAppUrl(
                        reqPhone,
                        `Hi ${reqName}! This is ArtByThread.7 regarding your order #${enq.order_id} for "${enq.product_name}" (Qty: ${enq.quantity}). Tracking link: https://artbythread.com/order/${enq.order_id}`
                      );
                      const emailReplyUrl = generateEmailUrl(
                        enq.customer_email || settings.email_contact,
                        `ArtByThread.7 — Order Update #${enq.order_id} (${enq.product_name})`,
                        `Hi ${reqName},\n\nThank you for your order #${enq.order_id} for "${enq.product_name}".\n\nLive tracking link: https://artbythread.com/order/${enq.order_id}\n\nWarm regards,\nArtByThread.7 Studio`
                      );

                      return (
                        <div
                          key={enq.id}
                          className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] space-y-4 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E0D5]">
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/order/${enq.order_id}`}
                                target="_blank"
                                className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#1F1D1B] text-[#E9C46A] hover:underline"
                              >
                                #{enq.order_id} ↗
                              </Link>
                              <div>
                                <h3 className="font-serif text-lg text-[#1F1D1B] font-medium">
                                  {enq.product_name} <span className="text-xs text-[#8C7D72] font-sans">(Qty: {enq.quantity})</span>
                                </h3>
                                <span className="text-[10px] uppercase tracking-wider text-[#8C7D72]">
                                  Channel: {enq.preferred_channel || enq.channel} • {new Date(enq.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#8C7D72] font-medium">Status:</span>
                              <select
                                value={(enq.status || "new").toLowerCase()}
                                onChange={(e) => updateOrderEnquiryStatus(enq.id, e.target.value as OrderStatus)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#E8E0D5] text-[#C84B31]"
                              >
                                <option value="new">New Enquiry</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Production</option>
                                <option value="shipped">Dispatched</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5C4F46]">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold block">Customer Details</span>
                              <span className="font-semibold text-[#1F1D1B] block">{enq.customer_name}</span>
                              <span className="block">{enq.customer_phone}</span>
                              <span className="block">{enq.customer_email}</span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold block">Delivery Location</span>
                              <p className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E0D5] text-[#1F1D1B]">
                                {enq.delivery_city || enq.address || "City not specified"}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold block">Customization</span>
                              <p className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E0D5]">
                                {enq.customization_note || enq.customization_details || "None requested"}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#E8E0D5] flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <a
                                href={whatsappReplyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                                <span>Reply on WhatsApp</span>
                              </a>

                              <a
                                href={emailReplyUrl}
                                className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-semibold flex items-center gap-1.5"
                              >
                                <Mail className="w-3.5 h-3.5 text-[#C84B31]" />
                                <span>Reply via Email</span>
                              </a>
                            </div>

                            <Link
                              href={`/order/${enq.order_id}`}
                              target="_blank"
                              className="text-xs text-[#C84B31] font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>Public Order Card ↗</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}

                  {orderEnquiries.length === 0 && (
                    <div className="text-center py-12 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 space-y-2">
                      <ShoppingBag className="w-8 h-8 text-[#8C7D72] mx-auto" />
                      <h4 className="font-serif text-lg text-[#1F1D1B]">No order enquiries yet</h4>
                      <p className="text-xs text-[#8C7D72] max-w-sm mx-auto">
                        Incoming order requests from WhatsApp, Instagram, and Website forms will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM LEADS */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl text-[#1F1D1B]">Custom Commission Leads</h1>
                <p className="text-xs text-[#8C7D72]">
                  Review bespoke creation requests and uploaded reference photos.
                </p>
              </div>

              <div className="space-y-4">
                {customRequests.map((req) => {
                  const reqName = req.full_name || "Customer";
                  const reqPhone = req.phone || settings.whatsapp_number;
                  const whatsappReplyUrl = generateWhatsAppUrl(
                    reqPhone,
                    `Hi ${reqName}! This is ArtByThread.7 regarding your custom request #${req.request_id || req.id} for "${req.creation_type}". We loved your idea and would like to discuss details!`
                  );

                  return (
                    <div key={req.id} className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D5] shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1F1D1B] text-[#E9C46A]">
                            {req.request_id || "CUST-REQ"}
                          </span>
                          <h3 className="font-serif text-lg text-[#1F1D1B]">{reqName}</h3>
                          <span className="text-xs text-[#C84B31] capitalize font-medium">({req.creation_type})</span>
                        </div>

                        <select
                          value={req.status || "NEW"}
                          onChange={(e) => updateCustomRequestStatus(req.id, e.target.value as CustomRequestStatus)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#E8E0D5] text-[#1F1D1B]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="QUOTED">QUOTED</option>
                          <option value="CUSTOMER_CONFIRMED">CUSTOMER CONFIRMED</option>
                          <option value="IN_PRODUCTION">IN PRODUCTION</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#5C4F46]">
                        <div className="md:col-span-2 space-y-2">
                          <p><strong>Description:</strong> {req.description}</p>
                          <p><strong>Phone:</strong> {req.phone} • <strong>Email:</strong> {req.email}</p>
                          {req.color_palette && req.color_palette.length > 0 && (
                            <p><strong>Colors:</strong> {req.color_palette.join(", ")}</p>
                          )}
                          {req.delivery_address && <p><strong>Delivery Address:</strong> {req.delivery_address}</p>}
                        </div>

                        {req.reference_image_url && (
                          <div>
                            <strong className="text-[#1F1D1B] block mb-1">Reference Photo:</strong>
                            <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#E8E0D5]">
                              <Image src={req.reference_image_url} alt="Reference" fill className="object-cover" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#E8E0D5]">
                        <a
                          href={whatsappReplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                          <span>Reply on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}

                {customRequests.length === 0 && (
                  <div className="text-center py-12 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 space-y-2">
                    <Inbox className="w-8 h-8 text-[#8C7D72] mx-auto" />
                    <h4 className="font-serif text-lg text-[#1F1D1B]">No custom requests yet</h4>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CATALOGUE CREATIONS */}
          {activeTab === "creations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl text-[#1F1D1B]">Product Catalogue</h1>
                  <p className="text-xs text-[#8C7D72]">Manage studio creations and pricing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      slug: "new-creation",
                      name: "New Handmade Creation",
                      category: "thread-art",
                      short_description: "Beautiful handcrafted thread art.",
                      description: "Detailed description of crafting process and materials.",
                      price: 1800,
                      is_available: true,
                      is_featured: false,
                      is_bestseller: false,
                      is_new: true,
                      is_published: true,
                      images: [{ id: "1", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800", alt: "Creation Image", is_primary: true, order: 1 }],
                      materials: ["Cotton Thread", "Bamboo Hoop"],
                      making_time: "3-5 business days",
                      care_instructions: "Keep away from moisture.",
                      customization_options: "Initials available.",
                      shipping_info: "Ships in protective gift box.",
                      tags: ["handmade", "embroidery"],
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Creation</span>
                </button>
              </div>

              <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E8E0D5] text-[#8C7D72] uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Piece</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D5]">
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0">
                            <Image src={prod.images[0]?.url || ""} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-[#1F1D1B] block">{prod.name}</span>
                            <span className="text-[11px] text-[#8C7D72]">/{prod.slug}</span>
                          </div>
                        </td>
                        <td className="p-4 capitalize">{prod.category.replace("-", " ")}</td>
                        <td className="p-4 font-semibold">{formatPrice(prod.price)}</td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1 text-[#C84B31] hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl text-[#1F1D1B]">Studio Site Settings</h1>
                <p className="text-xs text-[#8C7D72]">Configure brand channels, WhatsApp, Instagram & Email.</p>
              </div>

              <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={localSettings.whatsapp_number}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsapp_number: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">Instagram Username / URL</label>
                  <input
                    type="text"
                    value={localSettings.instagram_username}
                    onChange={(e) => setLocalSettings({ ...localSettings, instagram_username: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">Admin Notification Email</label>
                  <input
                    type="email"
                    value={localSettings.email_contact}
                    onChange={(e) => setLocalSettings({ ...localSettings, email_contact: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateSettings(localSettings);
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2500);
                  }}
                  className="px-6 py-3 rounded-full bg-[#1F1D1B] text-white text-xs font-semibold"
                >
                  {settingsSaved ? "Settings Saved! ✓" : "Save Settings"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
