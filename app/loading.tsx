"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col items-center justify-center select-none">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Animated Thread Loop drawing logo motif */}
          <circle cx="50" cy="50" r="38" stroke="#E8E0D5" strokeWidth="2" strokeDasharray="3 3" />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            stroke="#C84B31"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: [0, 1, 0], rotate: 360 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Tiny central knot */}
          <circle cx="50" cy="50" r="3.5" fill="#E4929A" />
        </svg>
      </div>

      <div className="text-center mt-3 space-y-1">
        <span className="font-serif text-lg tracking-tight text-[#1F1D1B] block">
          artbythread<span className="text-[#C84B31]">.7</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7D72]">
          Threading happiness...
        </span>
      </div>
    </div>
  );
}
