"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { ArrowRight, Eye } from "lucide-react";
import { motion } from "framer-motion";

export const GalleryPreviewSection: React.FC = () => {
  const { galleryItems } = useStore();
  const displayItems = galleryItems.slice(0, 6);

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FFFDF9] border-t border-[#E8E0D5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
              Studio Glimpses
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] font-normal leading-tight">
              From the <span className="italic text-[#C84B31]">Studio Table</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5C4F46] max-w-lg">
              Behind the scenes, works in progress, delicate stitches, and customer unboxing moments.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1F1D1B] hover:text-[#C84B31] transition-colors group self-start md:self-end"
          >
            <span className="thread-underline">Explore Full Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Masonry / Editorial Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E0D5] aspect-square"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#1F1D1B]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-between text-[#FAF7F2]">
                <span className="text-[10px] uppercase tracking-widest text-[#E4929A] font-semibold">
                  {item.category}
                </span>

                <div>
                  <h4 className="font-serif text-base sm:text-lg text-[#FAF7F2] font-normal leading-snug">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-[#FAF7F2]/80 mt-1 line-clamp-2 hidden sm:block">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
