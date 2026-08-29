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
  const waCount = orders.filter((o) => o.preferred_channel === "whatsapp").length;
  const igCount = orders.filter((o) => o.preferred_channel === "instagram").length;
  const emailCount = orders.filter((o) => o.preferred_channel === "email" || !o.preferred_channel).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
          <BarChart3 className="w-3.5 h-3.5 text-[#C84B31]" />
          <span>Studio Insights</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B] mt-0.5">
          Performance & Crafting Velocity
        </h1>
        <p className="text-xs text-[#5C4F46]">
          Real-time metrics on orders, revenue, preferred channels, and handcrafting stages.
        </p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] space-y-2 shadow-2xs">
          <div className="text-xs font-semibold text-[#8C7D72] uppercase tracking-wider">
            Total Revenue Booked
          </div>
          <div className="text-3xl font-serif font-bold text-[#1F1D1B]">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[11px] text-[#7D9D8B] font-medium">
            Across {orders.length} orders
          </div>
        </div>

        <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] space-y-2 shadow-2xs">
          <div className="text-xs font-semibold text-[#8C7D72] uppercase tracking-wider">
            Fulfillment Rate
          </div>
          <div className="text-3xl font-serif font-bold text-[#2E4B37]">
            {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
          </div>
          <div className="text-[11px] text-[#8C7D72]">
            {completedOrders} delivered / dispatched
          </div>
        </div>

        <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] space-y-2 shadow-2xs">
          <div className="text-xs font-semibold text-[#8C7D72] uppercase tracking-wider">
            Active Crafting Queue
          </div>
          <div className="text-3xl font-serif font-bold text-[#D97706]">
            {activeQueue} Pieces
          </div>
          <div className="text-[11px] text-[#8C7D72]">
            Currently on the hoop/loom
          </div>
        </div>

        <div className="p-6 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] space-y-2 shadow-2xs">
          <div className="text-xs font-semibold text-[#8C7D72] uppercase tracking-wider">
            Catalog Creations
          </div>
          <div className="text-3xl font-serif font-bold text-[#C84B31]">
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
        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#E8E0D5] space-y-4 shadow-2xs">
          <h3 className="font-serif text-lg text-[#1F1D1B]">
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
              <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8E0D5]">
                <div
                  className="h-full bg-[#25D366] rounded-full"
                  style={{ width: `${totalOrders > 0 ? (waCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5 text-[#C84B31]">
                  <span>📸 Instagram DM</span>
                </span>
                <span>{igCount} orders ({totalOrders > 0 ? Math.round((igCount / totalOrders) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8E0D5]">
                <div
                  className="h-full bg-[#E4929A] rounded-full"
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
              <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8E0D5]">
                <div
                  className="h-full bg-[#8C7D72] rounded-full"
                  style={{ width: `${totalOrders > 0 ? (emailCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Studio Pipeline Breakdown */}
        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#E8E0D5] space-y-4 shadow-2xs">
          <h3 className="font-serif text-lg text-[#1F1D1B]">
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
                stage: "Stage 2: Confirmed",
                count: orders.filter((o) => o.status === "confirmed").length,
                color: "bg-[#9333EA]",
              },
              {
                stage: "Stage 3: In Production",
                count: orders.filter((o) => o.status === "in_progress").length,
                color: "bg-[#C84B31]",
              },
              {
                stage: "Stage 4: Dispatched",
                count: orders.filter((o) => o.status === "shipped").length,
                color: "bg-[#0284C7]",
              },
              {
                stage: "Stage 5: Delivered",
                count: orders.filter((o) => o.status === "delivered").length,
                color: "bg-[#2E4B37]",
              },
            ].map((st) => (
              <div key={st.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#5C4F46]">{st.stage}</span>
                  <span className="font-bold">{st.count} orders</span>
                </div>
                <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8E0D5]">
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
