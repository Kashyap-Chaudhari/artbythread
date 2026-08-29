"use client";

import React from "react";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { generateInstagramUrl } from "@/lib/utils";
import { ArrowUpRight, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { motion } from "framer-motion";

export const InstagramGridSection: React.FC = () => {
  const { settings, trackEvent } = useStore();
  const instagramUrl = settings.instagram_url || generateInstagramUrl(settings.instagram_username);

  const instagramPosts = [
    {
      id: "ig-1",
      image: "/products/orchid-bouquet-never-fades.jpg",
      caption: "A bouquet that never fades 🌸 Handmade with love, wrapped in silk gold ribbon.",
      likes: "420",
    },
    {
      id: "ig-2",
      image: "/products/red-rose-black-wrap.jpg",
      caption: "Single crimson rose wrapped in dramatic black parchment cone 🌹",
      likes: "612",
    },
    {
      id: "ig-3",
      image: "/products/alphabet-keychain-template.jpg",
      caption: "100% handmade crochet alphabet letter keychains — custom names & initials 🔤",
      likes: "589",
    },
    {
      id: "ig-4",
      image: "/products/sunflower-keychain.jpg",
      caption: "Sunshine sunflower keychain — pure sunshine in your pocket 🌻",
      likes: "504",
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FFFDF9] border-t border-[#E8E0D5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
              <InstagramIcon className="w-3.5 h-3.5 text-[#E4929A]" />
              <span>Instagram Community</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] font-normal leading-tight">
              From our little <span className="italic text-[#C84B31]">thread world</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5C4F46] max-w-lg">
              Daily studio work, stitch tutorials, and new piece announcements.
            </p>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("instagram_click", { source: "instagram_section_header" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#1F1D1B] text-[#3D342D] hover:text-[#FAF7F2] text-xs font-medium border border-[#E8E0D5] hover:border-[#1F1D1B] transition-all duration-200 group self-start md:self-end"
          >
            <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
            <span>Follow {settings.instagram_username}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* 4-Column Instagram Visual Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("instagram_click", { source: "instagram_grid_item" })}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E0D5] block"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Hover Caption Overlay */}
              <div className="absolute inset-0 bg-[#1F1D1B]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-[#FAF7F2]">
                <div className="flex justify-end">
                  <div className="w-7 h-7 rounded-full bg-[#FAF7F2]/20 backdrop-blur-xs flex items-center justify-center">
                    <InstagramIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#E4929A] font-medium">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{post.likes} likes</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
