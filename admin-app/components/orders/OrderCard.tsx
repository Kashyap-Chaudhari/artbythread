"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Phone,
  Mail,
  MapPin,
  Palette,
  ExternalLink,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  Trash2,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice, formatDate, generateCustomerWhatsAppUpdate, generateWhatsAppUrl } from "@/lib/utils";
import { CourierModal } from "./CourierModal";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (
    orderId: string,
    newStatus: OrderStatus,
    carrier?: string,
    trackingNum?: string,
    notes?: string
  ) => void;
  onDelete: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onDelete,
}) => {
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);

  const statusHierarchy: OrderStatus[] = [
    "new",
    "confirmed",
    "in_progress",
    "shipped",
    "delivered",
  ];

  const currentIdx = statusHierarchy.indexOf(order.status);
  const nextStatus = currentIdx >= 0 && currentIdx < statusHierarchy.length - 1
    ? statusHierarchy[currentIdx + 1]
    : null;

  const nextStatusLabels: Record<OrderStatus, string> = {
    new: "Mark as New",
    confirmed: "Confirm Order (Stage 2)",
    in_progress: "Start Production (Stage 3)",
    shipped: "Dispatch Courier (Stage 4)",
    delivered: "Mark Delivered (Stage 5)",
    cancelled: "Cancel Order",
  };

  const handleAdvanceStage = () => {
    if (!nextStatus) return;
    if (nextStatus === "shipped") {
      setIsCourierModalOpen(true);
    } else {
      onUpdateStatus(order.order_id, nextStatus);
    }
  };

  const handleConfirmDispatch = (carrier: string, trackingNumber: string, notes?: string) => {
    onUpdateStatus(order.order_id, "shipped", carrier, trackingNumber, notes);
  };

  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
  const trackingLink = `${storeUrl}/order/${order.order_id}`;

  // WhatsApp quick update message
  const waUpdateMsg = generateCustomerWhatsAppUpdate(order, order.status);
  const waUrl = generateWhatsAppUrl(order.customer_phone, waUpdateMsg);

  return (
    <>
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Top Bar: Order ID, Channel, Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E0D5]/70 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#C84B31] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8E0D5]">
                #{order.order_id}
              </span>
              <span className="text-[11px] text-[#8C7D72] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(order.created_at)}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Product Thumbnail & Details */}
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E8E0D5] shrink-0">
              {order.product_photo_url ? (
                <Image
                  src={order.product_photo_url}
                  alt={order.product_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8C7D72]">
                  <Package className="w-6 h-6 text-[#C84B31]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-serif text-base sm:text-lg text-[#1F1D1B] truncate font-normal">
                {order.product_name}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C4F46]">
                <span className="font-semibold text-[#1F1D1B]">
                  Qty: {order.quantity}
                </span>
                <span>•</span>
                <span>{order.size_variant || "Standard Size"}</span>
                {order.quoted_price && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-[#1F1D1B]">
                      {formatPrice(order.quoted_price)}
                    </span>
                  </>
                )}
              </div>

              {/* Customer Contact Badges */}
              <div className="pt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C4F46]">
                <span className="font-semibold text-[#1F1D1B] flex items-center gap-1">
                  👤 {order.customer_name}
                </span>
                {order.customer_phone && (
                  <span className="text-[#8C7D72] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#7D9D8B]" />
                    <span>{order.customer_phone}</span>
                  </span>
                )}
                {order.delivery_city && (
                  <span className="text-[#8C7D72] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E4929A]" />
                    <span>{order.delivery_city}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customization Details */}
          {order.customization_note && (
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5] text-xs text-[#5C4F46] flex items-start gap-2">
              <Palette className="w-3.5 h-3.5 text-[#C84B31] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1F1D1B]">Custom Note:</strong>{" "}
                <span className="italic">&ldquo;{order.customization_note}&rdquo;</span>
              </div>
            </div>
          )}

          {/* Courier Info if Dispatched */}
          {order.shipping_carrier && order.tracking_number && (
            <div className="p-3 bg-[#E0F2FE]/50 rounded-2xl border border-[#BAE6FD] text-xs text-[#0369A1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0284C7]" />
                <span>
                  <strong>{order.shipping_carrier}</strong> • Tracking: <span className="font-mono font-bold">{order.tracking_number}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCourierModalOpen(true)}
                className="text-[11px] font-semibold text-[#0284C7] underline hover:text-[#0369A1]"
              >
                Edit
              </button>
            </div>
          )}

          {/* 5-Stage Visual Stepper */}
          <div className="pt-2 border-t border-[#E8E0D5]/70">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C7D72] mb-1.5">
              <span>Crafting Pipeline</span>
              <span className="text-[#1F1D1B]">
                Stage {Math.max(currentIdx + 1, 1)} of 5
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[
                { stage: "new", label: "1. New" },
                { stage: "confirmed", label: "2. Confirm" },
                { stage: "in_progress", label: "3. Crafting" },
                { stage: "shipped", label: "4. Dispatch" },
                { stage: "delivered", label: "5. Done" },
              ].map((s, idx) => {
                const isPassed = currentIdx >= idx;
                const isCurrent = currentIdx === idx;

                return (
                  <button
                    key={s.stage}
                    type="button"
                    onClick={() => {
                      if (s.stage === "shipped") {
                        setIsCourierModalOpen(true);
                      } else {
                        onUpdateStatus(order.order_id, s.stage as OrderStatus);
                      }
                    }}
                    className={`py-1.5 px-1 text-center rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-[#C84B31] text-white shadow-xs"
                        : isPassed
                        ? "bg-[#E5EDE8] text-[#2E4B37] hover:bg-[#d5e4db]"
                        : "bg-[#FAF7F2] text-[#8C7D72] hover:bg-[#EFE8DE] border border-[#E8E0D5]"
                    }`}
                    title={`Click to set status to ${s.label}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-3 border-t border-[#E8E0D5] flex flex-wrap items-center justify-between gap-2">
          {/* 1-Click Next Stage Transition */}
          {nextStatus ? (
            <button
              type="button"
              onClick={handleAdvanceStage}
              className="py-2.5 px-4 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>{nextStatusLabels[nextStatus]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="text-xs font-semibold text-[#2E4B37] flex items-center gap-1 bg-[#E5EDE8] px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Order Completed</span>
            </div>
          )}

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5">
            {/* WhatsApp Status Update */}
            {order.customer_phone && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Send pre-filled status update to customer on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                <span>WhatsApp Customer</span>
              </a>
            )}

            {/* Public Live Tracking Card Link */}
            <a
              href={trackingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#3D342D] border border-[#E8E0D5] transition-colors"
              title="Open public customer tracking page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Delete Order */}
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete Order #${order.order_id}?`)) {
                  onDelete(order.order_id);
                }
              }}
              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-red-50 text-[#8C7D72] hover:text-red-600 border border-[#E8E0D5] transition-colors cursor-pointer"
              title="Delete order"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Courier Assignment Modal */}
      <CourierModal
        order={order}
        isOpen={isCourierModalOpen}
        onClose={() => setIsCourierModalOpen(false)}
        onConfirmDispatch={handleConfirmDispatch}
      />
    </>
  );
};
