"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, Clock, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl } from "@/lib/utils";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { settings } = useStore();
  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    "Hi ArtByThread.7! I read your studio story and would love to connect."
  );

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-20">
        
        {/* Story Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#8C7D72] text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Our Studio Story</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Little pieces of happiness,{" "}
            <span className="block italic text-[#C84B31]">created one thread at a time.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C4F46] leading-relaxed">
            Welcome to ArtByThread.7. We are an independent handmade art and botanical studio crafting slow, tactile treasures that bring gentle joy into everyday living.
          </p>
        </div>

        {/* Section 1: Where It Started */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 relative aspect-square rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E8E0D5] shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=85"
              alt="Artisan workspace with threads and embroidery hoops"
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#C84B31] font-semibold">
              01 — The Beginning
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1F1D1B] font-normal">
              Where it started
            </h2>
            <p className="text-sm text-[#5C4F46] leading-relaxed">
              ArtByThread.7 began with a simple wooden hoop, a few skeins of colored cotton thread, and a passion for turning quiet hours into tangible artwork.
            </p>
            <p className="text-sm text-[#5C4F46] leading-relaxed">
              What started as small botanical sketches on fabric quickly evolved into a dedicated studio offering personalized memory hoops, eternal crochet flower arrangements, and pocket-sized charms.
            </p>
          </div>
        </div>

        {/* Section 2: Why Thread? & Handmade Not Mass Made */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 order-2 md:order-1 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#7D9D8B] font-semibold">
              02 — Studio Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1F1D1B] font-normal">
              Handmade, not mass-made
            </h2>
            <p className="text-sm text-[#5C4F46] leading-relaxed">
              We deliberately reject the rush of mass production. When every flower petal is individually crocheted and every French knot is hand-looped, no two creations are ever entirely identical.
            </p>
            <p className="text-sm text-[#5C4F46] leading-relaxed">
              Those tiny variations aren&apos;t flaws — they are the authentic signature of human hands spending hours making something with care.
            </p>
          </div>

          <div className="md:col-span-6 order-1 md:order-2 relative aspect-square rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E8E0D5] shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=85"
              alt="Hands stitching botanical flower patterns"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Section 3: Core Studio Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center text-[#C84B31] mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#1F1D1B]">Made with Patience</h3>
            <p className="text-xs text-[#5C4F46] leading-relaxed">
              We never rush a piece. Each hoop and bouquet receives the dedicated time required to ensure tight, archival-grade stitching.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center text-[#7D9D8B] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#1F1D1B]">The Beauty of Small Details</h3>
            <p className="text-xs text-[#5C4F46] leading-relaxed">
              From delicate gradient thread blending to silk twill packaging ribbons, the magic lives inside the smallest details.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center text-[#D47A85] mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#1F1D1B]">Personal Connection</h3>
            <p className="text-xs text-[#5C4F46] leading-relaxed">
              Every customer speaks directly with the artist. We share sketch previews, confirm colors, and write handwritten gift notes.
            </p>
          </div>
        </div>

        {/* Craft Care Guide Anchor */}
        <div id="craft-care" className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#7D9D8B]" />
            <span>Care & Preservation Guide</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
            How to care for your thread art & crochet blooms
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#5C4F46] leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-semibold text-[#1F1D1B] text-sm">Embroidery Hoops & Wall Art</h4>
              <p>• Display indoors away from continuous direct harsh sunlight to preserve thread color vitality.</p>
              <p>• Gently dust with a soft cosmetic makeup brush or a dry microfiber cloth.</p>
              <p>• Avoid moisture and damp areas (do not place in high-humidity bathrooms).</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-[#1F1D1B] text-sm">Crochet Flowers & Forever Bouquets</h4>
              <p>• The internal craft wire allows gentle bending to fit ceramic vases of different heights.</p>
              <p>• If dusty, blow gently with a hairdryer on the coolest, lowest speed setting.</p>
              <p>• Do not submerge in water or machine wash.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 space-y-4">
          <h3 className="font-serif text-2xl text-[#1F1D1B]">
            Let&apos;s create something together.
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/creations"
              className="px-7 py-3.5 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-medium tracking-wide transition-colors"
            >
              Explore Creations
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full bg-[#25D366] text-white text-xs font-medium tracking-wide flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>Chat with the Studio</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
