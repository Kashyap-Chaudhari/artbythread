"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const CategoriesSection: React.FC = () => {
  const { categories } = useStore();

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FFFDF9] border-t border-[#E8E0D5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
            Explore By Medium
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Curated Categories of <span className="italic text-[#C84B31]">Slow Craft</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5C4F46]">
            Every category represents distinct handmade techniques — from traditional French knot embroidery to modern crochet floral sculpting.
          </p>
        </div>

        {/* Editorial Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const isCustom = cat.slug === "custom";
            const targetUrl = isCustom ? "/custom" : `/creations?category=${cat.slug}`;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={targetUrl}
                  className="group relative flex flex-col h-80 rounded-2xl overflow-hidden border border-[#E8E0D5] hover:border-[#C84B31]/40 shadow-xs hover:shadow-lg transition-all duration-300 bg-[#FAF7F2]"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/85 via-[#1F1D1B]/30 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 p-6 mt-auto flex flex-col justify-end text-[#FAF7F2]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-[#E4929A] font-semibold">
                        {isCustom ? "Bespoke Request" : "Explore Category"}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F2]/20 backdrop-blur-xs flex items-center justify-center text-[#FAF7F2] group-hover:bg-[#C84B31] transition-colors">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-[#FAF7F2] mt-1 font-normal">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#FAF7F2]/80 mt-1 line-clamp-2">
                      {cat.tagline}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
