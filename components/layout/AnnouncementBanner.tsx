"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export const AnnouncementBanner: React.FC = () => {
  const { settings } = useStore();

  if (!settings.announcement_banner_enabled || !settings.announcement_banner_text) {
    return null;
  }

  return (
    <div className="w-full bg-[#1F1D1B] text-[#FAF7F2] py-2 px-4 text-xs font-medium tracking-wide text-center flex items-center justify-center gap-2 border-b border-[#3D342D] select-none z-50 relative">
      <Sparkles className="w-3.5 h-3.5 text-[#E9C46A] shrink-0" />
      <span className="truncate">{settings.announcement_banner_text}</span>
    </div>
  );
};
