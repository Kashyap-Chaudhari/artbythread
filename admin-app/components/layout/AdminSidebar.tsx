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
  Scissors,
  Bookmark,
  X,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { clearAdminSession } from "@/lib/auth";
import { getStoreUrl } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { orders, customRequests } = useAdminStore();

  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const inProgressCount = orders.filter((o) => o.status === "in_progress").length;
  const newCustomCount = customRequests.filter((c) => c.status === "NEW").length;

  const handleLogout = () => {
    if (confirm("Are you sure you want to lock the Studio Admin Portal?")) {
      clearAdminSession();
      window.location.href = "/login";
    }
  };

  const navLinks = [
    {
      label: "Studio Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Orders Pipeline",
      href: "/orders",
      icon: Package,
      badge: newOrdersCount > 0 ? `${newOrdersCount} New` : undefined,
      badgeColor: "bg-[#9E3B24] text-[#FAF7F2]",
    },
    {
      label: "Bespoke Requests",
      href: "/custom-requests",
      icon: Palette,
      badge: newCustomCount > 0 ? `${newCustomCount}` : undefined,
      badgeColor: "bg-[#3A5A40] text-[#FAF7F2]",
    },
    {
      label: "Creations & Catalog",
      href: "/products",
      icon: Scissors,
    },
    {
      label: "Studio Ledger & Reports",
      href: "/analytics",
      icon: BarChart3,
    },
  ];

  const storeUrl = getStoreUrl();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-68 bg-[#181615] text-[#F5F2EB] flex flex-col justify-between h-screen shrink-0 border-r border-[#2B2622] select-none z-50 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-[#2B2622] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3.5 group" onClick={onClose}>
              <div className="w-10 h-10 rounded-2xl bg-[#231F1C] border border-[#3E3833] flex items-center justify-center text-xl shadow-inner group-hover:border-[#9E3B24] transition-colors">
                🧵
              </div>
              <div>
                <div className="font-serif text-xl text-[#F5F2EB] font-normal leading-tight tracking-tight">
                  artbythread<span className="text-[#B84A39] font-sans font-bold">.7</span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C7D72] block mt-1 font-medium">
                  Atelier Operations
                </span>
              </div>
            </Link>

            {/* Close Button (Mobile Only) */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl bg-[#231F1C] hover:bg-[#2A2420] text-[#9E9084] hover:text-[#FAF7F2] border border-[#3E3833] transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="p-4 space-y-1">
            <div className="px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#6E635A] font-semibold">
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
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#2A2420] text-[#F5F2EB] border border-[#443B34] shadow-xs font-semibold"
                      : "text-[#9E9084] hover:text-[#F5F2EB] hover:bg-[#221D1A]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#B84A39]" : "text-[#8C7D72]"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-0 text-[#6E635A] ${
                        isActive ? "opacity-100 text-[#B84A39]" : ""
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* In Studio Queue Widget */}
          <div className="mx-4 mt-3 p-4 rounded-2xl bg-[#221E1B] border border-[#2E2824] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9E9084] flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#E9C46A] animate-pulse" />
                On the Hoop / Loom
              </span>
              <span className="font-mono font-bold text-[#E9C46A]">{inProgressCount} pieces</span>
            </div>
            <p className="text-[11px] text-[#6E635A] leading-relaxed">
              Active handcrafted pieces currently being stitched in the studio.
            </p>
          </div>
        </div>

        {/* Footer Quick Links & Logout */}
        <div className="p-4 border-t border-[#2B2622] space-y-1.5 font-sans">
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-[#9E9084] hover:text-[#F5F2EB] hover:bg-[#221D1A] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#3A5A40]" />
              <span>Open Public Storefront</span>
            </div>
            <ExternalLink className="w-3 h-3 text-[#6E635A]" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs text-[#C27D7D] hover:text-red-300 hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Studio Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
