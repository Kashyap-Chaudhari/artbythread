"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = isAdminAuthenticated();
    setAuthenticated(isAuth);
    setIsAuthChecked(true);

    if (!isAuth && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#C84B31]/30 border-t-[#C84B31] rounded-full animate-spin" />
      </div>
    );
  }

  // If on login page, render without sidebar/header
  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Desktop Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
