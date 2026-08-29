"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-canvas-texture flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 sm:p-10 shadow-lg space-y-5">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center mx-auto text-[#C84B31]">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
            Oops, this thread got tangled.
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4F46] leading-relaxed">
            Something unexpected occurred while rendering the studio. Please try again or head back to our creations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#C84B31] text-[#FAF7F2] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#1F1D1B] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F2] text-[#1F1D1B] border border-[#E8E0D5] text-xs font-medium hover:bg-[#EFE8DE] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
