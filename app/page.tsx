import React from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { BrandStatementSection } from "@/components/home/BrandStatementSection";
import { FeaturedCreationsSection } from "@/components/home/FeaturedCreationsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { CustomSpotlightSection } from "@/components/home/CustomSpotlightSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { StorySection } from "@/components/home/StorySection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { InstagramGridSection } from "@/components/home/InstagramGridSection";
import { ContactCTASection } from "@/components/home/ContactCTASection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Signature Hero Section */}
      <HeroSection />

      {/* 2. Editorial Brand Statement */}
      <BrandStatementSection />

      {/* 3. Featured Handmade Creations */}
      <FeaturedCreationsSection />

      {/* 4. Craft Categories */}
      <CategoriesSection />

      {/* 5. Custom Memory Commissions */}
      <CustomSpotlightSection />

      {/* 6. Handcrafted 5-Step Process */}
      <ProcessSection />

      {/* 7. Why Handmade Philosophy Story */}
      <StorySection />

      {/* 8. Studio Gallery Preview */}
      <GalleryPreviewSection />

      {/* 9. Testimonials */}
      <TestimonialsSection />

      {/* 10. Curated Instagram Showcase */}
      <InstagramGridSection />

      {/* 11. Final Closing Contact Call-to-Action */}
      <ContactCTASection />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
