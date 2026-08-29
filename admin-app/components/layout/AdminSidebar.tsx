"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Palette,
  BarChart3,
  LogOut,
  ExternalLink,
  Store,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { clearAdminSession } from "@/lib/auth";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { orders, customRequests } = useAdminStore();

  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const inProgressCount = orders.filter((o) => o.status === "in_progress").length;
  const newCustomCount = customRequests.filter((c) => c.status === "NEW").length;

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out of the Studio Admin Portal?")) {
      clearAdminSession();
      router.push("/login");
    }
  };

  const navLinks = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Orders Pipeline",
      href: "/orders",
      icon: Package,
      badge: newOrdersCount > 0 ? `${newOrdersCount} New` : undefined,
      badgeColor: "bg-[#C84B31] text-white",
    },
    {
      label: "Custom Commissions",
      href: "/custom-requests",
      icon: Palette,
      badge: newCustomCount > 0 ? `${newCustomCount}` : undefined,
      badgeColor: "bg-[#7D9D8B] text-white",
    },
    {
      label: "Products & Catalog",
      href: "/products",
      icon: Sparkles,
    },
    {
      label: "Studio Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
  ];

  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";

  return (
    <aside className="w-64 bg-[#1F1D1B] text-[#FAF7F2] flex flex-col justify-between h-screen sticky top-0 shrink-0 border-r border-[#3D342D] select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#3D342D]/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#D6C7B7] flex items-center justify-center text-[#C84B31] font-serif font-bold text-base">
              🧵
            </div>
            <div>
              <div className="font-serif text-lg text-[#FAF7F2] leading-none group-hover:text-[#E4929A] transition-colors">
                artbythread<span className="text-[#C84B31] font-sans font-bold">.7</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#A3968B] block mt-1">
                Studio Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
            Management
          </div>

          {navLinks.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#C84B31] text-[#FAF7F2] shadow-md shadow-[#C84B31]/20 font-semibold"
                    : "text-[#A3968B] hover:text-[#FAF7F2] hover:bg-[#3D342D]/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || "bg-[#3D342D] text-white"}`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 opacity-0 ${isActive ? "opacity-100" : ""}`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* In Studio Queue Widget */}
        <div className="mx-4 mt-2 p-3.5 rounded-2xl bg-[#3D342D]/50 border border-[#3D342D] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#A3968B]">In Studio Queue</span>
            <span className="font-mono font-bold text-[#E9C46A]">{inProgressCount} active</span>
          </div>
          <div className="w-full h-1.5 bg-[#1F1D1B] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E9C46A] rounded-full transition-all"
              style={{ width: `${Math.min(inProgressCount * 25, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Quick Links & Logout */}
      <div className="p-4 border-t border-[#3D342D]/80 space-y-2">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#A3968B] hover:text-[#FAF7F2] hover:bg-[#3D342D]/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-[#7D9D8B]" />
            <span>Open Public Store</span>
          </div>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock / Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
