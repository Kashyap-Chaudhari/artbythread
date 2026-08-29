"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { Star, Quote, Heart } from "lucide-react";
import { motion } from "framer-motion";

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useStore();
  const approvedTestimonials = testimonials.filter((t) => t.is_approved);

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#E8E0D5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-medium">
            Customer Love
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1F1D1B] font-normal leading-tight">
            Made to be <span className="italic text-[#C84B31]">remembered.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5C4F46]">
            Words shared by those who received our handmade creations and celebrated special moments.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {approvedTestimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col justify-between bg-[#FFFDF9] p-7 sm:p-8 rounded-2xl border border-[#E8E0D5] shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#E9C46A]">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E9C46A]" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-[#3D342D] leading-relaxed italic font-serif">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-6 mt-6 border-t border-[#E8E0D5]/70 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#1F1D1B]">
                    {item.customer_name}
                  </h4>
                  {item.customer_location && (
                    <span className="text-xs text-[#8C7D72]">
                      {item.customer_location}
                    </span>
                  )}
                </div>

                {item.product_name && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#8C7D72] border border-[#E8E0D5]">
                    {item.product_name}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
