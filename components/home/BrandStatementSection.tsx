"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const BrandStatementSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="brand-statement"
      className="relative w-full py-20 sm:py-28 bg-[#FFFDF9] border-y border-[#E8E0D5] px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Background Stitched Texture */}
      <div className="absolute inset-0 bg-linen-pattern opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        
        {/* Needle & Thread Mini Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#8C7D72] text-xs uppercase tracking-widest font-medium"
        >
          <span>✨</span>
          <span>The Art of Slow Craft</span>
          <span>✨</span>
        </motion.div>

        {/* Large Editorial Brand Statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#1F1D1B] leading-tight font-normal"
        >
          Not factory-made.
          <span className="block italic text-[#C84B31] mt-1 font-serif">
            Made by hand.
          </span>
        </motion.h2>

        {/* Animated Underline Thread */}
        <div className="w-48 sm:w-64 h-4 mx-auto my-2">
          <svg viewBox="0 0 200 20" className="w-full h-full" fill="none">
            <motion.path
              d="M 0 10 C 50 18, 150 2, 200 10"
              stroke="#C84B31"
              strokeWidth="1.8"
              strokeDasharray={shouldReduceMotion ? "none" : "4 3"}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-[#5C4F46] max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Every piece carries the little details, patient hours, and intentional imperfections that make handmade things truly special and uniquely yours.
        </motion.p>
      </div>
    </section>
  );
};
