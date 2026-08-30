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

  const kpis = [
    {
      label: "Total Orders Logged",
      value: orders.length,
      sub: `${newOrders.length} requiring review`,
      icon: Package,
      bg: "bg-[#FAF7F2]",
      color: "text-[#1F1D1B]",
    },
    {
      label: "In Studio Queue",
      value: inProgressOrders.length + confirmedOrders.length,
      sub: `${inProgressOrders.length} currently stitching`,
      icon: Clock,
      bg: "bg-[#FEF3C7]/40",
      color: "text-[#D97706]",
    },
    {
      label: "Dispatched / En Route",
      value: shippedOrders.length,
      sub: "With courier tracking",
      icon: Truck,
      bg: "bg-[#E0F2FE]/40",
      color: "text-[#0284C7]",
    },
    {
      label: "Delivered Pieces",
      value: deliveredOrders.length,
      sub: "Completed orders",
      icon: CheckCircle2,
      bg: "bg-[#E5EDE8]/40",
      color: "text-[#2E4B37]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border border-[#E8E0D5] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Studio Operations Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
            Namaste, Studio Artisan 🧵
          </h1>
          <p className="text-xs text-[#5C4F46]">
            Here is your live summary of orders, handcrafting pipelines, and customer enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="py-2.5 px-4 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Creation</span>
          </button>

          <Link
            href="/orders"
            className="py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-xs font-semibold text-[#1F1D1B] border border-[#E8E0D5] transition-colors"
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
              className={`p-5 rounded-3xl border border-[#E8E0D5] ${kpi.bg} flex flex-col justify-between space-y-3 shadow-2xs`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#8C7D72]">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-serif font-bold ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[11px] text-[#8C7D72] mt-0.5">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5-Stage Pipeline Overview Strip */}
      <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#E8E0D5] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-[#1F1D1B]">
            Crafting Pipeline at a Glance
          </h2>
          <Link
            href="/orders"
            className="text-xs text-[#C84B31] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Open Pipeline View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            {
              stage: "1. New Enquiry",
              count: newOrders.length,
              bg: "bg-[#FFF3CD]",
              text: "text-[#856404]",
              href: "/orders?status=new",
            },
            {
              stage: "2. Confirmed",
              count: confirmedOrders.length,
              bg: "bg-[#F3E8FF]",
              text: "text-[#6B21A8]",
              href: "/orders?status=confirmed",
            },
            {
              stage: "3. In Production",
              count: inProgressOrders.length,
              bg: "bg-[#FEF3C7]",
              text: "text-[#92400E]",
              href: "/orders?status=in_progress",
            },
            {
              stage: "4. Dispatched",
              count: shippedOrders.length,
              bg: "bg-[#E0F2FE]",
              text: "text-[#0369A1]",
              href: "/orders?status=shipped",
            },
            {
              stage: "5. Delivered",
              count: deliveredOrders.length,
              bg: "bg-[#E5EDE8]",
              text: "text-[#2E4B37]",
              href: "/orders?status=delivered",
            },
          ].map((item) => (
            <Link
              key={item.stage}
              href={item.href}
              className={`p-4 rounded-2xl border border-[#E8E0D5] ${item.bg} hover:shadow-xs transition-all flex flex-col justify-between`}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${item.text}`}>
                {item.stage}
              </span>
              <div className={`text-2xl font-serif font-bold ${item.text} mt-2`}>
                {item.count}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-4">
          <div>
            <h2 className="font-serif text-xl text-[#1F1D1B]">
              Recent Orders & Enquiries
            </h2>
            <p className="text-xs text-[#8C7D72] mt-0.5">
              Showing the latest customer submissions
            </p>
          </div>

          <Link
            href="/orders"
            className="py-2 px-3.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-xs font-semibold text-[#1F1D1B] border border-[#E8E0D5] transition-colors"
          >
            View All ({orders.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E0D5] text-[#8C7D72] font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Creation</th>
                <th className="pb-3">City</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]/60 text-[#1F1D1B]">
              {orders.slice(0, 6).map((ord) => {
                const waUrl = generateWhatsAppUrl(
                  ord.customer_phone || "",
                  generateCustomerWhatsAppUpdate(ord, ord.status)
                );

                return (
                  <tr key={ord.order_id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-[#C84B31]">
                      #{ord.order_id}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold">{ord.customer_name}</div>
                      <div className="text-[11px] text-[#8C7D72]">{ord.customer_phone || "—"}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium truncate max-w-[220px]">
                        {ord.product_name}
                      </div>
                      <div className="text-[11px] text-[#8C7D72]">Qty: {ord.quantity}</div>
                    </td>
                    <td className="py-3.5 text-[#5C4F46]">
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
                            className="p-1.5 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
                            title="Chat with customer on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                          </a>
                        )}
                        <Link
                          href={`/orders?search=${ord.order_id}`}
                          className="py-1 px-2.5 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-white text-[11px] font-semibold transition-colors"
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
