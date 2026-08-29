"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const { refreshAllData, isLoading, orders } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/orders?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const newOrders = orders.filter((o) => o.status === "new");

  return (
    <header className="h-16 bg-[#FFFDF9] border-b border-[#E8E0D5] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md w-full relative">
        <Search className="w-4 h-4 text-[#8C7D72] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Order ID (AT7-...), Customer Name, Phone..."
          className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] placeholder:text-[#8C7D72] focus:outline-none focus:border-[#C84B31] transition-all"
        />
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Supabase / Offline Status Pill */}
        <div
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
            isSupabaseConfigured
              ? "bg-[#E5EDE8] text-[#2E4B37] border-[#C2D6C9]"
              : "bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]"
          }`}
          title={
            isSupabaseConfigured
              ? "Connected to Live Supabase Postgres Database"
              : "Running in Standalone Local Mock & LocalStorage Mode"
          }
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSupabaseConfigured ? "bg-[#2E4B37] animate-pulse" : "bg-[#D97706]"
            }`}
          />
          <span>{isSupabaseConfigured ? "Cloud DB Sync" : "Local Standalone Mode"}</span>
        </div>

        {/* Refresh Data Button */}
        <button
          type="button"
          onClick={() => refreshAllData()}
          disabled={isLoading}
          className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D342D] border border-[#E8E0D5] transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh Data from Database"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#C84B31]" : ""}`} />
        </button>

        {/* New Orders Quick Notification */}
        <Link
          href="/orders?status=new"
          className="relative p-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D342D] border border-[#E8E0D5] transition-colors"
          title={`${newOrders.length} New Orders`}
        >
          <Bell className="w-3.5 h-3.5" />
          {newOrders.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C84B31] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {newOrders.length}
            </span>
          )}
        </Link>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E8E0D5]">
          <div className="w-8 h-8 rounded-full bg-[#1F1D1B] text-[#FAF7F2] flex items-center justify-center font-serif text-xs font-bold shadow-xs">
            KC
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-[#1F1D1B] block leading-tight">
              Studio Owner
            </span>
            <span className="text-[10px] text-[#8C7D72] block leading-none">
              ArtByThread.7
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
