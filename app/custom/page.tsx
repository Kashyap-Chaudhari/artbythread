"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl } from "@/lib/utils";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Heart,
  Calendar,
  Palette,
  Home,
  MapPin,
  Clock,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function CustomPage() {
  const { settings, submitCustomRequest, trackEvent } = useStore();

  // Form State matching specification
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    creation_type: "Embroidery Hoop Portrait",
    description: "",
    reference_image_url: "",
    approximate_size: "8-inch Hoop",
    preferred_colors: [] as string[],
    quantity: 1,
    required_date: "",
    delivery_address: "",
    notes: "",
    hp_field: "", // Honeypot anti-spam
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string>("");

  const colorOptions = [
    { name: "Pastel Blush & Peach", color: "#E4929A" },
    { name: "Sage Green & Botanicals", color: "#7D9D8B" },
    { name: "Butter Yellow & Warm Cream", color: "#E9C46A" },
    { name: "Lavender & Lilac", color: "#A89FBF" },
    { name: "Crimson & Earth Terracotta", color: "#C84B31" },
    { name: "Vintage Monochrome / Neutral", color: "#8C7D72" },
  ];

  const handleColorToggle = (colorName: string) => {
    setFormData((prev) => {
      const exists = prev.preferred_colors.includes(colorName);
      return {
        ...prev,
        preferred_colors: exists
          ? prev.preferred_colors.filter((c) => c !== colorName)
          : [...prev.preferred_colors, colorName],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image file size should be less than 10MB.");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({ ...prev, reference_image_url: previewUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.description) {
      alert("Please fill in your Name, Phone/WhatsApp, Email, and Idea Description.");
      return;
    }

    if (formData.hp_field) {
      // Honeypot spam check
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Post to live orders API to trigger instant Resend email to studio owner
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          preferred_channel: "whatsapp",
          quantity: formData.quantity || 1,
          delivery_city: formData.delivery_address || "India",
          product_name: `Custom Commission: ${formData.creation_type}`,
          product_photo_url: imagePreview || "/products/handkerchief-iloveu-embroidery.jpg",
          size_variant: formData.approximate_size || "Custom Size",
          customization_note: `${formData.description}${
            formData.preferred_colors.length > 0
              ? ` | Colors: ${formData.preferred_colors.join(", ")}`
              : ""
          }${formData.notes ? ` | Notes: ${formData.notes}` : ""}`,
        }),
      });

      const data = await response.json();
      const orderId = data.order_id || `CUST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

      // 2. Also save to in-memory store
      await submitCustomRequest({
        request_id: orderId,
        full_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        creation_type: formData.creation_type,
        description: formData.description,
        reference_image_url: imagePreview || undefined,
        approximate_size: formData.approximate_size,
        color_palette: formData.preferred_colors,
        quantity: formData.quantity,
        target_date: formData.required_date || undefined,
        delivery_address: formData.delivery_address || undefined,
        additional_notes: formData.notes || undefined,
      });

      // 3. Save to local storage for /track-order
      try {
        const storedOrder = {
          order_id: orderId,
          product_name: `Custom: ${formData.creation_type}`,
          product_photo_url: imagePreview || "/products/handkerchief-iloveu-embroidery.jpg",
          quantity: formData.quantity || 1,
          size_variant: formData.approximate_size || "Custom Size",
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          delivery_city: formData.delivery_address || "India",
          customization_note: formData.description,
          status: "new",
          created_at: new Date().toISOString(),
        };
        const prev = JSON.parse(localStorage.getItem("artbythread_customer_orders") || "[]");
        const filtered = Array.isArray(prev) ? prev.filter((o: any) => o.order_id !== orderId) : [];
        localStorage.setItem("artbythread_customer_orders", JSON.stringify([storedOrder, ...filtered]));
      } catch (e) {
        console.warn("[FAILED TO SAVE CUSTOM ORDER IN LOCALSTORAGE]", e);
      }

      setSubmittedRequestId(orderId);
      setIsSubmitted(true);

      // Trigger celebratory confetti
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C84B31", "#E4929A", "#7D9D8B", "#E9C46A"],
        });
      }
    } catch (err) {
      console.error("Error submitting custom request:", err);
      alert("Something went wrong. Please try contacting us on WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappFollowUpUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    `✨ Hi ArtByThread.7! 🧵❤️\n\nI just submitted a custom commission request on your website (Request ID: ${submittedRequestId || "New"}).\n\nName: ${formData.name}\nCreation Type: ${formData.creation_type}\n\nI’d love to discuss the design, timeline, and quote with you! 🌸`
  );

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#C84B31] text-xs uppercase tracking-widest font-medium shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Studio Commissions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Your Memory.{" "}
            <span className="block italic text-[#C84B31]">Turned Into Thread.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C4F46] leading-relaxed">
            Have a special photograph, wedding date, pet portrait, or custom floral bouquet concept? Share your ideas and let us translate your story into timeless handmade art.
          </p>
        </div>

        {/* Custom Process Visual Timeline */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] p-6 sm:p-8 mb-12 shadow-xs">
          <span className="text-[11px] uppercase tracking-widest text-[#8C7D72] font-semibold text-center block mb-6">
            Bespoke Commission Process
          </span>

          <div className="grid grid-cols-5 gap-2 text-center text-xs relative">
            <div className="space-y-1">
              <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#C84B31] text-[#C84B31] font-semibold flex items-center justify-center mx-auto text-[11px]">1</span>
              <span className="font-medium text-[#1F1D1B] block">Submit Idea</span>
            </div>
            <div className="space-y-1">
              <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#7D9D8B] text-[#7D9D8B] font-semibold flex items-center justify-center mx-auto text-[11px]">2</span>
              <span className="font-medium text-[#1F1D1B] block">Studio Quote</span>
            </div>
            <div className="space-y-1">
              <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#D47A85] text-[#D47A85] font-semibold flex items-center justify-center mx-auto text-[11px]">3</span>
              <span className="font-medium text-[#1F1D1B] block">Confirm & Palette</span>
            </div>
            <div className="space-y-1">
              <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E9C46A] text-[#8A6805] font-semibold flex items-center justify-center mx-auto text-[11px]">4</span>
              <span className="font-medium text-[#1F1D1B] block">Hand Stitch</span>
            </div>
            <div className="space-y-1">
              <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#C84B31] text-[#C84B31] font-semibold flex items-center justify-center mx-auto text-[11px]">5</span>
              <span className="font-medium text-[#1F1D1B] block">Dispatch</span>
            </div>
          </div>
        </div>

        {/* Success Screen OR Form */}
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 sm:p-12 text-center space-y-6 shadow-md my-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#E5EDE8] text-[#5E7A68] flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-8 h-8 fill-[#5E7A68]" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-serif text-[#1F1D1B] font-normal">
                Your idea is on its way to us! ❤️
              </h2>
              <p className="text-sm sm:text-base text-[#5C4F46] max-w-lg mx-auto leading-relaxed">
                Thank you! We&apos;ve received your custom commission request. We&apos;ll personally review your details and get back to you shortly.
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5] text-xs text-[#5C4F46] max-w-md mx-auto text-left space-y-1.5">
              <div className="font-semibold text-[#1F1D1B] flex items-center justify-between">
                <span>Commission Reference:</span>
                <span className="font-mono text-[#C84B31]">{submittedRequestId}</span>
              </div>
              <p>Name: {formData.name}</p>
              <p>Type: {formData.creation_type}</p>
              <p>Phone: {formData.phone}</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Button 1: 💬 Follow up on WhatsApp */}
              <a
                href={whatsappFollowUpUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { source: "custom_success_followup" })}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>💬 Follow up on WhatsApp</span>
              </a>

              {/* Button 2: 🏠 Continue Browsing */}
              <Link
                href="/creations"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4 text-[#8C7D72]" />
                <span>🏠 Continue Browsing</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Custom Request Form */
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 sm:p-10 lg:p-12 shadow-sm space-y-8"
          >
            {/* Honeypot anti-spam field */}
            <input
              type="text"
              name="hp_field"
              value={formData.hp_field}
              onChange={(e) => setFormData({ ...formData, hp_field: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Step 1: Customer Contact Details */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#1F1D1B] border-b border-[#E8E0D5] pb-2 font-normal flex items-center gap-2">
                <span>1. Your Contact Details</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    Full Name <span className="text-[#C84B31]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    WhatsApp / Phone <span className="text-[#C84B31]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    Email Address <span className="text-[#C84B31]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ananya@example.com"
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Creation Specifics */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#1F1D1B] border-b border-[#E8E0D5] pb-2 font-normal">
                2. Creation Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                      Creation Type <span className="text-[#C84B31]">*</span>
                    </label>
                    <select
                      value={formData.creation_type}
                      onChange={(e) => setFormData({ ...formData, creation_type: e.target.value })}
                      className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                    >
                      <option value="Embroidery Hoop Portrait">Embroidery Hoop Portrait (Couple / Individual)</option>
                      <option value="Forever Flower Bouquet">Forever Crochet Flower Bouquet (Custom Stems)</option>
                      <option value="Wedding Date & Botanical Keepsake">Wedding Date & Botanical Keepsake Hoop</option>
                      <option value="Pet Portrait Embroidery">Pet Portrait Thread Art</option>
                      <option value="Custom Bag Charm / Keychain Set">Custom Bag Charm / Keychain Set</option>
                      <option value="Wearable Embroidery (Tote / Hat)">Wearable Embroidery (Tote Bag / Hat)</option>
                      <option value="Other Custom Idea">Other Custom Artistic Idea</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    Describe Your Idea & Story <span className="text-[#C84B31]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about the memory, special dates, favorite flowers, names, or feelings you want woven into the piece..."
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                  />
                </div>

                {/* Reference Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    Reference Photo or Sketch (Optional)
                  </label>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-dashed border-[#D6C7B7] text-center">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden shadow-xs border border-[#E8E0D5]">
                          <Image src={imagePreview} alt="Reference Preview" fill className="object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, reference_image_url: "" }));
                          }}
                          className="text-xs text-[#C84B31] hover:underline"
                        >
                          Remove photo
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block space-y-1.5 py-4">
                        <Upload className="w-6 h-6 text-[#8C7D72] mx-auto" />
                        <span className="text-xs text-[#3D342D] font-medium block">
                          Click to upload reference image
                        </span>
                        <span className="text-[11px] text-[#8C7D72] block">
                          PNG, JPG, WEBP up to 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Preferred Color Tones */}
                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-2">
                    Preferred Color Palette Tones
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((c) => {
                      const isSelected = formData.preferred_colors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleColorToggle(c.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-[#1F1D1B] text-[#FAF7F2] shadow-xs"
                              : "bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D342D] border border-[#E8E0D5]"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: c.color }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size & Target Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                      Approximate Size / Hoop Diameter
                    </label>
                    <select
                      value={formData.approximate_size}
                      onChange={(e) => setFormData({ ...formData, approximate_size: e.target.value })}
                      className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none"
                    >
                      <option value="Mini (4 to 5-inch hoop)">Mini (4 to 5-inch hoop / Pocket keepsake)</option>
                      <option value="Medium (7 to 8-inch hoop)">Medium (7 to 8-inch hoop / Standard posy)</option>
                      <option value="Large (10 to 12-inch hoop)">Large (10 to 12-inch hoop / 9-stem bouquet)</option>
                      <option value="Not sure / Open to recommendation">Not sure / Open to recommendation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                      Needed By Date (For Gifts / Special Occasions)
                    </label>
                    <input
                      type="date"
                      value={formData.required_date}
                      onChange={(e) => setFormData({ ...formData, required_date: e.target.value })}
                      className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Address & Additional Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                      Delivery Address (City, Pincode)
                    </label>
                    <input
                      type="text"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                      placeholder="e.g. Mumbai, Maharashtra - 400001"
                      className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                      Additional Notes / Custom Packaging
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Include handwritten gift note"
                      className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-full bg-[#C84B31] hover:bg-[#1F1D1B] text-[#FAF7F2] text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{isSubmitting ? "Sending Request..." : "Send Custom Request"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-[#8C7D72] mt-3">
                ✦ No upfront online payment required until we review your design and confirm the thread palette.
              </p>
            </div>
          </form>
        )}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
