"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Tag,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ProductModal } from "@/components/products/ProductModal";

export default function ProductsPage() {
  const { products, addProduct, toggleProductStatus, deleteProduct } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    { slug: "all", name: "All Categories" },
    { slug: "handkerchief-embroidery", name: "Handkerchief Embroidery" },
    { slug: "handmade-bouquets", name: "Crochet Bouquets" },
    { slug: "keychains-charms", name: "Keychains & Charms" },
    { slug: "botanical-hoops", name: "Embroidery Hoops" },
  ];

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "all" && p.category_slug !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Studio Catalog</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B] mt-0.5">
            Products & Handcrafted Pieces ({products.length})
          </h1>
          <p className="text-xs text-[#5C4F46]">
            Add new creations, edit prices, and manage availability across your online store.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold flex items-center gap-2 shadow-md transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#FFFDF9] p-3 rounded-2xl border border-[#E8E0D5] flex items-center gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategoryFilter(c.slug)}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === c.slug
                ? "bg-[#1F1D1B] text-[#FAF7F2]"
                : "text-[#5C4F46] hover:bg-[#FAF7F2] hover:text-[#1F1D1B]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-4/3 w-full bg-[#FAF7F2] border-b border-[#E8E0D5] overflow-hidden">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {p.is_featured && (
                    <span className="px-2 py-0.5 rounded-full bg-[#C84B31] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                      Featured
                    </span>
                  )}
                  {p.is_bestseller && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E9C46A] text-[#1F1D1B] text-[9px] font-bold uppercase tracking-wider shadow-xs">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold block">
                    {p.category_slug.replace(/-/g, " ")}
                  </span>
                  <h3 className="font-serif text-lg text-[#1F1D1B] mt-0.5">
                    {p.name}
                  </h3>
                </div>

                <p className="text-xs text-[#5C4F46] line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E0D5]/70 text-xs">
                  <span className="font-serif font-bold text-base text-[#1F1D1B]">
                    {formatPrice(p.price)}
                  </span>
                  <span className="text-[#8C7D72] flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{p.making_time || "3-5 days"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E0D5] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleProductStatus(p.id, "is_available")}
                className={`py-1.5 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  p.is_available
                    ? "bg-[#E5EDE8] text-[#2E4B37] hover:bg-[#d5e4db]"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                {p.is_available ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Out of Stock</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to remove "${p.name}" from the store catalog?`)) {
                    deleteProduct(p.id);
                  }
                }}
                className="p-2 rounded-full text-[#8C7D72] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Creation Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newProd) => addProduct(newProd)}
      />
    </div>
  );
}
