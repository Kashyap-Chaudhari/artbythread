import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-canvas-texture flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 sm:p-10 shadow-lg space-y-5">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center mx-auto text-[#C84B31]">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
            404 • Page Not Found
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
            We couldn&apos;t find that thread.
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4F46] leading-relaxed">
            The page you are looking for might have been moved or is waiting to be stitched.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/creations"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1F1D1B] text-[#FAF7F2] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#C84B31] transition-colors"
          >
            <span>Explore Creations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/custom"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F2] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-medium hover:bg-[#EFE8DE] transition-colors"
          >
            Request Custom Piece
          </Link>
        </div>
      </div>
    </div>
  );
}
