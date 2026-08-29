"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/creations/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturedCreationsSection: React.FC = () => {
  const { getFeaturedProducts, products } = useStore();
  const featured = getFeaturedProducts().slice(0, 6);
  const displayItems = featured.length > 0 ? featured : products.slice(0, 6);

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] font-normal leading-tight">
              A few things we&apos;ve made{" "}
              <span className="italic text-[#C84B31]">with love</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5C4F46] max-w-lg">
              Explore our most cherished handmade hoops, everlasting crochet blooms, and thoughtful keepsakes.
            </p>
          </div>

          <Link
            href="/creations"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1F1D1B] hover:text-[#C84B31] transition-colors group self-start md:self-end"
          >
            <span className="thread-underline">View All Creations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayItems.map((prod, index) => (
            <ProductCard key={prod.id} product={prod} priority={index < 3} />
          ))}
        </div>
      </div>
    </section>
  );
};
