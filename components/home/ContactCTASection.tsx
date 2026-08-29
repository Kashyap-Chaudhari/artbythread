"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl, generateInstagramUrl, generateEmailUrl } from "@/lib/utils";
import { MessageCircle, Mail, Sparkles, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { motion } from "framer-motion";

export const ContactCTASection: React.FC = () => {
  const { settings, trackEvent } = useStore();

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    settings.whatsapp_default_message
  );
  const instagramUrl = settings.instagram_url || generateInstagramUrl(settings.instagram_username);
  const emailUrl = generateEmailUrl(
    settings.email_contact,
    "Custom Enquiry — ArtByThread.7",
    "Hi ArtByThread.7,\n\nI have a special handmade creation in mind and would love to discuss ideas with you!\n\nThank you!"
  );

  return (
    <section className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-canvas-texture relative overflow-hidden border-t border-[#E8E0D5]">
      
      {/* Decorative Thread Curves */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg viewBox="0 0 1440 400" className="w-full h-full" fill="none">
          <path
            d="M -100 200 C 300 50, 700 350, 1100 150 C 1300 50, 1500 250, 1600 200"
            stroke="#C84B31"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        
        {/* Heart icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-14 h-14 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] flex items-center justify-center mx-auto shadow-sm text-[#C84B31]"
        >
          <Heart className="w-6 h-6 fill-[#C84B31]" />
        </motion.div>

        {/* Editorial Heading */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Have something special{" "}
            <span className="block italic text-[#C84B31]">in mind?</span>
          </h2>
          <p className="text-base sm:text-lg text-[#5C4F46] max-w-xl mx-auto leading-relaxed">
            Tell us what you&apos;re imagining and let&apos;s create something beautiful, tactile, and made with heart.
          </p>
        </div>

        {/* Action Conversion Buttons: WhatsApp, Instagram, Email */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "bottom_cta_section" })}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Instagram Button */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("instagram_click", { source: "bottom_cta_section" })}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F2] text-[#1F1D1B] hover:text-[#C84B31] border border-[#E8E0D5] hover:border-[#C84B31] text-sm font-medium tracking-wide shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5"
          >
            <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
            <span>DM on Instagram</span>
          </a>

          {/* Email Button */}
          <a
            href={emailUrl}
            onClick={() => trackEvent("email_click", { source: "bottom_cta_section" })}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F2] text-[#1F1D1B] hover:text-[#1F1D1B] border border-[#E8E0D5] hover:border-[#3D342D] text-sm font-medium tracking-wide shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5"
          >
            <Mail className="w-4 h-4 text-[#8C7D72]" />
            <span>Email Creator</span>
          </a>
        </div>

        {/* Small Notice */}
        <p className="text-xs text-[#8C7D72] pt-2">
          Average reply time: Within a few hours • Custom sketches provided on request
        </p>
      </div>
    </section>
  );
};
