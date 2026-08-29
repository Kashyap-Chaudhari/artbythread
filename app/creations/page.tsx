"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/creations/ProductCard";
import { CreationCategory } from "@/lib/types";
import { Search, SlidersHorizontal, Sparkles, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/layout/Footer";

function CreationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as CreationCategory) || "all";

  const { products, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");

  // Sync category state with URL search param
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === "all") {
      router.push("/creations", { scroll: false });
    } else {
      router.push(`/creations?category=${slug}`, { scroll: false });
    }
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    if (!prod.is_published) return false;
    
    // Category match
    const categoryMatch = selectedCategory === "all" || prod.category === selectedCategory;
    
    // Search query match
    const query = searchQuery.trim().toLowerCase();
    const searchMatch = !query || (
      prod.name.toLowerCase().includes(query) ||
      prod.short_description.toLowerCase().includes(query) ||
      prod.tags.some((t) => t.toLowerCase().includes(query))
    );

    return categoryMatch && searchMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortBy === "price-desc") {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    // Default featured
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  const categoryFilterList = [
    { slug: "all", name: "All Creations" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-28 pb-16 px-4 sm:px-6 lg:px-12 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#8C7D72] text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Studio Catalog</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Made one thread <span className="italic text-[#C84B31]">at a time.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C4F46]">
            Explore handmade pieces created with patience, color, and care. Every piece can be customized or ordered directly through WhatsApp or Instagram.
          </p>
        </div>

        {/* Filters and Search Bar Controls */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] p-4 sm:p-5 mb-10 shadow-xs space-y-4">
          
          {/* Top row: Search input + Sort dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[#8C7D72] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, tag, or material..."
                className="w-full bg-[#FAF7F2] pl-10 pr-9 py-2 rounded-full border border-[#E8E0D5] text-xs text-[#1F1D1B] placeholder-[#A3968B] focus:outline-none focus:border-[#C84B31]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7D72] hover:text-[#1F1D1B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-[#8C7D72] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] py-2 px-3 rounded-full focus:outline-none focus:border-[#C84B31]"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Creations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom row: Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categoryFilterList.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs whitespace-nowrap font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-[#1F1D1B] text-[#FAF7F2] shadow-xs"
                      : "bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#5C4F46] border border-[#E8E0D5]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-[#8C7D72] mb-6 px-1">
          <span>
            Showing <strong className="text-[#1F1D1B]">{sortedProducts.length}</strong> creations
            {selectedCategory !== "all" && (
              <> in <strong className="text-[#C84B31] capitalize">{selectedCategory.replace("-", " ")}</strong></>
            )}
          </span>

          {(selectedCategory !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                router.push("/creations", { scroll: false });
              }}
              className="text-[#C84B31] hover:underline flex items-center gap-1 font-medium"
            >
              <X className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {sortedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty state */
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] p-12 text-center max-w-lg mx-auto space-y-4 my-12">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center mx-auto text-[#C84B31]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#1F1D1B]">
                We&apos;re stitching something new.
              </h3>
              <p className="text-xs text-[#8C7D72] mt-1">
                No creations found matching your filter criteria. Try clearing filters or request a bespoke creation!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-full bg-[#C84B31] text-[#FAF7F2] text-xs font-medium hover:bg-[#1F1D1B] transition-colors"
            >
              Show All Creations
            </button>
          </div>
        )}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}

export default function CreationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] pt-32 text-center">Loading creations...</div>}>
      <CreationsContent />
    </Suspense>
  );
}
