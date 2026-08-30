"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkAdminCredentials,
  saveAdminSession,
  ADMIN_CREDENTIALS,
} from "@/lib/auth";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Scissors,
  Palette,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError("Please enter both User ID and Password.");
      return;
    }

    setIsSubmitting(true);
    if (checkAdminCredentials(userId, password)) {
      saveAdminSession(userId);
      setError("");
      window.location.href = "/";
    } else {
      setError("Invalid User ID or Password. Please verify your studio credentials.");
      setIsSubmitting(false);
    }
  };

  const handleFillCredentials = () => {
    setUserId(ADMIN_CREDENTIALS.userId);
    setPassword(ADMIN_CREDENTIALS.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#1F1D1B] text-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C84B31]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7D9D8B]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-[#2A2623]/90 backdrop-blur-xl rounded-[2.5rem] border border-[#4A3F36] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Brand Showcase (Desktop only) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1F1D1B] to-[#2E2823] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#4A3F36] flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFDF9] border border-[#D6C7B7] flex items-center justify-center text-[#C84B31] text-2xl shadow-md">
                🧵
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2] font-normal leading-tight">
                  artbythread<span className="text-[#C84B31] font-sans font-bold">.7</span>
                </h2>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#A3968B] block font-medium">
                  Studio Operations
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C84B31]/20 border border-[#C84B31]/40 text-[#E4929A] text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Single Master Admin</span>
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F2] leading-snug">
                Handcrafted Orders & Fulfillment Hub
              </h3>
              <p className="text-xs text-[#A3968B] leading-relaxed">
                Manage your 5-stage crafting queue, courier dispatches, customer WhatsApp updates, and catalog in one place.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-2">
              {[
                { icon: Scissors, label: "5-Stage Order Crafting Pipeline" },
                { icon: Palette, label: "Bespoke Custom Requests Inbox" },
                { icon: ShieldCheck, label: "Secure Studio Session Protection" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-[#D6C7B7]">
                    <div className="w-6 h-6 rounded-lg bg-[#3D342D] flex items-center justify-center text-[#E9C46A]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer badge */}
          <div className="pt-6 border-t border-[#3D342D] flex items-center justify-between text-[11px] text-[#8C7D72]">
            <span>Version 2.0 • Production</span>
            <span className="flex items-center gap-1 text-[#7D9D8B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7D9D8B] animate-pulse" />
              Online
            </span>
          </div>
        </div>

        {/* Right Side: High-End Login Form */}
        <div className="lg:col-span-7 bg-[#FAF7F2] text-[#1F1D1B] p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B]">
              Studio Master Login
            </h2>
            <p className="text-xs text-[#5C4F46]">
              Sign in with your authorized admin credentials to manage your store.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1F1D1B]">
                Admin User ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C7D72] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setError("");
                  }}
                  placeholder="artbythread@7"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] text-xs font-medium text-[#1F1D1B] placeholder:text-[#8C7D72] outline-none focus:border-[#C84B31] focus:ring-2 focus:ring-[#C84B31]/15 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#1F1D1B]">
                  Studio Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C7D72] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] text-xs font-medium text-[#1F1D1B] placeholder:text-[#8C7D72] outline-none focus:border-[#C84B31] focus:ring-2 focus:ring-[#C84B31]/15 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-[#8C7D72] hover:text-[#1F1D1B] absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#5C4F46]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E8E0D5] text-[#C84B31] focus:ring-[#C84B31]"
                />
                <span>Stay signed in for 7 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 group"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? "Authenticating..." : "Sign In to Studio Portal"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* 1-Click Fast Fill for Studio Owner */}
          <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8E0D5] space-y-2 text-center shadow-2xs">
            <div className="text-[11px] text-[#8C7D72] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7D9D8B]" />
              <span>Authorized Single Admin Credentials:</span>
            </div>
            <button
              type="button"
              onClick={handleFillCredentials}
              className="w-full py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DE] border border-[#E8E0D5] text-xs font-mono text-[#1F1D1B] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>User: <strong className="text-[#C84B31]">artbythread@7</strong></span>
              <span>•</span>
              <span>Pass: <strong className="text-[#C84B31]">Henviartbythread@7</strong></span>
              <span className="text-[10px] bg-[#C84B31] text-white px-2 py-0.5 rounded-full font-sans">
                Fill
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
