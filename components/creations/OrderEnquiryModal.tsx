"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderFormSchema, OrderFormValues } from "@/lib/validations/order";
import { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  X,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Phone,
  User,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { motion, AnimatePresence } from "framer-motion";

interface OrderEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  initialQuantity?: number;
  initialVariant?: string;
  initialChannel?: "whatsapp" | "instagram" | "email";
}

interface OrderSuccessData {
  order_id: string;
  tracking_url: string;
  whatsapp_url: string;
  whatsapp_message: string;
  instagram_text: string;
  instagram_url?: string;
  customer_email_sent: boolean;
  admin_email_sent: boolean;
}

export const OrderEnquiryModal: React.FC<OrderEnquiryModalProps> = ({
  isOpen,
  onClose,
  product,
  initialQuantity = 1,
  initialVariant = "Standard Size",
  initialChannel = "whatsapp",
}) => {
  const { settings, trackEvent } = useStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<OrderSuccessData | null>(null);
  const [copiedIg, setCopiedIg] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const rawPhoto = primaryImage?.url || "";
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://artbythread.com";
  const photoUrl = rawPhoto
    ? rawPhoto.startsWith("http")
      ? rawPhoto
      : `${currentOrigin}${rawPhoto.startsWith("/") ? "" : "/"}${rawPhoto}`
    : "";

  // React Hook Form + Zod Setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      preferred_channel: initialChannel || "whatsapp",
      quantity: initialQuantity || 1,
      customization_note: "",
      delivery_city: "",
      product_id: product.id || "",
      product_name: product.name || "Handmade Creation",
      product_photo_url: photoUrl,
      product_sku: product.sku || "",
      product_price: product.price ?? null,
      size_variant: initialVariant || "Standard Size",
      address: "",
      state: "",
      pincode: "",
      hp_field: "",
    },
  });

  const selectedChannel = watch("preferred_channel");
  const quantityValue = watch("quantity");

  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setCopiedIg(false);
      setCopiedLink(false);
      reset({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        preferred_channel: initialChannel || "whatsapp",
        quantity: initialQuantity || 1,
        customization_note: "",
        delivery_city: "",
        product_id: product.id || "",
        product_name: product.name || "Handmade Creation",
        product_photo_url: photoUrl,
        product_sku: product.sku || "",
        product_price: product.price ?? null,
        size_variant: initialVariant || "Standard Size",
        address: "",
        state: "",
        pincode: "",
        hp_field: "",
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialQuantity, initialVariant, initialChannel, product, photoUrl, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values: OrderFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to log order enquiry.");
      }

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C84B31", "#E4929A", "#E9C46A", "#7D9D8B"],
        });
      } catch {
        // Safe fallback
      }

      setSuccessData({
        order_id: data.order_id,
        tracking_url: data.tracking_url,
        whatsapp_url: data.whatsapp_url,
        whatsapp_message: data.whatsapp_message,
        instagram_text: data.instagram_text,
        instagram_url: data.instagram_url || settings.instagram_url,
        customer_email_sent: data.customer_email_sent,
        admin_email_sent: data.admin_email_sent,
      });

      trackEvent(
        values.preferred_channel === "whatsapp"
          ? "whatsapp_click"
          : values.preferred_channel === "instagram"
          ? "instagram_click"
          : "email_click",
        {
          order_id: data.order_id,
          product_name: values.product_name,
        }
      );
    } catch (err: unknown) {
      console.error("[ORDER SUBMIT ERROR]", err);
      const message = err instanceof Error ? err.message : "Failed to submit enquiry. Please try again or reach out on WhatsApp.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyInstagramText = () => {
    if (successData?.instagram_text) {
      navigator.clipboard.writeText(successData.instagram_text);
      setCopiedIg(true);
      setTimeout(() => setCopiedIg(false), 2500);
    }
  };

  const handleCopyTrackingLink = () => {
    if (successData?.tracking_url) {
      navigator.clipboard.writeText(successData.tracking_url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1F1D1B]/65 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Decorative Thread Banner */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#C84B31] via-[#E4929A] to-[#7D9D8B] shrink-0" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#8C7D72] hover:text-[#1F1D1B] transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header & Content */}
          <div className="p-5 sm:p-8 space-y-5 overflow-y-auto">
            {/* Auto-filled Product Summary Header */}
            <div className="flex items-center gap-3.5 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5]">
              {primaryImage && (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F4EFEA] shrink-0 border border-[#E8E0D5]">
                  <Image
                    src={primaryImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold block capitalize">
                  {product.category.replace("-", " ")} • ID: {product.sku || product.id.slice(0, 8)}
                </span>
                <h3 className="font-serif text-base sm:text-lg text-[#1F1D1B] truncate font-normal">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs font-semibold text-[#1F1D1B]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[10px] text-[#5E7A68] bg-[#E5EDE8] px-2 py-0.5 rounded-full font-medium">
                    Handmade on Order
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-[10px] text-[#8C7D72] uppercase tracking-wider font-semibold">
                  Qty
                </span>
                <div className="flex items-center gap-1 bg-[#FFFDF9] rounded-xl border border-[#E8E0D5] p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setValue("quantity", Math.max(1, quantityValue - 1))}
                    disabled={quantityValue <= 1}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D342D] flex items-center justify-center transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-semibold text-[#1F1D1B]">
                    {quantityValue}
                  </span>
                  <button
                    type="button"
                    onClick={() => setValue("quantity", Math.min(50, quantityValue + 1))}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D342D] flex items-center justify-center transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SUCCESS SCREEN VIEW */}
            {/* ========================================================================= */}
            {successData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-[#5E7A68]/15 text-[#5E7A68] flex items-center justify-center mx-auto border border-[#7D9D8B]/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-widest text-[#8C7D72] font-semibold">
                    Enquiry Logged • Studio Notified
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
                    Order ID: <span className="text-[#C84B31] font-mono font-bold">{successData.order_id}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C4F46] max-w-md mx-auto leading-relaxed">
                    Thank you! A confirmation email with the product photo and your order details has been dispatched.
                  </p>
                </div>

                {/* CHANNEL-SPECIFIC ACTION BUTTONS */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5] space-y-3 text-left">
                  {selectedChannel === "whatsapp" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1D1B]">
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>Send Pre-filled Order Summary to WhatsApp</span>
                      </div>
                      <p className="text-[12px] text-[#5C4F46] leading-relaxed">
                        Tap below to send your order summary directly to the studio WhatsApp. Our rich link preview automatically showcases your product photo in the chat!
                      </p>
                      <a
                        href={successData.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                        <span>💬 Confirm via WhatsApp ({settings.whatsapp_number})</span>
                      </a>
                    </div>
                  )}

                  {selectedChannel === "instagram" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1D1B]">
                        <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
                        <span>Message Us on Instagram DM</span>
                      </div>
                      <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#E8E0D5] font-mono text-[11px] text-[#3D342D] leading-relaxed">
                        {successData.instagram_text}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleCopyInstagramText}
                          className="py-2.5 px-4 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF7F2] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {copiedIg ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#5E7A68]" />
                              <span>Draft Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#8C7D72]" />
                              <span>Copy DM Draft</span>
                            </>
                          )}
                        </button>
                        <a
                          href={successData.instagram_url || settings.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-4 rounded-xl bg-[#1F1D1B] hover:bg-[#C84B31] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                          <InstagramIcon className="w-3.5 h-3.5 text-[#E4929A]" />
                          <span>Open Instagram DMs ↗</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedChannel === "email" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1D1B]">
                        <Mail className="w-4 h-4 text-[#C84B31]" />
                        <span>Email Confirmation Sent</span>
                      </div>
                      <p className="text-[12px] text-[#5C4F46] leading-relaxed">
                        We have sent your confirmation email with the order summary and product photo. Our studio owner will follow up directly via email with timing and manual payment details.
                      </p>
                    </div>
                  )}
                </div>

                {/* TRACKING PAGE LINK & CLOSE */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <Link
                    href={`/order/${successData.order_id}`}
                    onClick={onClose}
                    className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🔍 View Public Order Tracking Card</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#8C7D72]" />
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#1F1D1B] text-[#FAF7F2] hover:bg-[#C84B31] text-xs font-semibold transition-colors"
                  >
                    Done & Close
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ========================================================================= */
              /* ORDER ENQUIRY FORM (REACT HOOK FORM + ZOD) */
              /* ========================================================================= */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  {...register("hp_field")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Channel Radio Selector */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#8C7D72] font-semibold block mb-2">
                    Preferred Contact Channel <span className="text-[#C84B31]">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="preferred_channel"
                    render={({ field }) => (
                      <div className="grid grid-cols-3 gap-2">
                        {/* WhatsApp Option */}
                        <button
                          type="button"
                          onClick={() => field.onChange("whatsapp")}
                          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 ${
                            field.value === "whatsapp"
                              ? "bg-[#25D366]/10 border-[#25D366] text-[#1F1D1B] ring-1 ring-[#25D366]"
                              : "bg-[#FAF7F2] border-[#E8E0D5] text-[#5C4F46] hover:bg-[#FFFDF9]"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            {field.value === "whatsapp" && (
                              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1F1D1B]">WhatsApp</div>
                            <div className="text-[10px] text-[#8C7D72]">Fastest reply</div>
                          </div>
                        </button>

                        {/* Instagram Option */}
                        <button
                          type="button"
                          onClick={() => field.onChange("instagram")}
                          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 ${
                            field.value === "instagram"
                              ? "bg-[#1F1D1B]/5 border-[#1F1D1B] text-[#1F1D1B] ring-1 ring-[#1F1D1B]"
                              : "bg-[#FAF7F2] border-[#E8E0D5] text-[#5C4F46] hover:bg-[#FFFDF9]"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
                            {field.value === "instagram" && (
                              <span className="w-2 h-2 rounded-full bg-[#1F1D1B]" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1F1D1B]">Instagram</div>
                            <div className="text-[10px] text-[#8C7D72]">DM conversation</div>
                          </div>
                        </button>

                        {/* Email Option */}
                        <button
                          type="button"
                          onClick={() => field.onChange("email")}
                          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 ${
                            field.value === "email"
                              ? "bg-[#C84B31]/10 border-[#C84B31] text-[#1F1D1B] ring-1 ring-[#C84B31]"
                              : "bg-[#FAF7F2] border-[#E8E0D5] text-[#5C4F46] hover:bg-[#FFFDF9]"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <Mail className="w-4 h-4 text-[#C84B31]" />
                            {field.value === "email" && (
                              <span className="w-2 h-2 rounded-full bg-[#C84B31]" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1F1D1B]">Email</div>
                            <div className="text-[10px] text-[#8C7D72]">Detailed quote</div>
                          </div>
                        </button>
                      </div>
                    )}
                  />
                  {errors.preferred_channel && (
                    <p className="text-[11px] text-[#C84B31] mt-1">
                      {errors.preferred_channel.message}
                    </p>
                  )}
                </div>

                {/* Customer Details Form Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Name */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
                        Your Full Name <span className="text-[#C84B31]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Ananya Sharma"
                          {...register("customer_name")}
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border text-xs text-[#1F1D1B] outline-none transition-colors ${
                            errors.customer_name
                              ? "border-[#C84B31] focus:ring-1 focus:ring-[#C84B31]"
                              : "border-[#E8E0D5] focus:border-[#C84B31]"
                          }`}
                        />
                      </div>
                      {errors.customer_name && (
                        <p className="text-[10px] text-[#C84B31] mt-0.5">
                          {errors.customer_name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone / WhatsApp */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
                        Phone / WhatsApp <span className="text-[#C84B31]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          {...register("customer_phone")}
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border text-xs text-[#1F1D1B] outline-none transition-colors ${
                            errors.customer_phone
                              ? "border-[#C84B31] focus:ring-1 focus:ring-[#C84B31]"
                              : "border-[#E8E0D5] focus:border-[#C84B31]"
                          }`}
                        />
                      </div>
                      {errors.customer_phone && (
                        <p className="text-[10px] text-[#C84B31] mt-0.5">
                          {errors.customer_phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Email */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
                        Email Address <span className="text-[#C84B31]">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="ananya@example.com"
                        {...register("customer_email")}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border text-xs text-[#1F1D1B] outline-none transition-colors ${
                          errors.customer_email
                            ? "border-[#C84B31] focus:ring-1 focus:ring-[#C84B31]"
                            : "border-[#E8E0D5] focus:border-[#C84B31]"
                        }`}
                      />
                      {errors.customer_email && (
                        <p className="text-[10px] text-[#C84B31] mt-0.5">
                          {errors.customer_email.message}
                        </p>
                      )}
                    </div>

                    {/* Delivery City */}
                    <div>
                      <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
                        Delivery City <span className="text-[#C84B31]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, Bangalore, Jaipur"
                        {...register("delivery_city")}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border text-xs text-[#1F1D1B] outline-none transition-colors ${
                          errors.delivery_city
                            ? "border-[#C84B31] focus:ring-1 focus:ring-[#C84B31]"
                            : "border-[#E8E0D5] focus:border-[#C84B31]"
                        }`}
                      />
                      {errors.delivery_city && (
                        <p className="text-[10px] text-[#C84B31] mt-0.5">
                          {errors.delivery_city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Customization Note */}
                  <div>
                    <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
                      Customization Note (Initials, Thread Colors, Dates, Gift Message)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please embroider initials 'A & R' in blush pink thread, with gift ribbon wrapping."
                      {...register("customization_note")}
                      className={`w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border text-xs text-[#1F1D1B] outline-none transition-colors resize-none ${
                        errors.customization_note
                          ? "border-[#C84B31] focus:ring-1 focus:ring-[#C84B31]"
                          : "border-[#E8E0D5] focus:border-[#C84B31]"
                      }`}
                    />
                    {errors.customization_note && (
                      <p className="text-[10px] text-[#C84B31] mt-0.5">
                        {errors.customization_note.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Zero Payment / Studio Guarantee Info */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5] text-[11px] text-[#5C4F46] flex items-start gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-[#C84B31] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Zero-Risk Handmade Order:</strong> No online payment gateway is required. Our studio owner will review availability and confirm your handcrafting timeline on your chosen channel.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Logging Your Order & Sending Confirmations...</span>
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#E9C46A]" />
                      <span>
                        Place Handmade Order Enquiry ({formatPrice(product.price)})
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
