"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Camera, Palette, HeartHandshake, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const CustomSpotlightSection: React.FC = () => {
  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] relative overflow-hidden">
      
      {/* Background Thread Motif */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-20">
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          <circle cx="200" cy="200" r="160" stroke="#C84B31" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M 40 200 C 120 100, 280 300, 360 200" stroke="#7D9D8B" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 sm:p-12 lg:p-16 shadow-[0_4px_25px_rgba(61,52,45,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Offer (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#C84B31] text-xs uppercase tracking-widest font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Studio Commissions</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] leading-tight font-normal">
              Your Memory.{" "}
              <span className="block italic text-[#C84B31]">Turned Into Thread.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#5C4F46] leading-relaxed">
              Have a cherished photo, special milestone date, favourite flower, or sentiment you would love to preserve in handmade thread? Send us your idea and let us stitch a one-of-a-kind heirloom piece for you.
            </p>

            {/* Custom Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-1.5">
                <Camera className="w-5 h-5 text-[#C84B31]" />
                <h4 className="text-xs font-semibold text-[#1F1D1B] uppercase tracking-wide">Photo Translating</h4>
                <p className="text-[11px] text-[#8C7D72]">Sketched & mapped into needle stitch patterns.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-1.5">
                <Palette className="w-5 h-5 text-[#7D9D8B]" />
                <h4 className="text-xs font-semibold text-[#1F1D1B] uppercase tracking-wide">Custom Palette</h4>
                <p className="text-[11px] text-[#8C7D72]">Tailored yarn & cotton thread floss shades.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-1.5">
                <HeartHandshake className="w-5 h-5 text-[#D47A85]" />
                <h4 className="text-xs font-semibold text-[#1F1D1B] uppercase tracking-wide">Artist Preview</h4>
                <p className="text-[11px] text-[#8C7D72]">Draft sketches shared before stitching.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/custom"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C84B31] hover:bg-[#1F1D1B] text-[#FAF7F2] text-sm font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Start a Custom Request</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/gallery"
                className="text-xs text-[#5C4F46] hover:text-[#C84B31] font-medium thread-underline"
              >
                View past custom creations →
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Collage (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden border border-[#E8E0D5] shadow-lg bg-[#FAF7F2]">
              <Image
                src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=85"
                alt="Custom Thread Artwork in Progress"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/60 via-transparent to-transparent" />
              
              {/* Badge on Image */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl glass-embroidery border border-[#E8E0D5]/80 text-[#1F1D1B]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#C84B31]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Handcrafted Bespoke Art</span>
                </div>
                <p className="text-[11px] text-[#5C4F46] mt-0.5">
                  Over 15,000 individual stitches woven into each portrait hoop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
