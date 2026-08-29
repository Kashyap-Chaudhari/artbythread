"use client";

import React, { useState, useMemo } from "react";
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

export default function OrdersPipelinePage() {
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
      badge: "bg-[#FFF3CD] text-[#856404]",
    },
    {
      key: "confirmed",
      label: "2. Confirmed",
      count: orders.filter((o) => o.status === "confirmed").length,
      badge: "bg-[#F3E8FF] text-[#6B21A8]",
    },
    {
      key: "in_progress",
      label: "3. In Production",
      count: orders.filter((o) => o.status === "in_progress").length,
      badge: "bg-[#FEF3C7] text-[#92400E]",
    },
    {
      key: "shipped",
      label: "4. Dispatched",
      count: orders.filter((o) => o.status === "shipped").length,
      badge: "bg-[#E0F2FE] text-[#0369A1]",
    },
    {
      key: "delivered",
      label: "5. Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
      badge: "bg-[#E5EDE8] text-[#2E4B37]",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
            <Package className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Order Fulfillment</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B] mt-0.5">
            5-Stage Crafting Pipeline
          </h1>
          <p className="text-xs text-[#5C4F46]">
            Manage stage progressions, assign courier tracking numbers, and notify customers on WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refreshAllData()}
          disabled={isLoading}
          className="py-2.5 px-4 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F2] border border-[#E8E0D5] text-xs font-semibold text-[#1F1D1B] flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#C84B31]" : ""}`} />
          <span>Sync Live Database</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-[#FFFDF9] p-3 rounded-2xl border border-[#E8E0D5] shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key as OrderStatus | "all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#1F1D1B] text-[#FAF7F2] shadow-xs"
                  : "text-[#5C4F46] hover:bg-[#FAF7F2] hover:text-[#1F1D1B]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.2 text-[10px] rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : tab.badge || "bg-[#E8E0D5] text-[#1F1D1B]"
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
            placeholder="Filter by Order ID (AT7-...), Customer, Phone, City..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E8E0D5] text-xs text-[#5C4F46] font-medium outline-none focus:border-[#C84B31] shadow-2xs cursor-pointer"
          >
            <option value="all">All Channels</option>
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
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#C84B31] flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl text-[#1F1D1B]">No Orders Found</h3>
            <p className="text-xs text-[#8C7D72]">
              {searchTerm
                ? `No orders matching "${searchTerm}".`
                : activeStatus !== "all"
                ? `There are currently no orders in this pipeline stage.`
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
              className="py-2 px-4 rounded-full bg-[#1F1D1B] text-white text-xs font-semibold hover:bg-[#C84B31] transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
