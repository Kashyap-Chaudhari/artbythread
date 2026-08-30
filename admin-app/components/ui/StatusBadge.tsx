import React from "react";
import { OrderStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const s = (status || "new").toLowerCase();

  let label = "1. New Enquiry";
  let bg = "bg-[#FEF3C7]/70 text-[#92400E] border-[#FDE68A]";
  let dot = "bg-[#D97706]";

  if (s === "confirmed") {
    label = "2. Confirmed Slot";
    bg = "bg-[#EDE9FE]/80 text-[#5B21B6] border-[#DDD6FE]";
    dot = "bg-[#7C3AED]";
  } else if (s === "in_progress" || s === "in_production") {
    label = "3. Handcrafting";
    bg = "bg-[#FFEDD5]/80 text-[#9A3412] border-[#FED7AA]";
    dot = "bg-[#EA580C]";
  } else if (s === "shipped" || s === "dispatched") {
    label = "4. Dispatched (Courier)";
    bg = "bg-[#E0F2FE]/80 text-[#075985] border-[#BAE6FD]";
    dot = "bg-[#0284C7]";
  } else if (s === "delivered" || s === "completed") {
    label = "5. Delivered to Customer";
    bg = "bg-[#E8EDE6] text-[#24422D] border-[#CCD9CA]";
    dot = "bg-[#2D5A38]";
  } else if (s === "cancelled") {
    label = "Cancelled / Closed";
    bg = "bg-red-50 text-red-800 border-red-200";
    dot = "bg-red-500";
  }

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-xs font-semibold",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
    </span>
  );
};
