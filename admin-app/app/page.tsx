"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Phone,
  MessageCircle,
  Plus,
  Palette,
  Scissors,
  Bookmark,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice, formatDate, generateWhatsAppUrl, generateCustomerWhatsAppUpdate } from "@/lib/utils";
import { ProductModal } from "@/components/products/ProductModal";

export default function AdminDashboardPage() {
  const { orders, products, customRequests, updateOrderStatus, addProduct } = useAdminStore();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Compute metrics
  const newOrders = orders.filter((o) => o.status === "new");
  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const inProgressOrders = orders.filter((o) => o.status === "in_progress");
  const shippedOrders = orders.filter((o) => o.status === "shipped");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, o) => acc + (o.quoted_price || 0), 0);

  const currentDateFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kpis = [
    {
      label: "Total Orders Logged",
      value: orders.length,
      sub: `${newOrders.length} requiring review`,
      icon: Package,
      bg: "bg-[#FFFDF9]",
      border: "border-[#E6DFC8]",
      color: "text-[#1C1917]",
    },
    {
      label: "On the Hoop / Loom",
      value: inProgressOrders.length + confirmedOrders.length,
      sub: `${inProgressOrders.length} currently stitching`,
      icon: Clock,
      bg: "bg-[#FFEDD5]/40",
      border: "border-[#FED7AA]",
      color: "text-[#9A3412]",
    },
    {
      label: "Dispatched / En Route",
      value: shippedOrders.length,
      sub: "With tracking number",
      icon: Truck,
      bg: "bg-[#E0F2FE]/40",
      border: "border-[#BAE6FD]",
      color: "text-[#075985]",
    },
    {
      label: "Delivered Pieces",
      value: deliveredOrders.length,
      sub: "Completed creations",
      icon: CheckCircle2,
      bg: "bg-[#E8EDE6]/50",
      border: "border-[#CCD9CA]",
      color: "text-[#24422D]",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Studio Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E6DFC8] shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#9E3B24]" />
            <span>Atelier Ledger • {currentDateFormatted}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal">
            Studio Operations Overview
          </h1>
          <p className="text-xs text-[#6E635A] max-w-xl leading-relaxed">
            Welcome back, Henvi ✨ Here is the live status of your handmade commissions, stitching queue, and dispatched packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-[#181615] hover:bg-[#9E3B24] text-[#FAF7F2] text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Creation</span>
          </button>

          <Link
            href="/orders"
            className="py-2.5 px-4 rounded-xl bg-[#F8F5EE] hover:bg-[#EDE5D6] text-xs font-semibold text-[#1C1917] border border-[#E6DFC8] transition-colors"
          >
            Manage Pipeline →
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`p-5 rounded-2xl border ${kpi.border} ${kpi.bg} flex flex-col justify-between space-y-3 shadow-2xs`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E635A]">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <div className={`text-3xl font-serif font-bold ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[11px] text-[#8C7D72] mt-0.5">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5-Stage Crafting Pipeline Strip */}
      <div className="bg-[#FFFDF9] p-6 sm:p-7 rounded-2xl border border-[#E6DFC8] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[#1C1917] font-normal">
              5-Stage Crafting Pipeline
            </h2>
            <p className="text-xs text-[#6E635A] mt-0.5">
              Current queue progression across all handcrafted pieces
            </p>
          </div>
          <Link
            href="/orders"
            className="text-xs text-[#9E3B24] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Open Pipeline View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex overflow-x-auto sm:grid sm:grid-cols-5 gap-3 pt-1 pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {[
            {
              stage: "1. New Enquiry",
              count: newOrders.length,
              bg: "bg-[#FEF3C7]/60",
              border: "border-[#FDE68A]",
              text: "text-[#92400E]",
              href: "/orders?status=new",
            },
            {
              stage: "2. Confirmed",
              count: confirmedOrders.length,
              bg: "bg-[#EDE9FE]/60",
              border: "border-[#DDD6FE]",
              text: "text-[#5B21B6]",
              href: "/orders?status=confirmed",
            },
            {
              stage: "3. Handcrafting",
              count: inProgressOrders.length,
              bg: "bg-[#FFEDD5]/60",
              border: "border-[#FED7AA]",
              text: "text-[#9A3412]",
              href: "/orders?status=in_progress",
            },
            {
              stage: "4. Dispatched",
              count: shippedOrders.length,
              bg: "bg-[#E0F2FE]/60",
              border: "border-[#BAE6FD]",
              text: "text-[#075985]",
              href: "/orders?status=shipped",
            },
            {
              stage: "5. Delivered",
              count: deliveredOrders.length,
              bg: "bg-[#E8EDE6]/70",
              border: "border-[#CCD9CA]",
              text: "text-[#24422D]",
              href: "/orders?status=delivered",
            },
          ].map((item) => (
            <Link
              key={item.stage}
              href={item.href}
              className={`p-4 rounded-xl border ${item.border} ${item.bg} hover:shadow-2xs transition-all flex flex-col justify-between min-w-[140px] sm:min-w-0 flex-1`}
            >
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${item.text}`}>
                {item.stage}
              </span>
              <div className={`text-2xl font-serif font-bold ${item.text} mt-2`}>
                {item.count}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Ledger Table */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E6DFC8] pb-4">
          <div>
            <h2 className="font-serif text-2xl text-[#1C1917] font-normal">
              Recent Order Ledger
            </h2>
            <p className="text-xs text-[#6E635A] mt-0.5">
              Showing the latest customer entries and embroidery orders
            </p>
          </div>

          <Link
            href="/orders"
            className="py-2 px-3.5 rounded-xl bg-[#F8F5EE] hover:bg-[#EDE5D6] text-xs font-semibold text-[#1C1917] border border-[#E6DFC8] transition-colors"
          >
            View All ({orders.length})
          </Link>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6DFC8] text-[#8C7D72] font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Creation Piece</th>
                <th className="pb-3">Delivery City</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Logged Date</th>
                <th className="pb-3 text-right pr-2">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFC8]/60 text-[#1C1917]">
              {orders.slice(0, 6).map((ord) => {
                const waUrl = generateWhatsAppUrl(
                  ord.customer_phone || "",
                  generateCustomerWhatsAppUpdate(ord, ord.status)
                );

                return (
                  <tr key={ord.order_id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="font-mono font-bold text-[#9E3B24]">#{ord.order_id}</div>
                      {(() => {
                        const chan = (ord.preferred_channel || "whatsapp").toLowerCase().replace("_form", "");
                        if (chan === "instagram") {
                          return (
                            <span className="inline-block mt-0.5 text-[9px] font-semibold text-[#BE185D] bg-[#FDF2F8] px-1.5 py-0.5 rounded border border-[#FBCFE8]">
                              📸 Insta
                            </span>
                          );
                        }
                        if (chan === "email") {
                          return (
                            <span className="inline-block mt-0.5 text-[9px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                              📧 Email
                            </span>
                          );
                        }
                        return (
                          <span className="inline-block mt-0.5 text-[9px] font-semibold text-[#1B7E3E] bg-[#E8F8EE] px-1.5 py-0.5 rounded border border-[#C3EBD0]">
                            💬 WhatsApp
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold">{ord.customer_name}</div>
                      <div className="text-[11px] text-[#8C7D72] font-mono">{ord.customer_phone || "—"}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium truncate max-w-[220px]">
                        {ord.product_name}
                      </div>
                      <div className="text-[11px] text-[#8C7D72]">Qty: {ord.quantity}</div>
                    </td>
                    <td className="py-3.5 text-[#6E635A]">
                      {ord.delivery_city || "India"}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={ord.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-[#8C7D72] text-[11px]">
                      {formatDate(ord.created_at)}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.customer_phone && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
                            title="Chat with customer on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                          </a>
                        )}
                        <Link
                          href={`/orders?search=${ord.order_id}`}
                          className="py-1 px-3 rounded-lg bg-[#181615] hover:bg-[#9E3B24] text-white text-[11px] font-semibold transition-colors"
                        >
                          Manage
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="block md:hidden space-y-3.5">
          {orders.slice(0, 6).map((ord) => {
            const waUrl = generateWhatsAppUrl(
              ord.customer_phone || "",
              generateCustomerWhatsAppUpdate(ord, ord.status)
            );

            return (
              <div 
                key={ord.order_id} 
                className="p-4 rounded-xl border border-[#E6DFC8]/80 bg-[#FFFDF9] hover:bg-[#F8F5EE]/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-[#9E3B24]">
                      #{ord.order_id}
                    </span>
                    {(() => {
                      const chan = (ord.preferred_channel || "whatsapp").toLowerCase().replace("_form", "");
                      if (chan === "instagram") {
                        return (
                          <span className="text-[9px] font-semibold text-[#BE185D] bg-[#FDF2F8] px-1.5 py-0.5 rounded border border-[#FBCFE8]">
                            📸 Insta
                          </span>
                        );
                      }
                      if (chan === "email") {
                        return (
                          <span className="text-[9px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                            📧 Email
                          </span>
                        );
                      }
                      return (
                        <span className="text-[9px] font-semibold text-[#1B7E3E] bg-[#E8F8EE] px-1.5 py-0.5 rounded border border-[#C3EBD0]">
                          💬 WhatsApp
                        </span>
                      );
                    })()}
                  </div>
                  <StatusBadge status={ord.status} size="sm" />
                </div>
                
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-[#1C1917]">
                    {ord.customer_name}
                  </div>
                  {ord.customer_phone && (
                    <div className="text-[11px] text-[#8C7D72] font-mono">{ord.customer_phone}</div>
                  )}
                  <div className="text-[11px] text-[#6E635A]">
                    {ord.product_name} <span className="text-[#8C7D72]">(Qty: {ord.quantity})</span>
                  </div>
                  {ord.delivery_city && (
                    <div className="text-[11px] text-[#8C7D72] flex items-center gap-1">
                      📍 {ord.delivery_city}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#E6DFC8]/60">
                  <span className="text-[10px] text-[#8C7D72]">
                    {formatDate(ord.created_at)}
                  </span>
                  <div className="flex items-center gap-2">
                    {ord.customer_phone && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                      </a>
                    )}
                    <Link
                      href={`/orders?search=${ord.order_id}`}
                      className="py-1 px-3 rounded-lg bg-[#181615] hover:bg-[#9E3B24] text-white text-[11px] font-semibold transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={(newProd) => addProduct(newProd)}
      />
    </div>
  );
}
