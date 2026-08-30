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
    <header className="h-16 bg-[#FFFDF9] border-b border-[#E6DFC8] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md w-full relative">
        <Search className="w-4 h-4 text-[#8C7D72] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Order ID (AT7-...), Customer Name, Phone, City..."
          className="w-full pl-9 pr-14 py-2 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] placeholder:text-[#8C7D72] focus:outline-none focus:border-[#9E3B24] focus:ring-1 focus:ring-[#9E3B24]/20 transition-all"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8C7D72] border border-[#DCD2BE] px-1.5 py-0.5 rounded bg-white font-mono">
          ↵
        </span>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Supabase / Offline Status Pill */}
        <div
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
            isSupabaseConfigured
              ? "bg-[#E8EDE6] text-[#24422D] border-[#CCD9CA]"
              : "bg-[#FEF3C7]/60 text-[#92400E] border-[#FDE68A]"
          }`}
          title={
            isSupabaseConfigured
              ? "Connected to Live Supabase Postgres Database"
              : "Running in Standalone Local Mock & LocalStorage Mode"
          }
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSupabaseConfigured ? "bg-[#2D5A38] animate-pulse" : "bg-[#D97706]"
            }`}
          />
          <span>{isSupabaseConfigured ? "Cloud DB Active" : "Local Studio Mode"}</span>
        </div>

        {/* Refresh Data Button */}
        <button
          type="button"
          onClick={() => refreshAllData()}
          disabled={isLoading}
          className="p-2 rounded-xl bg-[#F8F5EE] hover:bg-[#EDE5D6] text-[#3E3833] border border-[#E6DFC8] transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh Studio Database"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#9E3B24]" : ""}`} />
        </button>

        {/* New Orders Quick Notification */}
        <Link
          href="/orders?status=new"
          className="relative p-2 rounded-xl bg-[#F8F5EE] hover:bg-[#EDE5D6] text-[#3E3833] border border-[#E6DFC8] transition-colors"
          title={`${newOrders.length} New Orders Requiring Review`}
        >
          <Bell className="w-3.5 h-3.5" />
          {newOrders.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#9E3B24] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {newOrders.length}
            </span>
          )}
        </Link>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E6DFC8]">
          <div className="w-8 h-8 rounded-xl bg-[#181615] text-[#FAF7F2] flex items-center justify-center font-serif text-xs font-bold shadow-xs border border-[#3E3833]">
            🧵
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-[#1C1917] block leading-tight">
              Henvi & Kashyap
            </span>
            <span className="text-[10px] text-[#9E3B24] font-mono block leading-none mt-0.5">
              artbythread@7
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
