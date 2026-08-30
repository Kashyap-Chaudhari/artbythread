"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types";
import { Sparkles, X, Plus, Scissors } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id" | "created_at">) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [categorySlug, setCategorySlug] = useState("handkerchief-embroidery");
  const [price, setPrice] = useState<string>("650");
  const [imageUrl, setImageUrl] = useState("/products/handkerchief-iloveu-embroidery.jpg");
  const [description, setDescription] = useState("");
  const [makingTime, setMakingTime] = useState("3-5 business days");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { slug: "handkerchief-embroidery", name: "Handkerchief Embroidery" },
    { slug: "handmade-bouquets", name: "Handmade Crochet Bouquets" },
    { slug: "keychains-charms", name: "Keychains & Charms" },
    { slug: "botanical-hoops", name: "Botanical Embroidery Hoops" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("Please provide a creation title and description.");
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    onSave({
      slug,
      name: name.trim(),
      category_slug: categorySlug,
      description: description.trim(),
      short_description: description.trim().slice(0, 100) + "...",
      price: price ? parseFloat(price) : null,
      image_url: imageUrl.trim() || "/products/handkerchief-iloveu-embroidery.jpg",
      is_available: true,
      is_published: true,
      is_featured: isFeatured,
      is_bestseller: isBestseller,
      is_new: true,
      making_time: makingTime,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E6DFC8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-[#9E3B24] flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#1C1917]">
                Add New Creation
              </h3>
              <p className="text-xs text-[#8C7D72]">
                Publish a piece to your online studio catalog
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#8C7D72] hover:text-[#1C1917] hover:bg-[#F8F5EE] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              Creation Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Personalized Daisy Embroidered Handkerchief"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] outline-none focus:border-[#9E3B24]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                Category *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] outline-none focus:border-[#9E3B24]"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                Price (INR ₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 650"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] outline-none focus:border-[#9E3B24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              Photo URL / Image Path *
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/products/handkerchief-iloveu-embroidery.jpg or https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] font-mono outline-none focus:border-[#9E3B24]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1">
              Description & Crafting Story *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the fabric, thread technique, materials, and customization possibilities..."
              className="w-full px-4 py-2 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] outline-none focus:border-[#9E3B24]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                Making Time
              </label>
              <input
                type="text"
                value={makingTime}
                onChange={(e) => setMakingTime(e.target.value)}
                placeholder="e.g. 3-5 business days"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] outline-none focus:border-[#9E3B24]"
              />
            </div>

            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 text-xs text-[#1C1917] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#9E3B24] focus:ring-[#9E3B24]"
                />
                <span>Featured Piece</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#1C1917] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded text-[#9E3B24] focus:ring-[#9E3B24]"
                />
                <span>Bestseller</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E6DFC8] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-[#F8F5EE] hover:bg-[#EDE5D6] text-xs font-semibold text-[#6E635A] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#181615] hover:bg-[#9E3B24] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save & Publish Creation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
