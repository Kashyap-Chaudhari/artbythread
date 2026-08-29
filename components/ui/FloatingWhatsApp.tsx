"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { generateWhatsAppUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingWhatsApp: React.FC = () => {
  const { settings, trackEvent } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    settings.whatsapp_default_message
  );

  const handleClick = () => {
    trackEvent("whatsapp_click", { source: "floating_button" });
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 select-none">
      {/* Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 2, duration: 0.4 }}
            className="hidden sm:flex items-center gap-2 bg-[#FFFDF9] py-2 px-3.5 rounded-2xl shadow-lg border border-[#E8E0D5] text-xs text-[#3D342D] max-w-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Questions or custom orders? Chat with us!</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-[#8C7D72] hover:text-[#1F1D1B] p-0.5"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all border-2 border-[#FFFDF9]"
        title="Chat on WhatsApp"
        aria-label="WhatsApp chat"
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-none" />
      </motion.a>
    </div>
  );
};
