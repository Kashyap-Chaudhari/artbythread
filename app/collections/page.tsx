"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function CollectionsPage() {
  const { collections, products } = useStore();

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#8C7D72] text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Thematic Series</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Curated <span className="italic text-[#C84B31]">Collections</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C4F46]">
            Themed groupings of handmade creations designed for milestone gifting, botanical decor, and everyday tokens of love.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="space-y-12">
          {collections.map((col, index) => {
            const colProducts = products.filter((p) => col.product_ids?.includes(p.id));

            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] overflow-hidden shadow-xs hover:shadow-md transition-shadow p-6 sm:p-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Collection Visual (5 cols) */}
                  <div className="lg:col-span-5 relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E0D5]">
                    <Image
                      src={col.image_url}
                      alt={col.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/50 via-transparent to-transparent" />
                    
                    {col.is_featured && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-[#1F1D1B] text-[#FAF7F2] text-[10px] uppercase font-semibold tracking-wider rounded-full">
                        Featured Series
                      </span>
                    )}
                  </div>

                  {/* Right Collection Details (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#C84B31] font-semibold">
                        {col.tagline}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif text-[#1F1D1B] mt-1 font-normal">
                        {col.name}
                      </h2>
                    </div>

                    <p className="text-sm text-[#5C4F46] leading-relaxed">
                      {col.description}
                    </p>

                    {/* Preview product pills */}
                    {colProducts.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] uppercase tracking-wider text-[#8C7D72] font-semibold block">
                          Included Pieces ({colProducts.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {colProducts.map((p) => (
                            <Link
                              key={p.id}
                              href={`/creation/${p.slug}`}
                              className="px-3 py-1 rounded-full text-xs bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] border border-[#E8E0D5] transition-colors"
                            >
                              {p.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Link
                        href={`/creations?collection=${col.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-medium tracking-wide transition-colors group"
                      >
                        <span>Explore All Pieces in Collection</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
