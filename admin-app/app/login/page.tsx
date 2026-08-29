"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminPin, saveAdminSession, MASTER_ADMIN_PIN } from "@/lib/auth";
import { ShieldCheck, Lock, ArrowRight, Sparkles, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("Please enter your studio master PIN.");
      return;
    }

    setIsSubmitting(true);
    if (checkAdminPin(pin)) {
      saveAdminSession();
      setError("");
      router.replace("/");
    } else {
      setError("Invalid PIN. Please enter the correct Studio Master PIN.");
      setIsSubmitting(false);
    }
  };

  const handleQuickKey = (digit: string) => {
    if (pin.length < 8) {
      const newPin = pin + digit;
      setPin(newPin);
      setError("");
      if (checkAdminPin(newPin)) {
        saveAdminSession();
        router.replace("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 sm:p-10 shadow-2xl space-y-8 text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Studio Emblem */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#1F1D1B] text-[#FAF7F2] flex items-center justify-center mx-auto shadow-lg text-2xl">
            🧵
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
              artbythread<span className="text-[#C84B31] font-sans font-bold">.7</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#8C7D72] mt-1 font-semibold">
              Studio Owner Portal
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#5C4F46]">
              Enter Studio Passkey / PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="••••"
                className="w-full text-center py-3.5 px-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-2xl font-mono tracking-[0.4em] text-[#1F1D1B] outline-none focus:border-[#C84B31] focus:ring-2 focus:ring-[#C84B31]/20 transition-all placeholder:tracking-normal placeholder:text-sm"
              />
            </div>
            {error && (
              <p className="text-xs text-[#C84B31] font-medium pt-1 animate-in fade-in">
                {error}
              </p>
            )}
          </div>

          {/* Quick Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "←"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === "C") setPin("");
                  else if (key === "←") setPin(pin.slice(0, -1));
                  else handleQuickKey(key);
                }}
                className="py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DE] active:bg-[#D6C7B7] text-sm font-mono font-bold text-[#1F1D1B] border border-[#E8E0D5] transition-all cursor-pointer shadow-2xs"
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock Studio Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Security Note */}
        <div className="pt-2 border-t border-[#E8E0D5]/70 text-[11px] text-[#8C7D72] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7D9D8B]" />
          <span>Default Studio PIN: <strong>7777</strong> (Customizable in .env)</span>
        </div>

      </div>
    </div>
  );
}
