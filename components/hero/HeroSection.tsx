"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { HeroThreadAnimation } from "./HeroThreadAnimation";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl } from "@/lib/utils";

export const HeroSection: React.FC = () => {
  const { settings, trackEvent } = useStore();
  const shouldReduceMotion = useReducedMotion();

  // Desktop Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layers
  const hoopX = useTransform(smoothX, [-300, 300], [-8, 8]);
  const hoopY = useTransform(smoothY, [-300, 300], [-6, 6]);

  const decorX = useTransform(smoothX, [-300, 300], [12, -12]);
  const decorY = useTransform(smoothY, [-300, 300], [10, -10]);

  const spoolX = useTransform(smoothX, [-300, 300], [-15, 15]);
  const spoolY = useTransform(smoothY, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    settings.whatsapp_default_message
  );

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] md:min-h-screen w-full bg-canvas-texture flex flex-col justify-between pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* 1. Subtle Floating Craft Decorations (Desktop Parallax) */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Wooden Thread Spool (Top Left) */}
          <motion.div
            style={{ x: spoolX, y: spoolY }}
            className="absolute top-28 left-4 lg:left-16 opacity-30 lg:opacity-60 transition-opacity"
          >
            <svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Spool Wooden Top Rim */}
              <ellipse cx="40" cy="18" rx="28" ry="10" fill="#C49F75" stroke="#8C673B" strokeWidth="1.5" />
              <ellipse cx="40" cy="18" rx="10" ry="3.5" fill="#FAF7F2" stroke="#8C673B" strokeWidth="1" />
              {/* Spool Wound Thread Barrel */}
              <path d="M 16 18 L 16 72 C 16 78, 64 78, 64 72 L 64 18 Z" fill="#C84B31" opacity="0.85" />
              {/* Horizontal Thread Wraps */}
              <line x1="16" y1="28" x2="64" y2="28" stroke="#D95C42" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="16" y1="38" x2="64" y2="38" stroke="#D95C42" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="16" y1="48" x2="64" y2="48" stroke="#D95C42" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="16" y1="58" x2="64" y2="58" stroke="#D95C42" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Spool Wooden Bottom Rim */}
              <ellipse cx="40" cy="72" rx="28" ry="10" fill="#A88155" stroke="#8C673B" strokeWidth="1.5" />
              <ellipse cx="40" cy="72" rx="10" ry="3.5" fill="#3D342D" opacity="0.2" />
              {/* Unwinding Thread Tail leading into the page */}
              <path
                d="M 64 52 C 95 65, 120 40, 160 85"
                stroke="#C84B31"
                strokeWidth="1.75"
                strokeDasharray="4 3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>

          {/* Floating Stitched Blossom (Top Right) */}
          <motion.div
            style={{ x: decorX, y: decorY }}
            className="absolute top-36 right-6 lg:right-20 opacity-25 lg:opacity-50"
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="18" stroke="#D47A85" strokeWidth="1.5" strokeDasharray="3 4" />
              <path d="M 30 18 C 30 24, 30 36, 30 42" stroke="#7D9D8B" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 18 30 C 24 30, 36 30, 42 30" stroke="#7D9D8B" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="30" cy="30" r="4" fill="#E9C46A" />
            </svg>
          </motion.div>

          {/* Loose Stitched Thread Trail (Bottom Left) */}
          <motion.div
            style={{ x: decorX, y: decorY }}
            className="absolute bottom-28 left-8 lg:left-32 opacity-20 lg:opacity-40"
          >
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
              <path
                d="M 10 70 C 40 20, 80 80, 110 30"
                stroke="#7D9D8B"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>
      )}

      {/* 2. Main Hero Layout (Editorial Split on Desktop, Stacked on Mobile) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        
        {/* Left Editorial Content (Desktop 6 cols, Mobile Order 2) */}
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">
          
          {/* Subtle Tag / Studio Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center lg:justify-start gap-2.5 mb-5"
          >
            <span className="inline-block w-6 h-[1px] bg-[#C84B31]" />
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#8C7D72]">
              Handmade Embroidery & Botanical Studio
            </span>
            <span className="inline-block w-6 h-[1px] bg-[#C84B31] lg:hidden" />
          </motion.div>

          {/* Signature Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#1F1D1B] leading-[1.1] tracking-[-0.02em] mb-6 font-normal"
          >
            <span className="block italic">{settings.hero_headline_line1}</span>
            <span className="block font-medium text-[#C84B31]">
              {settings.hero_headline_line2}
            </span>
          </motion.h1>

          {/* Supporting Brand Copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="text-base sm:text-lg text-[#5C4F46] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8 font-normal"
          >
            {settings.hero_subheading}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6"
          >
            {/* Primary CTA: Explore Creations */}
            <Link
              href="/creations"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-sm tracking-wide font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Explore Creations</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA: Create Something Custom */}
            <Link
              href="/custom"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#D6C7B7] hover:border-[#C84B31] bg-[#FFFDF9]/80 hover:bg-[#FFFDF9] text-[#1F1D1B] hover:text-[#C84B31] text-sm tracking-wide font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>Create Something Custom</span>
            </Link>
          </motion.div>

          {/* Quick Direct Enquiry Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { source: "hero_quick_talk" })}
              className="text-xs text-[#8C7D72] hover:text-[#C84B31] transition-colors inline-flex items-center gap-1.5 font-medium group"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#7D9D8B] group-hover:text-[#C84B31] transition-colors" />
              <span className="thread-underline">Want to order something? Let&apos;s talk on WhatsApp →</span>
            </a>
          </motion.div>
        </div>

        {/* Right Artwork Centerpiece (Desktop 6 cols, Mobile Order 1) */}
        <motion.div
          style={{ x: hoopX, y: hoopY }}
          className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2 w-full"
        >
          <HeroThreadAnimation />
        </motion.div>
      </div>

      {/* 3. Bottom Scroll Indicator with Connected Thread Line Bridge */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center mt-6">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-1.5 cursor-pointer select-none"
          onClick={() => {
            const nextSec = document.getElementById("brand-statement");
            if (nextSec) nextSec.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#A3968B] font-medium">
            Scroll to discover
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#C84B31] to-transparent" />
        </motion.div>
      </div>

      {/* 4. Organic Thread Curve Bridge (Flows from Hero to Section 2) */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-0">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 30 C 360 60, 720 0, 1080 40 C 1260 60, 1380 20, 1440 30"
            stroke="#D6C7B7"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            strokeOpacity="0.75"
          />
        </svg>
      </div>
    </section>
  );
};
