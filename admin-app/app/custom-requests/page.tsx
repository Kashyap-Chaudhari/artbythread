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
import { CustomRequest, CustomRequestStatus } from "@/lib/types";
import { formatDate, generateWhatsAppUrl } from "@/lib/utils";

export default function CustomRequestsPage() {
  const { customRequests, updateCustomRequestStatus } = useAdminStore();

  const statusColors: Record<CustomRequestStatus, { bg: string; text: string; border: string }> = {
    NEW: { bg: "bg-[#FEF3C7]/60", text: "text-[#92400E]", border: "border-[#FDE68A]" },
    REVIEWING: { bg: "bg-[#FFEDD5]/60", text: "text-[#9A3412]", border: "border-[#FED7AA]" },
    QUOTED: { bg: "bg-[#EDE9FE]/60", text: "text-[#5B21B6]", border: "border-[#DDD6FE]" },
    CUSTOMER_CONFIRMED: { bg: "bg-[#E0F2FE]/60", text: "text-[#075985]", border: "border-[#BAE6FD]" },
    IN_PRODUCTION: { bg: "bg-[#FFEDD5]/60", text: "text-[#9A3412]", border: "border-[#FED7AA]" },
    COMPLETED: { bg: "bg-[#E8EDE6]", text: "text-[#24422D]", border: "border-[#CCD9CA]" },
    REJECTED: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
          <Palette className="w-3.5 h-3.5 text-[#9E3B24]" />
          <span>Bespoke Studio Commissions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-0.5 font-normal">
          Custom Commission Requests ({customRequests.length})
        </h1>
        <p className="text-xs text-[#6E635A]">
          Review personalized requests, embroidery sketches, and custom inquiries submitted by customers.
        </p>
      </div>

      {/* Requests List */}
      {customRequests.length > 0 ? (
        <div className="space-y-5">
          {customRequests.map((req) => {
            const statusConfig = statusColors[req.status] || {
              bg: "bg-[#F8F5EE]",
              text: "text-[#1C1917]",
              border: "border-[#E6DFC8]",
            };

            const waReplyText =
              `Hi ${req.full_name}! 🌸 Thank you for your custom commission request on ArtByThread.7 ` +
              `(Request ID: ${req.request_id} for "${req.creation_type}"). We would love to discuss the details and timeline with you!`;

            const waUrl = generateWhatsAppUrl(req.phone || "", waReplyText);

            return (
              <div
                key={req.request_id}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] p-6 shadow-2xs hover:shadow-xs transition-all space-y-4"
              >
                {/* Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6DFC8] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#9E3B24] bg-[#F8F5EE] px-3 py-1 rounded-lg border border-[#E6DFC8]">
                      #{req.request_id}
                    </span>
                    <span className="text-xs text-[#8C7D72]">
                      {formatDate(req.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
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
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
                        Commission Type
                      </span>
                      <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
                        {req.creation_type}
                      </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#1C1917] leading-relaxed">
                      <strong className="text-[#1C1917] block font-semibold mb-1">Customer Inspiration & Idea:</strong>
                      <p className="text-[#6E635A] font-serif text-base whitespace-pre-wrap">
                        &ldquo;{req.description}&rdquo;
                      </p>
                    </div>

                    {req.color_palette && req.color_palette.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-[#6E635A]">
                        <strong className="text-[#1C1917]">Color Palette:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {req.color_palette.map((c) => (
                            <span
                              key={c}
                              className="px-2.5 py-0.5 rounded-md bg-[#F8F5EE] border border-[#E6DFC8] text-[11px]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customer Contacts */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E635A] pt-1">
                      <span className="font-semibold text-[#1C1917]">
                        👤 {req.full_name}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-[#3A5A40]" />
                        <span>{req.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#9E3B24]" />
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
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#F8F5EE] border border-[#E6DFC8]">
                        <Image
                          src={req.reference_image_url}
                          alt="Customer Reference"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-center text-xs text-[#8C7D72]">
                        No reference sketch uploaded
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCustomRequestStatus(req.request_id, "QUOTED")}
                          className="flex-1 py-2 rounded-lg bg-[#F8F5EE] hover:bg-[#EDE5D6] text-xs font-semibold text-[#1C1917] border border-[#E6DFC8] transition-colors cursor-pointer"
                        >
                          Mark Quoted
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCustomRequestStatus(req.request_id, "IN_PRODUCTION")}
                          className="flex-1 py-2 rounded-lg bg-[#181615] hover:bg-[#9E3B24] text-xs font-semibold text-white transition-colors cursor-pointer"
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
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] p-12 text-center space-y-3 max-w-lg mx-auto shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F8F5EE] border border-[#E6DFC8] text-[#9E3B24] flex items-center justify-center mx-auto text-2xl">
            💌
          </div>
          <h3 className="font-serif text-2xl text-[#1C1917]">
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
