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
  Scissors,
  Bookmark,
} from "lucide-react";
import { useAdminStore } from "@/lib/store";
import { OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice, formatDate, generateWhatsAppUrl, generateCustomerWhatsAppUpdate, getStoreUrl } from "@/lib/utils";
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
      <div className="p-12 text-center space-y-4 bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] max-w-xl mx-auto">
        <h2 className="font-serif text-3xl text-[#1C1917]">Order Not Located</h2>
        <p className="text-xs text-[#8C7D72]">
          Could not find Order #{orderId} in the studio ledger.
        </p>
        <Link
          href="/orders"
          className="inline-block py-2.5 px-6 rounded-xl bg-[#181615] text-white text-xs font-semibold hover:bg-[#9E3B24] transition-colors"
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
    alert("Studio notes recorded successfully.");
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === "shipped") {
      setIsCourierModalOpen(true);
    } else {
      updateOrderStatus(order.order_id, newStatus);
    }
  };

  const storeUrl = getStoreUrl();
  const trackingLink = `${storeUrl}/order/${order.order_id}`;
  const waUrl = generateWhatsAppUrl(
    order.customer_phone || "",
    generateCustomerWhatsAppUpdate(order, order.status)
  );

  const stages: { key: OrderStatus; label: string }[] = [
    { key: "new", label: "1. New Enquiry" },
    { key: "confirmed", label: "2. Confirmed Slot" },
    { key: "in_progress", label: "3. Handcrafting" },
    { key: "shipped", label: "4. Dispatched (Courier)" },
    { key: "delivered", label: "5. Delivered" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs text-[#8C7D72] hover:text-[#9E3B24] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={trackingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 rounded-xl bg-[#FFFDF9] hover:bg-[#F8F5EE] border border-[#E6DFC8] text-xs font-semibold text-[#1C1917] flex items-center gap-1.5 shadow-2xs"
          >
            <span>Customer Tracking Link</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7D72]" />
          </a>

          {order.customer_phone && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>WhatsApp Customer</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Order Dossier */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E6DFC8] p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6DFC8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#9E3B24]" />
              <span>Workshop Job Ticket</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] mt-1 font-normal">
              Order <span className="text-[#9E3B24] font-mono font-bold">#{order.order_id}</span>
            </h1>
            <p className="text-xs text-[#6E635A] mt-1">
              Logged on {formatDate(order.created_at)} via{" "}
              <strong className="capitalize">{order.preferred_channel || "WhatsApp"}</strong>
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="text-xs text-[#8C7D72] block font-medium">Pipeline Status</span>
            <StatusBadge status={order.status} size="lg" />
          </div>
        </div>

        {/* 5-Stage Transition Buttons */}
        <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] space-y-2.5">
          <div className="text-[11px] font-semibold text-[#1C1917] uppercase tracking-wider">
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
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[#9E3B24] text-white shadow-xs"
                      : "bg-[#FFFDF9] hover:bg-[#EDE5D6] text-[#6E635A] border border-[#E6DFC8]"
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
            <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
              Creation Specification
            </h3>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8]">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#FFFDF9] border border-[#E6DFC8] shrink-0">
                {order.product_photo_url ? (
                  <Image
                    src={order.product_photo_url}
                    alt={order.product_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#8C7D72]">
                    <Package className="w-8 h-8 text-[#9E3B24]" />
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <h4 className="font-serif text-lg text-[#1C1917] font-normal">
                  {order.product_name}
                </h4>
                <div className="text-[#6E635A]">Qty: {order.quantity} item(s)</div>
                <div className="text-[#6E635A]">Variant: {order.size_variant || "Standard Size"}</div>
                {order.quoted_price && (
                  <div className="font-bold text-sm text-[#1C1917] pt-1">
                    {formatPrice(order.quoted_price)}
                  </div>
                )}
              </div>
            </div>

            {order.customization_note && (
              <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] text-xs text-[#6E635A] space-y-1">
                <strong className="text-[#1C1917] block font-semibold">Customization Note from Customer:</strong>
                <p className="italic font-serif text-base text-[#1C1917] whitespace-pre-wrap">&ldquo;{order.customization_note}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Right: Customer & Delivery Information */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl text-[#1C1917] font-normal">
              Recipient & Shipping
            </h3>

            <div className="p-4 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] space-y-2.5 text-xs text-[#6E635A]">
              <div className="flex items-center gap-2">
                <span className="w-4 font-bold text-[#1C1917]">👤</span>
                <div>
                  <strong className="text-[#1C1917]">Name:</strong> {order.customer_name}
                </div>
              </div>

              {order.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#3A5A40]" />
                  <div>
                    <strong className="text-[#1C1917]">Phone:</strong>{" "}
                    <span className="font-mono">{order.customer_phone}</span>
                  </div>
                </div>
              )}

              {order.customer_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#9E3B24]" />
                  <div>
                    <strong className="text-[#1C1917]">Email:</strong> {order.customer_email}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9E3B24]" />
                <div>
                  <strong className="text-[#1C1917]">City:</strong> {order.delivery_city || "India"}
                </div>
              </div>

              {order.address && (
                <div className="pt-2 border-t border-[#E6DFC8]">
                  <strong className="text-[#1C1917]">Full Address:</strong>
                  <p>{order.address}, {order.state} - {order.pincode}</p>
                </div>
              )}

              {/* Direct Quick Contact Buttons */}
              <div className="pt-3 border-t border-[#E6DFC8] flex flex-wrap gap-2">
                {order.customer_phone && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-[#25D366] text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#20bd5a] transition-colors"
                  >
                    <span>💬 WhatsApp Customer</span>
                  </a>
                )}
                {order.customer_email && (
                  <a
                    href={`mailto:${order.customer_email}?subject=${encodeURIComponent(`🧵 [ArtByThread] Update on Order #${order.order_id} - ${order.product_name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-[#2563EB] text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#1d4ed8] transition-colors"
                  >
                    <span>📧 Email Customer</span>
                  </a>
                )}
                <a
                  href="https://instagram.com/artbythread.7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-[#E1306C] text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-[#c1275b] transition-colors"
                >
                  <span>📸 Instagram Studio</span>
                </a>
              </div>
            </div>

            {/* Courier Dispatch Card */}
            <div className="p-4 rounded-xl bg-[#E0F2FE]/40 border border-[#BAE6FD] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#075985] font-semibold">
                  <Truck className="w-4 h-4" />
                  <span>Courier & Tracking</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCourierModalOpen(true)}
                  className="text-xs font-semibold text-[#0284C7] underline hover:text-[#075985] cursor-pointer"
                >
                  {order.tracking_number ? "Edit Tracking" : "Assign Tracking"}
                </button>
              </div>

              {order.shipping_carrier && order.tracking_number ? (
                <div className="text-[#075985]">
                  <div>Carrier: <strong>{order.shipping_carrier}</strong></div>
                  <div>Tracking AWB: <strong className="font-mono">{order.tracking_number}</strong></div>
                </div>
              ) : (
                <p className="text-[11px] text-[#8C7D72]">
                  No courier assigned yet. Click Assign Tracking when ready to dispatch.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Studio Admin Private Notes */}
        <div className="p-6 rounded-xl bg-[#F8F5EE] border border-[#E6DFC8] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#8C7D72] font-semibold">
              Atelier Internal Diary Notes (Private)
            </h4>
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="py-1.5 px-3.5 rounded-lg bg-[#181615] hover:bg-[#9E3B24] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g. Thread color #44B applied. Customer requested pastel packaging..."
            className="w-full p-3 rounded-lg bg-[#FFFDF9] border border-[#E6DFC8] text-xs text-[#1C1917] outline-none focus:border-[#9E3B24]"
          />
        </div>

        {/* Delete Order Button */}
        <div className="pt-4 border-t border-[#E6DFC8] flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to permanently delete Order #${order.order_id}?`)) {
                deleteOrder(order.order_id);
                router.push("/orders");
              }
            }}
            className="py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
