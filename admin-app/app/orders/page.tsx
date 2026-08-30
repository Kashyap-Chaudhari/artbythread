"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { OrderStatus } from "@/lib/types";
import { OrderCard } from "@/components/orders/OrderCard";

function OrdersPipelineContent() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as OrderStatus | "all") || "all";
  const initialSearch = searchParams.get("search") || "";

  const { orders, updateOrderStatus, deleteOrder, refreshAllData, isLoading } = useAdminStore();
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">(initialStatus);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const filterTabs = [
    { key: "all", label: "All Orders", count: orders.length },
    {
      key: "new",
      label: "1. New Enquiry",
      count: orders.filter((o) => o.status === "new").length,
      badge: "bg-[#FEF3C7] text-[#92400E]",
    },
    {
      key: "confirmed",
      label: "2. Confirmed",
      count: orders.filter((o) => o.status === "confirmed").length,
      badge: "bg-[#EDE9FE] text-[#5B21B6]",
    },
    {
      key: "in_progress",
      label: "3. Handcrafting",
      count: orders.filter((o) => o.status === "in_progress").length,
      badge: "bg-[#FFEDD5] text-[#9A3412]",
    },
    {
      key: "shipped",
      label: "4. Dispatched",
      count: orders.filter((o) => o.status === "shipped").length,
      badge: "bg-[#E0F2FE] text-[#075985]",
    },
    {
      key: "delivered",
      label: "5. Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
      badge: "bg-[#E8EDE6] text-[#24422D]",
    },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Status Filter
      if (activeStatus !== "all" && ord.status !== activeStatus) {
        return false;
      }

      // 2. Channel Filter
      if (channelFilter !== "all" && ord.preferred_channel !== channelFilter) {
        return false;
      }

      // 3. Search Filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchId = ord.order_id.toLowerCase().includes(q);
        const matchName = ord.customer_name.toLowerCase().includes(q);
        const matchPhone = (ord.customer_phone || "").toLowerCase().includes(q);
        const matchCity = (ord.delivery_city || "").toLowerCase().includes(q);
        const matchProduct = ord.product_name.toLowerCase().includes(q);
        return matchId || matchName || matchPhone || matchCity || matchProduct;
      }

      return true;
    });
  }, [orders, activeStatus, channelFilter, searchTerm]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
            <Package className="w-3.5 h-3.5 text-[#9E3B24]" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-0.5 font-normal">
            Orders & Stitching Pipeline
          </h1>
          <p className="text-xs text-[#6E635A]">
            Manage 5-stage workshop transitions, courier dispatches, and WhatsApp updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refreshAllData()}
          disabled={isLoading}
          className="py-2.5 px-4 rounded-xl bg-[#FFFDF9] hover:bg-[#F8F5EE] border border-[#E6DFC8] text-xs font-semibold text-[#1C1917] flex items-center gap-2 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#9E3B24]" : ""}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-[#FFFDF9] p-2.5 rounded-2xl border border-[#E6DFC8] shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key as OrderStatus | "all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#181615] text-[#FAF7F2] shadow-2xs"
                  : "text-[#6E635A] hover:bg-[#F8F5EE] hover:text-[#1C1917]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.2 text-[10px] rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : tab.badge || "bg-[#E6DFC8] text-[#1C1917]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Channel Secondary Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#8C7D72] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID (AT7-...), Customer, Phone, City..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6DFC8] text-xs text-[#1C1917] outline-none focus:border-[#9E3B24] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E6DFC8] text-xs text-[#6E635A] font-medium outline-none focus:border-[#9E3B24] shadow-2xs cursor-pointer"
          >
            <option value="all">All Inbound Channels</option>
            <option value="whatsapp">💬 WhatsApp Orders</option>
            <option value="instagram">📸 Instagram Orders</option>
            <option value="email">📧 Email Inquiries</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOrders.map((ord) => (
            <OrderCard
              key={ord.order_id}
              order={ord}
              onUpdateStatus={updateOrderStatus}
              onDelete={deleteOrder}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] p-12 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F8F5EE] border border-[#E6DFC8] text-[#9E3B24] flex items-center justify-center mx-auto text-2xl">
            🧵
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-[#1C1917]">No Orders Found</h3>
            <p className="text-xs text-[#8C7D72]">
              {searchTerm
                ? `No orders matching "${searchTerm}".`
                : activeStatus !== "all"
                ? `There are currently no orders in this crafting stage.`
                : "No customer orders logged yet."}
            </p>
          </div>
          {(searchTerm || activeStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveStatus("all");
                setChannelFilter("all");
              }}
              className="py-2 px-4 rounded-xl bg-[#181615] text-white text-xs font-semibold hover:bg-[#9E3B24] transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPipelinePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#9E3B24]/30 border-t-[#9E3B24] rounded-full animate-spin" />
        </div>
      }
    >
      <OrdersPipelineContent />
    </Suspense>
  );
}
