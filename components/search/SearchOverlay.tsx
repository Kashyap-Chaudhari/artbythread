"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, Tag, ExternalLink } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, categories } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  // Filter products by query
  const trimmedQuery = query.trim().toLowerCase();
  const matchingProducts = trimmedQuery
    ? products.filter(
        (p) =>
          p.is_published &&
          (p.name.toLowerCase().includes(trimmedQuery) ||
            p.short_description.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery) ||
            p.tags.some((t) => t.toLowerCase().includes(trimmedQuery)))
      )
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-[#1F1D1B]/50 backdrop-blur-sm"
          />

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-2xl border border-[#E8E0D5] overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[#E8E0D5] bg-[#FAF7F2]">
              <Search className="w-5 h-5 text-[#8C7D72] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search embroidery hoops, crochet flowers, bag charms, gifts..."
                className="w-full bg-transparent text-[#1F1D1B] placeholder-[#A3968B] text-base focus:outline-none font-normal"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-[#8C7D72] hover:text-[#1F1D1B]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="px-2.5 py-1 text-xs text-[#8C7D72] hover:text-[#1F1D1B] bg-[#EFE8DE]/60 rounded-md"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
              
              {/* If no query, show popular categories and popular tags */}
              {!trimmedQuery && (
                <div className="space-y-5">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium block mb-3">
                      Popular Categories
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/creations?category=${cat.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="px-3 py-1.5 rounded-full text-xs bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D342D] border border-[#E8E0D5] transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium block mb-3">
                      Featured Pieces
                    </span>
                    <div className="space-y-2">
                      {products.slice(0, 3).map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/creation/${prod.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-[#EFE8DE]">
                              <Image
                                src={prod.images[0]?.url || ""}
                                alt={prod.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#1F1D1B] group-hover:text-[#C84B31] transition-colors">
                                {prod.name}
                              </p>
                              <span className="text-xs text-[#8C7D72]">
                                {formatPrice(prod.price)}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#8C7D72] group-hover:text-[#C84B31] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* If query has matches */}
              {trimmedQuery && matchingProducts.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium block mb-3">
                    Found {matchingProducts.length} creation{matchingProducts.length > 1 ? "s" : ""}
                  </span>
                  <div className="space-y-2">
                    {matchingProducts.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/creation/${prod.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#E8E0D5] transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 bg-[#EFE8DE]">
                            <Image
                              src={prod.images[0]?.url || ""}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1F1D1B] group-hover:text-[#C84B31] transition-colors">
                              {prod.name}
                            </p>
                            <p className="text-xs text-[#8C7D72] line-clamp-1">
                              {prod.short_description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-3">
                          <span className="text-xs font-semibold text-[#1F1D1B]">
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Zero-result State */}
              {trimmedQuery && matchingProducts.length === 0 && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center mx-auto text-[#C84B31]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-[#1F1D1B]">
                      We couldn&apos;t find that piece.
                    </h4>
                    <p className="text-sm text-[#8C7D72] mt-1">
                      Maybe it&apos;s waiting to be made just for you.
                    </p>
                  </div>
                  <Link
                    href="/custom"
                    onClick={() => setIsSearchOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C84B31] text-[#FAF7F2] text-xs font-medium tracking-wide hover:bg-[#1F1D1B] transition-colors"
                  >
                    <span>Request Something Custom</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div className="px-5 py-3 bg-[#FAF7F2] border-t border-[#E8E0D5] flex items-center justify-between text-[11px] text-[#8C7D72]">
              <span>Handcrafted one thread at a time</span>
              <span>artbythread.7 studio</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
