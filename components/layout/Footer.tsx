"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl, generateInstagramUrl, generateEmailUrl } from "@/lib/utils";
import { MessageCircle, Mail, Heart, Sparkles, ShieldCheck } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export const Footer: React.FC = () => {
  const { settings, trackEvent } = useStore();

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    settings.whatsapp_default_message
  );
  const instagramUrl = settings.instagram_url || generateInstagramUrl(settings.instagram_username);
  const emailUrl = generateEmailUrl(
    settings.email_contact,
    "General Enquiry — ArtByThread.7",
    "Hi ArtByThread.7,\n\nI visited your website and would love to enquire about your handmade art.\n\nThank you!"
  );

  return (
    <footer className="w-full bg-[#1F1D1B] text-[#FAF7F2] pt-16 pb-12 px-4 sm:px-6 lg:px-12 border-t border-[#3D342D] select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#3D342D]/80">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#FAF7F2] group-hover:text-[#E4929A] transition-colors">
                artbythread<span className="text-[#C84B31] font-sans font-bold">.7</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#A3968B] mt-0.5">
                Handmade Studio & Botanical Art
              </span>
            </Link>

            <p className="text-sm text-[#A3968B] max-w-sm leading-relaxed font-normal">
              Handmade with heart, one thread at a time. Creating timeless botanical embroidery hoops, everlasting crochet flower bouquets, and personalized heirloom keepsakes.
            </p>

            <div className="pt-2 text-xs text-[#8C7D72] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7D9D8B]" />
              <span>{settings.location_text}</span>
            </div>
          </div>

          {/* Navigation (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#D6C7B7] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#A3968B]">
              <li>
                <Link href="/creations" className="hover:text-[#FAF7F2] transition-colors">
                  Creations
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#FAF7F2] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/custom" className="hover:text-[#FAF7F2] transition-colors flex items-center gap-1.5">
                  <span>Custom Studio</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#C84B31]/30 text-[#E4929A] rounded-full">Bespoke</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FAF7F2] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#FAF7F2] transition-colors">
                  Studio Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#D6C7B7] font-semibold">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A3968B]">
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("instagram_click", { source: "footer" })}
                  className="hover:text-[#FAF7F2] transition-colors inline-flex items-center gap-2"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#E4929A]" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { source: "footer" })}
                  className="hover:text-[#FAF7F2] transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#7D9D8B]" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={emailUrl}
                  onClick={() => trackEvent("email_click", { source: "footer" })}
                  className="hover:text-[#FAF7F2] transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E9C46A]" />
                  <span>Email Us</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Information & Admin (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#D6C7B7] font-semibold">
              Information
            </h4>
            <ul className="space-y-2 text-sm text-[#A3968B]">
              <li>
                <Link href="/faq" className="hover:text-[#FAF7F2] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FAF7F2] transition-colors">
                  Contact & Studio Enquiries
                </Link>
              </li>
              <li>
                <Link href="/about#craft-care" className="hover:text-[#FAF7F2] transition-colors">
                  Care & Preservation Guide
                </Link>
              </li>
              <li className="pt-2 border-t border-[#3D342D]/50">
                <Link
                  href="/admin"
                  className="text-xs text-[#8C7D72] hover:text-[#D6C7B7] transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Studio Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7D72] gap-4">
          <p className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} ArtByThread.7. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-[#C84B31] fill-[#C84B31] inline" /> and pure cotton thread.
            </span>
          </p>
          <div className="flex items-center gap-4 text-[#8C7D72]">
            <span>Direct Artist Ordering</span>
            <span>•</span>
            <span>No Automated Checkouts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
