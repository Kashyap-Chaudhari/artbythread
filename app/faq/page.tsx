"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl } from "@/lib/utils";
import { Sparkles, ChevronDown, Search, MessageCircle, HelpCircle } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const { faqs, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Ordering & WhatsApp",
    "Custom Requests",
    "Care & Materials",
    "Shipping & Timeline",
  ];

  const filteredFaqs = faqs.filter((faq) => {
    if (!faq.is_published) return false;
    const categoryMatch = selectedCategory === "All" || faq.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const queryMatch = !query || faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    "Hi ArtByThread.7! I have a question about ordering handmade creations."
  );

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#8C7D72] text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Help & Ordering Guide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Frequently Asked <span className="italic text-[#C84B31]">Questions</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C4F46]">
            Everything you need to know about our slow handmade process, placing orders via WhatsApp, shipping timelines, and custom commissions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="w-4 h-4 text-[#8C7D72] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. shipping, custom, materials)..."
            className="w-full bg-[#FFFDF9] pl-10 pr-4 py-2.5 rounded-full border border-[#E8E0D5] text-xs text-[#1F1D1B] placeholder-[#A3968B] focus:outline-none focus:border-[#C84B31] shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#1F1D1B] text-[#FAF7F2]"
                    : "bg-[#FFFDF9] hover:bg-[#EFE8DE] text-[#5C4F46] border border-[#E8E0D5]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] overflow-hidden transition-shadow shadow-xs hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-medium block">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-[#1F1D1B] font-normal">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180 bg-[#C84B31] text-[#FAF7F2] border-[#C84B31]" : "text-[#5C4F46]"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5C4F46] leading-relaxed border-t border-[#FAF7F2]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] p-6 space-y-2">
              <HelpCircle className="w-8 h-8 text-[#8C7D72] mx-auto" />
              <h4 className="font-serif text-lg text-[#1F1D1B]">
                No matching questions found
              </h4>
              <p className="text-xs text-[#8C7D72]">
                Have a specific question? Ask us directly on WhatsApp!
              </p>
            </div>
          )}
        </div>

        {/* Still have questions CTA */}
        <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-dashed border-[#D6C7B7] text-center space-y-3">
          <h3 className="font-serif text-2xl text-[#1F1D1B]">
            Still have questions in mind?
          </h3>
          <p className="text-xs text-[#5C4F46] max-w-sm mx-auto">
            We are always happy to chat and answer any questions about our handmade creations or custom options.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-medium tracking-wide shadow-xs hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
