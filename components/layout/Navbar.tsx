"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageCircle,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Package,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl, generateInstagramUrl } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { settings, categories, setIsSearchOpen, trackEvent } = useStore();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [creationsDropdownOpen, setCreationsDropdownOpen] = useState<boolean>(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setCreationsDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Creations", href: "/creations", hasDropdown: true },
    { label: "Collections", href: "/collections" },
    { label: "Custom Studio", href: "/custom", badge: "Bespoke" },
    { label: "Track Order", href: "/track-order", badge: "Live" },
    { label: "Our Story", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setCreationsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCreationsDropdownOpen(false);
    }, 180);
  };

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    settings.whatsapp_default_message
  );
  const instagramUrl = settings.instagram_url || generateInstagramUrl(settings.instagram_username);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* High-Contrast Announcement Top Bar */}
        <AnnouncementBanner />

        {/* Navigation Bar */}
        <div
          className={`transition-all duration-300 ease-out ${
            isScrolled
              ? "py-2.5 sm:py-3 bg-[#FAF7F2]/95 backdrop-blur-2xl border-b border-[#E8E0D5]/80 shadow-[0_4px_24px_rgba(31,29,27,0.05)]"
              : "py-3.5 sm:py-4 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E0D5]/40"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
            
            {/* 1. Brand Identity with Micro-Emblem */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none select-none shrink-0"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] border border-[#D6C7B7] flex items-center justify-center shadow-xs group-hover:border-[#C84B31] transition-all duration-300">
                <svg viewBox="0 0 36 36" className="w-full h-full p-1" fill="none">
                  <circle cx="18" cy="18" r="14" stroke="#D9B78F" strokeWidth="1.8" strokeDasharray="3 2" />
                  <path d="M 9 18 C 14 11, 22 25, 27 18" stroke="#C84B31" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="2" fill="#E4929A" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-[23px] tracking-tight text-[#1F1D1B] font-normal leading-none transition-colors duration-300 group-hover:text-[#C84B31]">
                  artbythread<span className="text-[#C84B31] font-sans font-bold">.7</span>
                </span>
                <span className="text-[8.5px] uppercase tracking-[0.3em] text-[#8C7D72] mt-1 font-sans font-medium">
                  Handmade Studio
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation Hub */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#FFFDF9]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E0D5]/90 shadow-[0_2px_12px_rgba(61,52,45,0.03)]">
              {navLinks.map((link) => {
                const isActive = link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={link.hasDropdown ? handleDropdownEnter : undefined}
                    onMouseLeave={link.hasDropdown ? handleDropdownLeave : undefined}
                  >
                    <Link
                      href={link.href}
                      className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium tracking-wide transition-all duration-200 relative flex items-center gap-1.5 select-none ${
                        isActive
                          ? "text-[#1F1D1B] font-semibold bg-[#FAF7F2] shadow-xs"
                          : "text-[#5C4F46] hover:text-[#1F1D1B] hover:bg-[#FAF7F2]/70"
                      }`}
                    >
                      <span>{link.label}</span>

                      {link.hasDropdown && (
                        <ChevronDown
                          className={`w-3 h-3 text-[#8C7D72] transition-transform duration-200 ${
                            creationsDropdownOpen ? "rotate-180 text-[#C84B31]" : ""
                          }`}
                        />
                      )}

                      {link.badge && (
                        <span className="px-1.5 py-0.2 text-[8px] font-bold tracking-wider uppercase bg-[#C84B31]/10 text-[#C84B31] rounded-full">
                          {link.badge}
                        </span>
                      )}

                      {/* Active Stitch Dash Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavStitch"
                          className="absolute -bottom-0.5 left-3 right-3 h-[2px] bg-[#C84B31] rounded-full"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                    </Link>

                    {/* Creations Flyout Menu */}
                    {link.hasDropdown && (
                      <AnimatePresence>
                        {creationsDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-2 w-72 bg-[#FFFDF9] rounded-2xl border border-[#E8E0D5] p-3 shadow-xl z-50 space-y-1"
                          >
                            <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold border-b border-[#E8E0D5]/60 mb-1">
                              Browse by Category
                            </div>

                            {categories.slice(0, 6).map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/creations?category=${cat.slug}`}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#3D342D] hover:bg-[#FAF7F2] hover:text-[#C84B31] transition-colors group"
                              >
                                <span>{cat.name}</span>
                                <ArrowRight className="w-3 h-3 text-[#8C7D72] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                              </Link>
                            ))}

                            <div className="pt-1.5 border-t border-[#E8E0D5]/60 mt-1">
                              <Link
                                href="/creations"
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#1F1D1B] hover:bg-[#FAF7F2] transition-colors"
                              >
                                <span>View All Creations</span>
                                <span className="text-[#C84B31]">→</span>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* 3. Conversion Actions & Utilities */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F2] text-[#3D342D] hover:text-[#1F1D1B] transition-all flex items-center gap-2 text-xs font-medium border border-[#E8E0D5] hover:border-[#D6C7B7] shadow-xs cursor-pointer"
                title="Search creations (Cmd+K)"
                aria-label="Search creations"
              >
                <Search className="w-3.5 h-3.5 text-[#8C7D72]" />
                <span className="hidden sm:inline text-xs text-[#5C4F46]">Search</span>
                <kbd className="hidden xl:inline-block text-[9px] font-mono text-[#A3968B] bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#E8E0D5]">
                  ⌘K
                </kbd>
              </button>

              {/* Track Order Quick Link */}
              <Link
                href="/track-order"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F2] text-[#3D342D] hover:text-[#C84B31] border border-[#E8E0D5] hover:border-[#D6C7B7] text-xs font-medium transition-all shadow-xs"
                title="Track Order & History"
              >
                <Package className="w-3.5 h-3.5 text-[#C84B31]" />
                <span className="hidden xl:inline">Track Order</span>
              </Link>

              {/* Instagram Profile */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("instagram_click", { source: "navbar" })}
                className="w-8 h-8 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F2] border border-[#E8E0D5] hover:border-[#E4929A] text-[#5C4F46] hover:text-[#C84B31] transition-all flex items-center justify-center shadow-xs"
                title="Instagram @artbythread.7"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>

              {/* WhatsApp Direct Ordering CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { source: "navbar" })}
                className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-4.5 py-1.5 sm:py-2 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-medium tracking-wide transition-all duration-300 shadow-sm hover:shadow-md group"
                title="Chat & Order on WhatsApp"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                </span>
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] text-[#1F1D1B] lg:hidden transition-colors shadow-xs"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#FAF7F2] pt-28 pb-8 px-6 lg:hidden flex flex-col justify-between overflow-y-auto"
          >
            {/* Mobile Menu List */}
            <div className="flex flex-col gap-1 py-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7D72] font-semibold mb-3 px-2">
                Studio Directory
              </span>

              {navLinks.map((link, idx) => {
                const isActive = link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3.5 px-3 rounded-2xl transition-all ${
                        isActive
                          ? "bg-[#FFFDF9] text-[#C84B31] border border-[#E8E0D5] font-medium shadow-xs"
                          : "text-[#1F1D1B] hover:bg-[#FFFDF9]"
                      }`}
                    >
                      <span className="font-serif text-2xl tracking-tight">
                        {link.label}
                      </span>

                      {link.badge ? (
                        <span className="px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase bg-[#C84B31]/10 text-[#C84B31] rounded-full">
                          {link.badge}
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-[#8C7D72]" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Contact Quick Actions */}
            <div className="pt-6 border-t border-[#E8E0D5] space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { source: "mobile_drawer" })}
                className="w-full py-3.5 px-6 rounded-full bg-[#25D366] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Chat & Order on WhatsApp</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("instagram_click", { source: "mobile_drawer" })}
                className="w-full py-3 px-6 rounded-full bg-[#FFFDF9] text-[#1F1D1B] text-xs font-medium tracking-wide border border-[#E8E0D5] flex items-center justify-center gap-2"
              >
                <InstagramIcon className="w-4 h-4 text-[#E4929A]" />
                <span>Instagram {settings.instagram_username}</span>
              </a>

              <p className="text-center text-xs text-[#8C7D72] pt-2 font-serif italic">
                &ldquo;Little pieces of handmade happiness, created one thread at a time.&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
