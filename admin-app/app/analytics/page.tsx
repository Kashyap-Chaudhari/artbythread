"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  Sparkles,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function AnalyticsPage() {
  const { orders, products, customRequests } = useAdminStore();

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "delivered" || o.status === "shipped").length;
  const activeQueue = orders.filter((o) => o.status === "in_progress" || o.status === "confirmed").length;

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, o) => acc + (o.quoted_price || 0), 0);

  // Channels
  const waCount = orders.filter((o) => (o.preferred_channel || "whatsapp").toLowerCase().replace("_form", "") === "whatsapp").length;
  const igCount = orders.filter((o) => (o.preferred_channel || "").toLowerCase().replace("_form", "") === "instagram").length;
  const emailCount = orders.filter((o) => (o.preferred_channel || "").toLowerCase().replace("_form", "") === "email").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
          <BarChart3 className="w-3.5 h-3.5 text-[#9E3B24]" />
          <span>Studio Insights</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-0.5 font-normal">
          Atelier Ledger & Reports
        </h1>
        <p className="text-xs text-[#6E635A]">
          Performance metrics on commissions, revenue, inbound channels, and handcrafting stages.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] space-y-2 shadow-2xs">
          <div className="text-[10px] font-semibold text-[#8C7D72] uppercase tracking-[0.2em]">
            Revenue Booked
          </div>
          <div className="text-3xl font-serif font-bold text-[#1C1917]">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] text-[#3A5A40] font-medium">
            Across {orders.length} orders
          </div>
        </div>

        <div className="p-6 bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] space-y-2 shadow-2xs">
          <div className="text-[10px] font-semibold text-[#8C7D72] uppercase tracking-[0.2em]">
            Fulfillment Rate
          </div>
          <div className="text-3xl font-serif font-bold text-[#24422D]">
            {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
          </div>
          <div className="text-[11px] text-[#8C7D72]">
            {completedOrders} delivered / dispatched
          </div>
        </div>

        <div className="p-6 bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] space-y-2 shadow-2xs">
          <div className="text-[10px] font-semibold text-[#8C7D72] uppercase tracking-[0.2em]">
            Crafting Queue
          </div>
          <div className="text-3xl font-serif font-bold text-[#9A3412]">
            {activeQueue} Pieces
          </div>
          <div className="text-[11px] text-[#8C7D72]">
            Currently on the hoop/loom
          </div>
        </div>

        <div className="p-6 bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] space-y-2 shadow-2xs">
          <div className="text-[10px] font-semibold text-[#8C7D72] uppercase tracking-[0.2em]">
            Catalog Creations
          </div>
          <div className="text-3xl font-serif font-bold text-[#9E3B24]">
            {products.length} Items
          </div>
          <div className="text-[11px] text-[#8C7D72]">
            Active across 4 categories
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Order Channel */}
        <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E6DFC8] space-y-4 shadow-2xs">
          <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
            Customer Inbound Channels
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5 text-[#25D366]">
                  <span>💬 WhatsApp Direct</span>
                </span>
                <span>{waCount} orders ({totalOrders > 0 ? Math.round((waCount / totalOrders) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#F8F5EE] rounded-full overflow-hidden border border-[#E6DFC8]">
                <div
                  className="h-full bg-[#25D366] rounded-full"
                  style={{ width: `${totalOrders > 0 ? (waCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5 text-[#9E3B24]">
                  <span>📸 Instagram Direct</span>
                </span>
                <span>{igCount} orders ({totalOrders > 0 ? Math.round((igCount / totalOrders) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#F8F5EE] rounded-full overflow-hidden border border-[#E6DFC8]">
                <div
                  className="h-full bg-[#9E3B24] rounded-full"
                  style={{ width: `${totalOrders > 0 ? (igCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5 text-[#8C7D72]">
                  <span>📧 Email Enquiry</span>
                </span>
                <span>{emailCount} orders ({totalOrders > 0 ? Math.round((emailCount / totalOrders) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#F8F5EE] rounded-full overflow-hidden border border-[#E6DFC8]">
                <div
                  className="h-full bg-[#8C7D72] rounded-full"
                  style={{ width: `${totalOrders > 0 ? (emailCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Studio Pipeline Breakdown */}
        <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E6DFC8] space-y-4 shadow-2xs">
          <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
            Pipeline Distribution
          </h3>

          <div className="space-y-3 pt-2">
            {[
              {
                stage: "Stage 1: New Enquiry",
                count: orders.filter((o) => o.status === "new").length,
                color: "bg-[#D97706]",
              },
              {
                stage: "Stage 2: Confirmed Slot",
                count: orders.filter((o) => o.status === "confirmed").length,
                color: "bg-[#7C3AED]",
              },
              {
                stage: "Stage 3: Handcrafting",
                count: orders.filter((o) => o.status === "in_progress").length,
                color: "bg-[#EA580C]",
              },
              {
                stage: "Stage 4: Dispatched (Courier)",
                count: orders.filter((o) => o.status === "shipped").length,
                color: "bg-[#0284C7]",
              },
              {
                stage: "Stage 5: Delivered",
                count: orders.filter((o) => o.status === "delivered").length,
                color: "bg-[#2D5A38]",
              },
            ].map((st) => (
              <div key={st.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#6E635A]">{st.stage}</span>
                  <span className="font-bold">{st.count} orders</span>
                </div>
                <div className="w-full h-2 bg-[#F8F5EE] rounded-full overflow-hidden border border-[#E6DFC8]">
                  <div
                    className={`h-full ${st.color} rounded-full`}
                    style={{ width: `${totalOrders > 0 ? (st.count / totalOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
