"use client";

import React, { useState } from "react";
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
  MessageCircle,
  Mail,
  Copy,
  Check,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  ExternalLink,
  HeartHandshake,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { motion } from "framer-motion";

interface OrderPieceFormProps {
  product?: Product;
  defaultProductName?: string;
  defaultPhotoUrl?: string;
  defaultPrice?: number | null;
  onSuccess?: (orderId: string) => void;
}

export const OrderPieceForm: React.FC<OrderPieceFormProps> = ({
  product,
  defaultProductName = "Custom Handmade Creation",
  defaultPhotoUrl = "",
  defaultPrice = null,
  onSuccess,
}) => {
  const { settings, trackEvent } = useStore();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<{
    order_id: string;
    tracking_url: string;
    whatsapp_url: string;
    instagram_text: string;
    instagram_url?: string;
  } | null>(null);
  const [copiedIg, setCopiedIg] = useState<boolean>(false);

  const productName = product?.name || defaultProductName;
  const rawPhoto = product?.images?.[0]?.url || defaultPhotoUrl;
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://artbythread.com";
  const photoUrl = rawPhoto
    ? rawPhoto.startsWith("http")
      ? rawPhoto
      : `${currentOrigin}${rawPhoto.startsWith("/") ? "" : "/"}${rawPhoto}`
    : "";
  const price = product?.price ?? defaultPrice;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      preferred_channel: "whatsapp",
      quantity: 1,
      customization_note: "",
      delivery_city: "",
      product_id: product?.id || "",
      product_name: productName,
      product_photo_url: photoUrl,
      product_sku: product?.sku || "",
      product_price: price ?? null,
      size_variant: "Standard Size",
      address: "",
      state: "",
      pincode: "",
      hp_field: "",
    },
  });

  const selectedChannel = watch("preferred_channel");
  const quantity = watch("quantity");

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
        throw new Error(data.error || "Failed to submit order enquiry.");
      }

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#C84B31", "#E4929A", "#E9C46A", "#7D9D8B"],
        });
      } catch {
        // Safe fallback
      }

      setSuccessResult({
        order_id: data.order_id,
        tracking_url: data.tracking_url,
        whatsapp_url: data.whatsapp_url,
        instagram_text: data.instagram_text,
        instagram_url: data.instagram_url || settings.instagram_url,
      });

      if (onSuccess) {
        onSuccess(data.order_id);
      }

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
      console.error("[ORDER PIECE FORM ERROR]", err);
      const message = err instanceof Error ? err.message : "Failed to place order enquiry.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyIg = () => {
    if (successResult?.instagram_text) {
      navigator.clipboard.writeText(successResult.instagram_text);
      setCopiedIg(true);
      setTimeout(() => setCopiedIg(false), 2500);
    }
  };

  if (successResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 sm:p-8 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] shadow-md text-center space-y-5"
      >
        <div className="w-16 h-16 rounded-full bg-[#5E7A68]/15 text-[#5E7A68] flex items-center justify-center mx-auto border border-[#7D9D8B]/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
            Enquiry Received • Confirmation Dispatched
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
            Order ID: <span className="text-[#C84B31] font-mono font-bold">{successResult.order_id}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4F46] max-w-md mx-auto leading-relaxed">
            Thank you! An email with your order summary has been sent. Our studio artisan will confirm timing and payment details with you.
          </p>
        </div>

        <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5] text-left space-y-3">
          {selectedChannel === "whatsapp" && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-[#1F1D1B] block">
                💬 Complete on WhatsApp:
              </span>
              <a
                href={successResult.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Confirm via WhatsApp ({settings.whatsapp_number})</span>
              </a>
            </div>
          )}

          {selectedChannel === "instagram" && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-[#1F1D1B] block">
                📸 Instagram DM Order:
              </span>
              <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#E8E0D5] font-mono text-[11px] text-[#3D342D]">
                {successResult.instagram_text}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyIg}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFFDF9] hover:bg-[#FAF7F2] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedIg ? <Check className="w-3.5 h-3.5 text-[#5E7A68]" /> : <Copy className="w-3.5 h-3.5 text-[#8C7D72]" />}
                  <span>{copiedIg ? "Copied!" : "Copy DM Text"}</span>
                </button>
                <a
                  href={successResult.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#1F1D1B] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#E4929A]" />
                  <span>Open DMs ↗</span>
                </a>
              </div>
            </div>
          )}

          {selectedChannel === "email" && (
            <p className="text-xs text-[#5C4F46]">
              Confirmation email sent. Studio owner will follow up directly on your email address.
            </p>
          )}
        </div>

        <Link
          href={`/order/${successResult.order_id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#C84B31] hover:underline"
        >
          <span>View Public Order Summary & Live Tracking Card</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 sm:p-8 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] shadow-sm space-y-4"
    >
      <input type="text" {...register("hp_field")} className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
            Handmade Studio Order Form
          </span>
          <h3 className="font-serif text-lg sm:text-xl text-[#1F1D1B]">{productName}</h3>
        </div>
        <div className="text-right">
          <span className="text-sm sm:text-base font-semibold text-[#1F1D1B] block">
            {formatPrice(price)}
          </span>
          <span className="text-[10px] text-[#5E7A68]">No Login Required</span>
        </div>
      </div>

      {/* Preferred Contact Channel */}
      <div>
        <label className="text-xs uppercase tracking-widest text-[#8C7D72] font-semibold block mb-2">
          Contact Channel <span className="text-[#C84B31]">*</span>
        </label>
        <Controller
          control={control}
          name="preferred_channel"
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => field.onChange("whatsapp")}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  field.value === "whatsapp"
                    ? "bg-[#25D366]/10 border-[#25D366] text-[#1F1D1B] ring-1 ring-[#25D366]"
                    : "bg-[#FAF7F2] border-[#E8E0D5] text-[#5C4F46]"
                }`}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] mb-1" />
                <div className="text-xs font-bold">WhatsApp</div>
              </button>

              <button
                type="button"
                onClick={() => field.onChange("instagram")}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  field.value === "instagram"
                    ? "bg-[#1F1D1B]/5 border-[#1F1D1B] text-[#1F1D1B] ring-1 ring-[#1F1D1B]"
                    : "bg-[#FAF7F2] border-[#E8E0D5] text-[#5C4F46]"
                }`}
              >
                <InstagramIcon className="w-4 h-4 text-[#E4929A] mb-1" />
                <div className="text-xs font-bold">Instagram</div>
              </button>

              <button
                type="button"
                onClick={() => field.onChange("email")}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  field.value === "email"
                    ? "bg-[#C84B31]/10 border-[#C84B31] text-[#1F1D1B] ring-1 ring-[#C84B31]"
                    : "bg-[#FAF7F2] border-[#E8E0D5] text-[#5C4F46]"
                }`}
              >
                <Mail className="w-4 h-4 text-[#C84B31] mb-1" />
                <div className="text-xs font-bold">Email</div>
              </button>
            </div>
          )}
        />
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
            Full Name <span className="text-[#C84B31]">*</span>
          </label>
          <input
            type="text"
            placeholder="Ananya Sharma"
            {...register("customer_name")}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
          />
          {errors.customer_name && <p className="text-[10px] text-[#C84B31] mt-0.5">{errors.customer_name.message}</p>}
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
            Phone / WhatsApp <span className="text-[#C84B31]">*</span>
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            {...register("customer_phone")}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
          />
          {errors.customer_phone && <p className="text-[10px] text-[#C84B31] mt-0.5">{errors.customer_phone.message}</p>}
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
            Email Address <span className="text-[#C84B31]">*</span>
          </label>
          <input
            type="email"
            placeholder="ananya@example.com"
            {...register("customer_email")}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
          />
          {errors.customer_email && <p className="text-[10px] text-[#C84B31] mt-0.5">{errors.customer_email.message}</p>}
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
            Delivery City <span className="text-[#C84B31]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Mumbai, Bangalore"
            {...register("delivery_city")}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
          />
          {errors.delivery_city && <p className="text-[10px] text-[#C84B31] mt-0.5">{errors.delivery_city.message}</p>}
        </div>
      </div>

      {/* Quantity & Customization */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-[#3D342D]">Quantity</label>
          <div className="flex items-center gap-1 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5] p-1">
            <button
              type="button"
              onClick={() => setValue("quantity", Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-6 h-6 rounded-lg bg-[#FFFDF9] text-[#3D342D] flex items-center justify-center text-xs disabled:opacity-40"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setValue("quantity", Math.min(50, quantity + 1))}
              className="w-6 h-6 rounded-lg bg-[#FFFDF9] text-[#3D342D] flex items-center justify-center text-xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#3D342D] block mb-1">
            Customization Note (Initials, Dates, Thread Colors)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Please embroider 'S & P' in rose gold thread."
            {...register("customization_note")}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31] resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting ? (
          <span>Processing Order Enquiry...</span>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-[#E9C46A]" />
            <span>Place Order Enquiry</span>
          </>
        )}
      </button>
    </form>
  );
};
