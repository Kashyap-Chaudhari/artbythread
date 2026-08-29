"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Lightbulb, PenTool, Palette, Sparkles, Heart } from "lucide-react";

export const ProcessSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      number: "01",
      title: "Your Idea",
      icon: Lightbulb,
      description: "You share your reference photo, inspiration, milestone date, or color preferences with us via WhatsApp, form, or DM.",
      accent: "#C84B31",
    },
    {
      number: "02",
      title: "Design",
      icon: PenTool,
      description: "We translate your idea into a custom stitch layout and compose floral groupings tailored to your aesthetic.",
      accent: "#7D9D8B",
    },
    {
      number: "03",
      title: "Thread Selection",
      icon: Palette,
      description: "We handpick matching shades of premium Egyptian cotton floss and soft milk cotton yarns for the palette.",
      accent: "#D47A85",
    },
    {
      number: "04",
      title: "Handcrafted",
      icon: Sparkles,
      description: "Stitch by stitch, petal by petal, each element is painstakingly formed by hand over patient days.",
      accent: "#E9C46A",
    },
    {
      number: "05",
      title: "Finished With Love",
      icon: Heart,
      description: "Wrapped in protective eco-friendly craft packaging with a handwritten artist card, ready to be gifted or displayed.",
      accent: "#C84B31",
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FFFDF9] border-t border-[#E8E0D5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
            How It Comes Together
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] font-normal leading-tight">
            The Journey of a <span className="italic text-[#C84B31]">Handmade Piece</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5C4F46]">
            From the initial spark of an idea to the final snip of thread, discover our transparent 5-step handcrafting process.
          </p>
        </div>

        {/* Steps Grid with Connecting Line */}
        <div className="relative">
          
          {/* Connecting Desktop Thread Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 -translate-y-6 pointer-events-none z-0">
            <svg viewBox="0 0 1000 20" className="w-full h-full" fill="none" preserveAspectRatio="none">
              <motion.path
                d="M 0 10 C 250 18, 500 2, 750 18 C 875 10, 950 12, 1000 10"
                stroke="#D6C7B7"
                strokeWidth="1.75"
                strokeDasharray={shouldReduceMotion ? "none" : "5 5"}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative flex flex-col bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8E0D5] hover:border-[#C84B31]/40 shadow-xs hover:shadow-md transition-all duration-300"
                >
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl text-[#8C7D72] group-hover:text-[#C84B31] transition-colors font-medium">
                      {step.number}
                    </span>
                    <div
                      className="w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#E8E0D5] flex items-center justify-center shadow-xs"
                      style={{ color: step.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl text-[#1F1D1B] mb-2 font-normal">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#5C4F46] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
