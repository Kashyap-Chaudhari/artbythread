"use client";

import React from "react";
import Image from "next/image";
import {
  Palette,
  Phone,
  Mail,
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { CustomRequest } from "@/lib/types";
import { formatDate, generateWhatsAppUrl } from "@/lib/utils";

export default function CustomRequestsPage() {
  const { customRequests, updateCustomRequestStatus } = useAdminStore();

  const statusColors: Record<CustomRequest["status"], { bg: string; text: string }> = {
    NEW: { bg: "bg-[#FFF3CD]", text: "text-[#856404]" },
    REVIEWING: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
    QUOTED: { bg: "bg-[#F3E8FF]", text: "text-[#6B21A8]" },
    IN_PRODUCTION: { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]" },
    COMPLETED: { bg: "bg-[#E5EDE8]", text: "text-[#2E4B37]" },
    REJECTED: { bg: "bg-red-50", text: "text-red-700" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
          <Palette className="w-3.5 h-3.5 text-[#C84B31]" />
          <span>Bespoke Studio Commissions</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1D1B] mt-0.5">
          Custom Commission Inquiries ({customRequests.length})
        </h1>
        <p className="text-xs text-[#5C4F46]">
          Review personalized requests submitted by customers from the Custom Studio page.
        </p>
      </div>

      {/* Requests List */}
      {customRequests.length > 0 ? (
        <div className="space-y-4">
          {customRequests.map((req) => {
            const statusConfig = statusColors[req.status] || {
              bg: "bg-[#FAF7F2]",
              text: "text-[#1F1D1B]",
            };

            const waReplyText =
              `Hi ${req.full_name}! 🌸 Thank you for your custom commission request on ArtByThread.7 ` +
              `(Request ID: ${req.request_id} for "${req.creation_type}"). We would love to discuss the details and timeline with you!`;

            const waUrl = generateWhatsAppUrl(req.phone, waReplyText);

            return (
              <div
                key={req.request_id}
                className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E0D5]/70 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#C84B31] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8E0D5]">
                      #{req.request_id}
                    </span>
                    <span className="text-xs text-[#8C7D72]">
                      {formatDate(req.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {req.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Main Body */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left: Customer Idea Description */}
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#8C7D72] font-semibold">
                        Bespoke Type
                      </span>
                      <h3 className="font-serif text-xl text-[#1F1D1B]">
                        {req.creation_type}
                      </h3>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] leading-relaxed">
                      <strong>Customer Idea:</strong>
                      <p className="mt-1 text-[#5C4F46] whitespace-pre-wrap">
                        {req.description}
                      </p>
                    </div>

                    {req.color_palette && req.color_palette.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-[#5C4F46]">
                        <strong className="text-[#1F1D1B]">Color Palette:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {req.color_palette.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[11px]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customer Contacts */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C4F46] pt-1">
                      <span className="font-semibold text-[#1F1D1B]">
                        👤 {req.full_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#7D9D8B]" />
                        <span>{req.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#E4929A]" />
                        <span>{req.email}</span>
                      </span>
                      {req.target_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>Deadline: {req.target_date}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Reference Photo if uploaded */}
                  <div className="md:col-span-4 flex flex-col justify-between space-y-4">
                    {req.reference_image_url ? (
                      <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E0D5]">
                        <Image
                          src={req.reference_image_url}
                          alt="Customer Reference"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-center text-xs text-[#8C7D72]">
                        No reference image uploaded
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCustomRequestStatus(req.request_id, "QUOTED")}
                          className="flex-1 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DE] text-xs font-semibold text-[#1F1D1B] border border-[#E8E0D5]"
                        >
                          Mark Quoted
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCustomRequestStatus(req.request_id, "IN_PRODUCTION")}
                          className="flex-1 py-1.5 rounded-xl bg-[#1F1D1B] hover:bg-[#C84B31] text-xs font-semibold text-white"
                        >
                          Start Stitching
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-12 text-center space-y-3 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] text-[#C84B31] flex items-center justify-center mx-auto">
            <Palette className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl text-[#1F1D1B]">
            No Custom Requests Yet
          </h3>
          <p className="text-xs text-[#8C7D72]">
            When visitors submit custom commission requests from the /custom page, they will automatically appear here.
          </p>
        </div>
      )}
    </div>
  );
}
