"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Scissors,
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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
            <Scissors className="w-3.5 h-3.5 text-[#9E3B24]" />
            <span>Studio Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-0.5 font-normal">
            Creations & Catalog ({products.length})
          </h1>
          <p className="text-xs text-[#6E635A]">
            Manage handmade product listings, pricing, dimensions, and inventory availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 rounded-xl bg-[#181615] hover:bg-[#9E3B24] text-[#FAF7F2] text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#FFFDF9] p-2.5 rounded-2xl border border-[#E6DFC8] flex items-center gap-2 overflow-x-auto shadow-2xs">
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setCategoryFilter(c.slug)}
            className={`py-2 px-3.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === c.slug
                ? "bg-[#181615] text-[#FAF7F2] font-semibold shadow-2xs"
                : "text-[#6E635A] hover:bg-[#F8F5EE] hover:text-[#1C1917]"
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
            className="bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-4/3 w-full bg-[#F8F5EE] border-b border-[#E6DFC8] overflow-hidden">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {p.is_featured && (
                    <span className="px-2 py-0.5 rounded-md bg-[#9E3B24] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                      Featured
                    </span>
                  )}
                  {p.is_bestseller && (
                    <span className="px-2 py-0.5 rounded-md bg-[#E9C46A] text-[#1C1917] text-[9px] font-bold uppercase tracking-wider shadow-xs">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-2.5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold block">
                    {p.category_slug.replace(/-/g, " ")}
                  </span>
                  <h3 className="font-serif text-lg text-[#1C1917] mt-0.5 font-normal">
                    {p.name}
                  </h3>
                </div>

                <p className="text-xs text-[#6E635A] line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E6DFC8] text-xs">
                  <span className="font-serif font-bold text-base text-[#1C1917]">
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
            <div className="p-4 bg-[#F8F5EE] border-t border-[#E6DFC8] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleProductStatus(p.id, "is_available")}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  p.is_available
                    ? "bg-[#E8EDE6] text-[#24422D] hover:bg-[#d9e3d7]"
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
                  if (confirm(`Are you sure you want to remove "${p.name}" from the studio catalog?`)) {
                    deleteProduct(p.id);
                  }
                }}
                className="p-2 rounded-lg text-[#8C7D72] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
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
