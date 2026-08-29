"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Phone,
  Mail,
  MapPin,
  Palette,
  Truck,
  MessageCircle,
  ExternalLink,
  Save,
  CheckCircle2,
  Clock,
  Trash2,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice, formatDate, generateWhatsAppUrl, generateCustomerWhatsAppUpdate } from "@/lib/utils";
import { CourierModal } from "@/components/orders/CourierModal";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const orderId = decodeURIComponent(rawId || "").trim();

  const { orders, updateOrderStatus, deleteOrder } = useAdminStore();
  const order = orders.find(
    (o) =>
      (o.order_id && o.order_id.toUpperCase() === orderId.toUpperCase()) ||
      (o.id && o.id.toUpperCase() === orderId.toUpperCase())
  );

  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState(order?.admin_notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5]">
        <h2 className="font-serif text-2xl text-[#1F1D1B]">Order Not Found</h2>
        <p className="text-xs text-[#8C7D72]">
          Could not locate Order #{orderId} in the studio database.
        </p>
        <Link
          href="/orders"
          className="inline-block py-2.5 px-6 rounded-full bg-[#1F1D1B] text-white text-xs font-semibold"
        >
          ← Return to Orders Pipeline
        </Link>
      </div>
    );
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await updateOrderStatus(
      order.order_id,
      order.status,
      order.shipping_carrier,
      order.tracking_number,
      adminNotes
    );
    setIsSavingNotes(false);
    alert("Studio notes saved successfully.");
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === "shipped") {
      setIsCourierModalOpen(true);
    } else {
      updateOrderStatus(order.order_id, newStatus);
    }
  };

  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
  const trackingLink = `${storeUrl}/order/${order.order_id}`;
  const waUrl = generateWhatsAppUrl(
    order.customer_phone,
    generateCustomerWhatsAppUpdate(order, order.status)
  );

  const stages: { key: OrderStatus; label: string }[] = [
    { key: "new", label: "Stage 1: New Enquiry" },
    { key: "confirmed", label: "Stage 2: Confirmed" },
    { key: "in_progress", label: "Stage 3: In Production" },
    { key: "shipped", label: "Stage 4: Dispatched" },
    { key: "delivered", label: "Stage 5: Delivered" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs text-[#8C7D72] hover:text-[#C84B31] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={trackingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F2] border border-[#E8E0D5] text-xs font-semibold text-[#1F1D1B] flex items-center gap-1.5 shadow-xs"
          >
            <span>Customer Tracking Card</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {order.customer_phone && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>WhatsApp Customer</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E0D5] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
              <Package className="w-4 h-4 text-[#C84B31]" />
              <span>Order Details & Status Control</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1D1B] mt-1 font-normal">
              Order <span className="text-[#C84B31] font-mono font-bold">#{order.order_id}</span>
            </h1>
            <p className="text-xs text-[#5C4F46] mt-1">
              Logged on {formatDate(order.created_at)} via{" "}
              <strong className="capitalize">{order.preferred_channel || "WhatsApp"}</strong>
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="text-xs text-[#8C7D72] block font-semibold">Current Pipeline Status</span>
            <StatusBadge status={order.status} size="lg" />
          </div>
        </div>

        {/* 5-Stage Transition Buttons */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-3">
          <div className="text-xs font-semibold text-[#1F1D1B] uppercase tracking-wider">
            Quick Stage Transition
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stages.map((st) => {
              const isCurrent = order.status === st.key;
              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => handleStatusChange(st.key)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[#C84B31] text-white shadow-md"
                      : "bg-[#FFFDF9] hover:bg-[#EFE8DE] text-[#5C4F46] border border-[#E8E0D5]"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product & Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Product Overview */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-serif text-xl text-[#1F1D1B]">
              Creation Information
            </h3>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5]">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#FFFDF9] border border-[#E8E0D5] shrink-0">
                {order.product_photo_url ? (
                  <Image
                    src={order.product_photo_url}
                    alt={order.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8C7D72]">
                    <Package className="w-8 h-8 text-[#C84B31]" />
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <h4 className="font-serif text-base text-[#1F1D1B] font-bold">
                  {order.product_name}
                </h4>
                <div className="text-[#5C4F46]">Qty: {order.quantity} item(s)</div>
                <div className="text-[#5C4F46]">Variant: {order.size_variant || "Standard Size"}</div>
                {order.quoted_price && (
                  <div className="font-bold text-sm text-[#1F1D1B] pt-1">
                    {formatPrice(order.quoted_price)}
                  </div>
                )}
              </div>
            </div>

            {order.customization_note && (
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#5C4F46] space-y-1">
                <strong className="text-[#1F1D1B]">Customization Note from Customer:</strong>
                <p className="italic whitespace-pre-wrap">&ldquo;{order.customization_note}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Right: Customer & Delivery Information */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-serif text-xl text-[#1F1D1B]">
              Customer & Shipping
            </h3>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-2.5 text-xs text-[#5C4F46]">
              <div className="flex items-center gap-2">
                <span className="w-4 font-bold text-[#1F1D1B]">👤</span>
                <div>
                  <strong className="text-[#1F1D1B]">Name:</strong> {order.customer_name}
                </div>
              </div>

              {order.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#7D9D8B]" />
                  <div>
                    <strong className="text-[#1F1D1B]">Phone:</strong> {order.customer_phone}
                  </div>
                </div>
              )}

              {order.customer_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#E4929A]" />
                  <div>
                    <strong className="text-[#1F1D1B]">Email:</strong> {order.customer_email}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C84B31]" />
                <div>
                  <strong className="text-[#1F1D1B]">City:</strong> {order.delivery_city || "India"}
                </div>
              </div>

              {order.address && (
                <div className="pt-2 border-t border-[#E8E0D5]">
                  <strong className="text-[#1F1D1B]">Full Address:</strong>
                  <p>{order.address}, {order.state} - {order.pincode}</p>
                </div>
              )}
            </div>

            {/* Courier Dispatch Card */}
            <div className="p-4 rounded-2xl bg-[#E0F2FE]/40 border border-[#BAE6FD] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#0369A1] font-semibold">
                  <Truck className="w-4 h-4" />
                  <span>Courier & Tracking</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCourierModalOpen(true)}
                  className="text-xs font-semibold text-[#0284C7] underline hover:text-[#0369A1] cursor-pointer"
                >
                  {order.tracking_number ? "Edit Tracking" : "Assign Tracking"}
                </button>
              </div>

              {order.shipping_carrier && order.tracking_number ? (
                <div className="text-[#0369A1]">
                  <div>Carrier: <strong>{order.shipping_carrier}</strong></div>
                  <div>Tracking AWB: <strong className="font-mono">{order.tracking_number}</strong></div>
                </div>
              ) : (
                <p className="text-[11px] text-[#8C7D72]">
                  No courier assigned yet. Click Assign Tracking when handing to courier.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Studio Admin Private Notes */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-widest text-[#8C7D72] font-semibold">
              Studio Internal Notes (Private)
            </h4>
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="py-1.5 px-3.5 rounded-full bg-[#1F1D1B] hover:bg-[#C84B31] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g. Thread color #44B applied. Customer asked for delivery before Friday..."
            className="w-full p-3 rounded-xl bg-[#FFFDF9] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
          />
        </div>

        {/* Delete Order Button */}
        <div className="pt-4 border-t border-[#E8E0D5] flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to permanently delete Order #${order.order_id}?`)) {
                deleteOrder(order.order_id);
                router.push("/orders");
              }
            }}
            className="py-2 px-4 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Order Record</span>
          </button>
        </div>
      </div>

      {/* Courier Assignment Modal */}
      <CourierModal
        order={order}
        isOpen={isCourierModalOpen}
        onClose={() => setIsCourierModalOpen(false)}
        onConfirmDispatch={(carrier, trackingNumber, notes) => {
          updateOrderStatus(order.order_id, "shipped", carrier, trackingNumber, notes);
        }}
      />
    </div>
  );
}
