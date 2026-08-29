"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Sparkles, Eye, X, ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { GalleryItem } from "@/lib/types";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const { galleryItems, settings, trackEvent } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    "All",
    "Finished Pieces",
    "Behind the Scenes",
    "Work in Progress",
    "Packaging",
    "Customer Moments",
  ];

  const filteredItems = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter((g) => g.category === selectedCategory);

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#8C7D72] text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Tactile Visual Diary</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Our Studio <span className="italic text-[#C84B31]">Gallery</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C4F46]">
            A Pinterest-style visual journal of finished artworks, delicate stitching in progress, mindful packaging, and customer unboxing moments.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#1F1D1B] text-[#FAF7F2] shadow-xs"
                    : "bg-[#FFFDF9] hover:bg-[#EFE8DE] text-[#5C4F46] border border-[#E8E0D5]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Masonry / Editorial Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-2xl overflow-hidden bg-[#FFFDF9] border border-[#E8E0D5] hover:border-[#C84B31]/40 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-4/5 w-full bg-[#EFE8DE]">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Overlay */}
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C84B31] font-semibold block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg text-[#1F1D1B] group-hover:text-[#C84B31] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {item.caption && (
                    <p className="text-xs text-[#8C7D72] mt-2 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <h3 className="font-serif text-2xl text-[#1F1D1B]">
              Our thread world is getting ready.
            </h3>
            <p className="text-xs text-[#8C7D72]">
              No images in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1D1B]/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-[#FFFDF9] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E0D5] flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Left Image */}
              <div className="relative w-full md:w-3/5 aspect-square md:aspect-auto min-h-[300px] bg-[#FAF7F2]">
                <Image
                  src={activeItem.image_url}
                  alt={activeItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Content */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#FFFDF9]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#C84B31] font-semibold">
                      {activeItem.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveItem(null)}
                      className="p-1 rounded-full text-[#8C7D72] hover:text-[#1F1D1B]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="font-serif text-2xl text-[#1F1D1B] leading-snug">
                    {activeItem.title}
                  </h3>

                  {activeItem.caption && (
                    <p className="text-xs text-[#5C4F46] leading-relaxed">
                      {activeItem.caption}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-[#E8E0D5] space-y-3">
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("instagram_click", { source: "gallery_lightbox" })}
                    className="w-full py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] text-xs font-medium border border-[#E8E0D5] flex items-center justify-center gap-2 transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-[#E4929A]" />
                    <span>View on Instagram</span>
                  </a>

                  <Link
                    href="/custom"
                    onClick={() => setActiveItem(null)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Request Piece Like This</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
