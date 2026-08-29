"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#E8E0D5] hover:border-[#C84B31]/40 transition-all duration-300 shadow-[0_2px_10px_rgba(61,52,45,0.03)] hover:shadow-[0_12px_30px_rgba(61,52,45,0.08)]"
    >
      {/* 1. Image Container */}
      <Link href={`/creation/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-[#F4EFEA] block">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_bestseller && (
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-[#1F1D1B] text-[#FAF7F2] rounded-full uppercase tracking-wider shadow-xs">
              Bestseller
            </span>
          )}
          {product.is_new && (
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-[#C84B31] text-[#FAF7F2] rounded-full uppercase tracking-wider shadow-xs">
              New Craft
            </span>
          )}
        </div>

        {/* Availability indicator */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          {product.is_available ? (
            <span className="px-2 py-0.5 text-[9px] font-medium bg-[#FFFDF9]/90 backdrop-blur-xs text-[#5E7A68] rounded-full border border-[#7D9D8B]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7D9D8B]" />
              Available
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[9px] font-medium bg-[#FFFDF9]/90 backdrop-blur-xs text-[#A3968B] rounded-full border border-[#E8E0D5]">
              Made to Order
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
          <span className="text-[#FAF7F2] text-xs font-medium tracking-wide flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            <span>Handmade with love</span>
          </span>
        </div>
      </Link>

      {/* 2. Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[11px] uppercase tracking-widest text-[#8C7D72] font-medium block mb-1 capitalize">
            {product.category.replace("-", " ")}
          </span>

          {/* Title */}
          <Link href={`/creation/${product.slug}`} className="block group-hover:text-[#C84B31] transition-colors">
            <h3 className="font-serif text-lg sm:text-xl text-[#1F1D1B] leading-snug font-normal">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#5C4F46] line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {product.short_description}
          </p>
        </div>

        {/* Action Footer — price removed, enquire label + View button */}
        <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between gap-2">
          <span className="text-[10px] text-[#8C7D72] italic font-serif">
            ✦ Enquire to order
          </span>
          <Link
            href={`/creation/${product.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#1F1D1B] text-[#3D342D] hover:text-[#FAF7F2] text-xs font-medium border border-[#E8E0D5] hover:border-[#1F1D1B] transition-all duration-200 group/btn shrink-0"
          >
            <span>View Creation</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
