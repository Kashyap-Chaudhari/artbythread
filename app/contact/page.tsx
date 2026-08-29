"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl, generateInstagramUrl, generateEmailUrl } from "@/lib/utils";
import { MessageCircle, Mail, Sparkles, MapPin, Clock, Send, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Footer } from "@/components/layout/Footer";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const { settings, trackEvent } = useStore();
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    settings.whatsapp_default_message
  );
  const instagramUrl = settings.instagram_url || generateInstagramUrl(settings.instagram_username);
  const emailUrl = generateEmailUrl(
    settings.email_contact,
    "General Studio Message — ArtByThread.7",
    "Hi ArtByThread.7,\n\nI visited your website and would love to get in touch!\n\nThank you!"
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setFormSent(true);
    if (typeof window !== "undefined") {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-24 md:pt-28 pb-16 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#8C7D72] text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Direct Artist Connection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Let&apos;s talk about <span className="italic text-[#C84B31]">handmade art.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C4F46]">
            Whether you have a question about our creations, want to order a specific piece, or wish to commission a bespoke design — we&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* WhatsApp Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "contact_page_card" })}
            className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D5] hover:border-[#25D366] transition-all shadow-xs hover:shadow-lg flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#1F1D1B] group-hover:text-[#128C7E] transition-colors">
                  WhatsApp Chat
                </h3>
                <p className="text-xs text-[#5C4F46] mt-1 leading-relaxed">
                  Fastest way to discuss orders, confirm color palettes, and share photo references.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-[#E8E0D5]/70 flex items-center gap-1.5 text-xs text-[#128C7E] font-medium">
              <span>Open WhatsApp Chat →</span>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("instagram_click", { source: "contact_page_card" })}
            className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D5] hover:border-[#E4929A] transition-all shadow-xs hover:shadow-lg flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E4929A]/20 text-[#C84B31] flex items-center justify-center">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#1F1D1B] group-hover:text-[#C84B31] transition-colors">
                  Instagram DM
                </h3>
                <p className="text-xs text-[#5C4F46] mt-1 leading-relaxed">
                  Send us a direct message on Instagram {settings.instagram_username}.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-[#E8E0D5]/70 flex items-center gap-1.5 text-xs text-[#C84B31] font-medium">
              <span>Visit Instagram Profile →</span>
            </div>
          </a>

          {/* Email Card */}
          <a
            href={emailUrl}
            onClick={() => trackEvent("email_click", { source: "contact_page_card" })}
            className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D5] hover:border-[#3D342D] transition-all shadow-xs hover:shadow-lg flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#3D342D] border border-[#E8E0D5] flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#1F1D1B]">
                  Direct Email
                </h3>
                <p className="text-xs text-[#5C4F46] mt-1 leading-relaxed">
                  For formal inquiries, corporate gifting orders, and media collaborations.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-[#E8E0D5]/70 flex items-center gap-1.5 text-xs text-[#3D342D] font-medium">
              <span>{settings.email_contact} →</span>
            </div>
          </a>
        </div>

        {/* Message Studio Form & Studio Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="md:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 sm:p-10 shadow-xs">
            {formSent ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E5EDE8] text-[#5E7A68] flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 fill-[#5E7A68]" />
                </div>
                <h3 className="font-serif text-2xl text-[#1F1D1B]">
                  Thank you for reaching out!
                </h3>
                <p className="text-xs text-[#5C4F46] max-w-sm mx-auto">
                  We have received your message and will reply via email or WhatsApp promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl text-[#1F1D1B]">
                  Send a Note to the Studio
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya"
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    Email / Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya@example.com or +91 98765 43210"
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D342D] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D5] text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C84B31]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Studio Note</span>
                </button>
              </form>
            )}
          </div>

          {/* Studio Hours & Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-4">
              <h4 className="font-serif text-lg text-[#1F1D1B]">
                Studio Details & Hours
              </h4>

              <div className="space-y-3 text-xs text-[#5C4F46]">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#8C7D72] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1F1D1B]">Studio Chat Hours</strong>
                    <span>Monday – Saturday: 10:00 AM – 8:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#8C7D72] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#1F1D1B]">Location & Shipping</strong>
                    <span>Handmade in India. Safe nationwide courier dispatch.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-dashed border-[#D6C7B7] space-y-2 text-center">
              <span className="text-xs uppercase tracking-widest text-[#C84B31] font-semibold block">
                Have a Custom Idea?
              </span>
              <p className="text-xs text-[#5C4F46]">
                You can also use our specialized Custom Request form with image upload preview.
              </p>
              <a
                href="/custom"
                className="text-xs font-semibold text-[#1F1D1B] hover:text-[#C84B31] thread-underline inline-block pt-1"
              >
                Go to Custom Request Studio →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
