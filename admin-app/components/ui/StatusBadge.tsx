import React from "react";
import { OrderStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const s = (status || "new").toLowerCase();

  let label = "New Enquiry";
  let bg = "bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]";
  let dot = "bg-[#D97706]";
  let stageNumber = "Stage 1";

  if (s === "confirmed") {
    label = "Confirmed";
    bg = "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]";
    dot = "bg-[#9333EA]";
    stageNumber = "Stage 2";
  } else if (s === "in_progress" || s === "in_production") {
    label = "In Production";
    bg = "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]";
    dot = "bg-[#D97706]";
    stageNumber = "Stage 3";
  } else if (s === "shipped" || s === "dispatched") {
    label = "Dispatched";
    bg = "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]";
    dot = "bg-[#0284C7]";
    stageNumber = "Stage 4";
  } else if (s === "delivered" || s === "completed") {
    label = "Delivered";
    bg = "bg-[#E5EDE8] text-[#2E4B37] border-[#C2D6C9]";
    dot = "bg-[#2E4B37]";
    stageNumber = "Stage 5";
  } else if (s === "cancelled") {
    label = "Cancelled";
    bg = "bg-red-50 text-red-700 border-red-200";
    dot = "bg-red-500";
    stageNumber = "Closed";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
      <span className="text-[9px] opacity-70 font-mono">({stageNumber})</span>
    </span>
  );
};
