"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  formatPrice,
  generateWhatsAppUrl,
  generateWhatsAppMessage,
  generateInstagramUrl,
  generateInstagramCopyText,
  generateEmailUrl,
} from "@/lib/utils";
import {
  MessageCircle,
  Mail,
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Share2,
  ZoomIn,
  Truck,
  Palette,
  Copy,
  Check,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { ProductCard } from "@/components/creations/ProductCard";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { OrderEnquiryModal } from "@/components/creations/OrderEnquiryModal";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { getProductBySlug, products, settings, trackEvent } = useStore();
  const product = getProductBySlug(slug);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("Standard Size");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryChannel, setEnquiryChannel] = useState<"whatsapp" | "instagram" | "email">("whatsapp");
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedIgText, setCopiedIgText] = useState<boolean>(false);

  if (!product) {
    return notFound();
  }

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://artbythread.com";
  const productUrl = `${currentOrigin}/creation/${product.slug}`;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.is_published && p.category === product.category)
    .slice(0, 3);

  const currentImage = product.images[activeImageIndex] || product.images[0];
  const fullImageUrl = currentImage?.url
    ? currentImage.url.startsWith("http")
      ? currentImage.url
      : `${currentOrigin}${currentImage.url.startsWith("/") ? "" : "/"}${currentImage.url}`
    : "";

  // Exact WhatsApp pre-filled message with absolute image URL and order specs
  const whatsappMessage = generateWhatsAppMessage({
    productName: product.name,
    quantity,
    sizeOrVariant: selectedVariant,
    price: product.price,
    productUrl,
    imageUrl: fullImageUrl,
  });
  const whatsappUrl = generateWhatsAppUrl(settings.whatsapp_number, whatsappMessage);

  // Instagram message & URL
  const instagramText = generateInstagramCopyText({
    productName: product.name,
    quantity,
    sizeOrVariant: selectedVariant,
    productUrl,
    imageUrl: fullImageUrl,
  });
  const instagramUrl = settings.instagram_url || generateInstagramUrl(settings.instagram_username);

  // Email enquiry mailto URL
  const emailSubject = `✨ Order Enquiry — ${product.name} | ArtByThread.7`;
  const emailBody = `Hi ArtByThread.7,\n\nI would love to enquire about ordering:\n\nProduct: ${product.name}\nProduct ID: ${product.sku || product.id.slice(0, 8)}\nQuantity: ${quantity}\nSize/Variant: ${selectedVariant}\nProduct URL: ${productUrl}\nPhoto: ${fullImageUrl}\n\nPlease share the price, availability, crafting time, and delivery details!\n\nThank you!`;
  const emailUrl = generateEmailUrl(settings.email_contact, emailSubject, emailBody);

  const openEnquiry = (channel: "whatsapp" | "instagram" | "email" = "whatsapp") => {
    setEnquiryChannel(channel);
    setIsEnquiryModalOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyIgMsg = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(instagramText);
      setCopiedIgText(true);
      setTimeout(() => setCopiedIgText(false), 2500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        
        {/* Back Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#8C7D72]">
          <Link
            href="/creations"
            className="inline-flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Creations</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Home</span>
            <span className="hidden sm:inline">/</span>
            <Link href={`/creations?category=${product.category}`} className="hover:text-[#C84B31] capitalize">
              {product.category.replace("-", " ")}
            </Link>
            <span>/</span>
            <span className="text-[#1F1D1B] font-medium truncate max-w-[140px] sm:max-w-none">
              {product.name}
            </span>
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
          
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Frame */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E8E0D5] shadow-sm group">
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || product.name}
                  fill
                  priority
                  className="object-cover"
                />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.is_bestseller && (
                  <span className="px-3 py-1 text-xs font-semibold bg-[#1F1D1B] text-[#FAF7F2] rounded-full uppercase tracking-wider shadow-xs">
                    Bestseller
                  </span>
                )}
                {product.is_new && (
                  <span className="px-3 py-1 text-xs font-semibold bg-[#C84B31] text-[#FAF7F2] rounded-full uppercase tracking-wider shadow-xs">
                    New Craft
                  </span>
                )}
              </div>

              {/* Zoom Trigger */}
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-[#FFFDF9]/90 backdrop-blur-xs text-[#3D342D] hover:text-[#C84B31] border border-[#E8E0D5] shadow-xs transition-colors"
                title="Zoom view"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={img.id || index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#FFFDF9] border-2 shrink-0 transition-all ${
                      activeImageIndex === index
                        ? "border-[#C84B31] shadow-xs"
                        : "border-[#E8E0D5] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Studio Craft Story */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C84B31] font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Made Slowly. Made Special.</span>
              </div>
              <h3 className="font-serif text-xl text-[#1F1D1B]">
                The Inspiration & Story
              </h3>
              <p className="text-sm text-[#5C4F46] leading-relaxed">
                {product.story ||
                  "Every single petal and stitch in this creation is made slowly by hand. We use natural cotton fibers, wooden hoops, and gentle botanical shapes that honor the quiet beauty of slow living."}
              </p>
            </div>
          </div>

          {/* Right Column: Product Details & Order Direct Actions */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* Header info */}
            <div className="space-y-2 border-b border-[#E8E0D5] pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-semibold capitalize">
                  {product.category.replace("-", " ")} • ID: {product.sku || product.id.slice(0, 8)}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="text-xs text-[#8C7D72] hover:text-[#C84B31] flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "Link Copied! ✓" : "Share"}</span>
                </button>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1D1B] font-normal leading-tight">
                {product.name}
              </h1>

              {/* Price & Availability Status */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-2xl sm:text-3xl font-serif font-semibold text-[#1F1D1B]">
                  {formatPrice(product.price)}
                </span>
                {product.is_available ? (
                  <span className="text-xs text-[#5E7A68] flex items-center gap-1 font-medium bg-[#E5EDE8] px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#7D9D8B]" />
                    Ready to Ship / Made on Order
                  </span>
                ) : (
                  <span className="text-xs text-[#A3968B] bg-[#EFE8DE] px-3 py-1 rounded-full">
                    Custom Order Queue
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-[#5C4F46] leading-relaxed">
              {product.description}
            </p>

            {/* Size / Variant Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3D342D] block">
                Select Size / Variant:
              </label>
              <div className="flex flex-wrap gap-2">
                {(product.variants && product.variants.length > 0
                  ? product.variants
                  : [{ name: "Standard 8-inch Hoop" }, { name: "Mini 5-inch Posy" }, { name: "Grand 10-inch Frame" }]
                ).map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedVariant === v.name
                        ? "bg-[#1F1D1B] text-[#FAF7F2] border-[#1F1D1B] shadow-xs"
                        : "bg-[#FFFDF9] text-[#5C4F46] border-[#E8E0D5] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {v.name} {v.price ? `(₹${v.price})` : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* DIRECT ORDER CHANNELS (NO LOGIN / NO ONLINE CHECKOUT) */}
            <div className="p-6 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8E0D5] space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#8C7D72] font-medium border-b border-[#E8E0D5]/60 pb-3">
                <span>Handmade Studio Direct Order</span>
                <span className="text-[#C84B31] font-semibold">No Login Required</span>
              </div>

              {/* PRIMARY CTA: Order / Enquire Now */}
              <button
                type="button"
                onClick={() => openEnquiry("whatsapp")}
                className="w-full py-4 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E9C46A]" />
                <span>🧵 Order / Enquire Now</span>
              </button>

              {/* DIRECT CONTACT BUTTONS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {/* 💬 WhatsApp */}
                <button
                  type="button"
                  onClick={() => openEnquiry("whatsapp")}
                  className="py-3 px-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold tracking-wide shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>💬 WhatsApp</span>
                </button>

                {/* 📸 Instagram */}
                <button
                  type="button"
                  onClick={() => openEnquiry("instagram")}
                  className="py-3 px-3 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
                  <span>📸 Instagram</span>
                </button>

                {/* 📧 Email */}
                <button
                  type="button"
                  onClick={() => openEnquiry("email")}
                  className="py-3 px-3 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#C84B31]" />
                  <span>📧 Email</span>
                </button>
              </div>

              {/* Instagram Copy DM helper */}
              <div className="flex items-center justify-between text-[11px] text-[#8C7D72] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E0D5]">
                <span className="truncate pr-2">📸 Copy DM message for Instagram</span>
                <button
                  type="button"
                  onClick={handleCopyIgMsg}
                  className="text-[#C84B31] font-semibold hover:underline flex items-center gap-1 shrink-0"
                >
                  {copiedIgText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5E7A68]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-[#8C7D72] pt-1 italic font-serif">
                ✦ Studio owner manually confirms price, availability & payment details on chat or email.
              </p>
            </div>

            {/* Specifications & Craft Details */}
            <div className="space-y-3 pt-2 text-xs text-[#5C4F46]">
              {/* Crafting Time */}
              <div className="py-2.5 border-b border-[#E8E0D5] flex items-start justify-between">
                <span className="font-semibold text-[#1F1D1B] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8C7D72]" />
                  Crafting Time
                </span>
                <span className="font-medium text-[#1F1D1B]">{product.making_time}</span>
              </div>

              {/* Estimated Delivery */}
              <div className="py-2.5 border-b border-[#E8E0D5] flex items-start justify-between">
                <span className="font-semibold text-[#1F1D1B] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#8C7D72]" />
                  Estimated Delivery
                </span>
                <span>5-8 business days across India</span>
              </div>

              {/* Customization Availability */}
              <div className="py-2.5 border-b border-[#E8E0D5] flex items-start justify-between">
                <span className="font-semibold text-[#1F1D1B] flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#C84B31]" />
                  Customization
                </span>
                <span className="text-right max-w-[60%]">
                  {product.customization_options || "Initials, dates, and thread color choices available."}
                </span>
              </div>

              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div className="py-2.5 border-b border-[#E8E0D5] flex items-start justify-between">
                  <span className="font-semibold text-[#1F1D1B]">Materials</span>
                  <span className="text-right max-w-[60%]">{product.materials.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Bespoke Custom Link */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#D6C7B7] text-center space-y-1">
              <p className="text-xs font-medium text-[#1F1D1B]">
                Want a custom portrait or completely bespoke design?
              </p>
              <Link href="/custom" className="text-xs text-[#C84B31] font-semibold hover:underline block">
                Start a Custom Commission Request →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Creations Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[#E8E0D5] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
                  More in {product.category.replace("-", " ")}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B] font-normal">
                  Related Handmade Pieces
                </h3>
              </div>
              <Link
                href={`/creations?category=${product.category}`}
                className="text-xs text-[#C84B31] hover:underline font-medium"
              >
                View all in category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Lightbox */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1D1B]/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] w-full aspect-square bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl"
            >
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || product.name}
                  fill
                  className="object-contain"
                />
              )}
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="absolute top-4 right-4 px-4 py-2 bg-[#1F1D1B] text-[#FAF7F2] rounded-full text-xs font-medium shadow-md"
              >
                Close (ESC)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Enquiry Modal */}
      <OrderEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
        initialQuantity={quantity}
        initialVariant={selectedVariant}
        initialChannel={enquiryChannel}
      />

      {/* Sticky Bottom Bar on Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E8E0D5] flex items-center gap-2 shadow-lg">
        <button
          type="button"
          onClick={() => openEnquiry("whatsapp")}
          className="flex-1 py-3 px-4 rounded-full bg-[#1F1D1B] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
          <span>🧵 Order / Enquire</span>
        </button>

        <button
          type="button"
          onClick={() => openEnquiry("whatsapp")}
          className="p-3 rounded-full bg-[#25D366] text-white text-xs font-medium flex items-center justify-center shadow-xs cursor-pointer"
          title="WhatsApp Order"
        >
          <MessageCircle className="w-4 h-4 fill-white stroke-none" />
        </button>

        <button
          type="button"
          onClick={() => openEnquiry("instagram")}
          className="p-3 rounded-full bg-[#FAF7F2] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-medium flex items-center justify-center cursor-pointer"
          title="Instagram DM"
        >
          <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
        </button>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
