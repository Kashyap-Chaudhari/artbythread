"use client";

import React from "react";
import { motion } from "framer-motion";

interface ThreadDividerProps {
  variant?: "curve" | "straight" | "loop";
  color?: string;
  className?: string;
}

export const ThreadDivider: React.FC<ThreadDividerProps> = ({
  variant = "curve",
  color = "#D6C7B7",
  className = "",
}) => {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center my-6 py-2 select-none ${className}`}>
      {variant === "curve" && (
        <svg
          viewBox="0 0 1200 40"
          className="w-full h-8 opacity-80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 20 C 300 20, 450 35, 600 20 C 750 5, 900 20, 1200 20"
            stroke={color}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          {/* Centered Stitched Heart or Knot Accent */}
          <circle cx="600" cy="20" r="3" fill="#C84B31" />
        </svg>
      )}

      {variant === "loop" && (
        <svg
          viewBox="0 0 1200 50"
          className="w-full h-10 opacity-75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 25 L 560 25 C 580 25, 590 5, 600 25 C 610 45, 620 25, 640 25 L 1200 25"
            stroke={color}
            strokeWidth="1.25"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
          <circle cx="600" cy="25" r="2.5" fill="#E4929A" />
        </svg>
      )}

      {variant === "straight" && (
        <div className="w-full max-w-4xl mx-auto flex items-center gap-4 px-6">
          <div className="flex-1 h-[1px] border-b border-dashed border-[#D6C7B7]" />
          <span className="text-[#C84B31] text-xs">🪡</span>
          <div className="flex-1 h-[1px] border-b border-dashed border-[#D6C7B7]" />
        </div>
      )}
    </div>
  );
};
