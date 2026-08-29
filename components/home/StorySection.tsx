"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const StorySection: React.FC = () => {
  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#E8E0D5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Tactile Photo Composition (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-3/4 rounded-3xl overflow-hidden border border-[#E8E0D5] shadow-lg bg-[#FFFDF9]">
            <Image
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=85"
              alt="Artisan hands stitching botanical embroidery hoop"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/50 via-transparent to-transparent" />
          </div>

          {/* Floating Craft Card */}
          <div className="hidden sm:block absolute -bottom-6 -right-6 p-5 rounded-2xl glass-embroidery border border-[#E8E0D5] shadow-xl max-w-[240px] text-[#1F1D1B]">
            <span className="text-xs uppercase tracking-widest text-[#C84B31] font-semibold block mb-1">
              Slow Craft Promise
            </span>
            <p className="text-xs text-[#5C4F46] leading-relaxed">
              Never rushed. Every knot and loop is guided by human care and patience.
            </p>
          </div>
        </div>

        {/* Right Column: Editorial Text (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Studio Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Why <span className="italic text-[#C84B31]">handmade?</span>
          </h2>

          <div className="space-y-4 text-base text-[#5C4F46] leading-relaxed">
            <p>
              In a world crowded with mass manufactured plastics and instant production, handmade things carry something quiet and irreplaceable: human time, undivided attention, and genuine heart.
            </p>
            <p>
              When you hold an embroidered hoop or a hand-crocheted bloom from ArtByThread.7, you are holding hours of quiet stitching, calibrated color harmonies, and threads woven with patience.
            </p>
            <p>
              Whether it&apos;s a bouquet that never withers, a monogram that celebrates a wedding date, or a pocket daisy keychain that brightens a busy workday — our creations are made to be treasured for years to come.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1F1D1B] hover:text-[#C84B31] transition-colors group"
            >
              <span className="thread-underline">Read Our Full Studio Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
