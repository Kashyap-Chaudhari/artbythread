"use client";

import React, { useState } from "react";
import { Order } from "@/lib/types";
import { Truck, X, Check, ExternalLink } from "lucide-react";

interface CourierModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDispatch: (carrier: string, trackingNumber: string, notes?: string) => void;
}

export const CourierModal: React.FC<CourierModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmDispatch,
}) => {
  const [carrier, setCarrier] = useState("DTDC Express");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen || !order) return null;

  const popularCarriers = [
    "DTDC Express",
    "Delhivery",
    "Blue Dart",
    "India Post (Speed Post)",
    "Shadowfax",
    "Trackon",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      alert("Please enter the courier tracking number.");
      return;
    }
    onConfirmDispatch(carrier, trackingNumber.trim(), notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#1F1D1B]">
                Dispatch Order #{order.order_id}
              </h3>
              <p className="text-xs text-[#8C7D72]">
                Assign courier tracking to advance to Stage 4 (Dispatched)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#8C7D72] hover:text-[#1F1D1B] hover:bg-[#FAF7F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer Summary */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] space-y-1 text-xs text-[#5C4F46]">
          <div>
            <strong>Recipient:</strong> {order.customer_name} ({order.customer_phone})
          </div>
          <div>
            <strong>Delivery City:</strong> {order.delivery_city}
          </div>
          <div>
            <strong>Item:</strong> {order.product_name} (Qty: {order.quantity})
          </div>
        </div>

        {/* Dispatch Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F1D1B] mb-1.5">
              Shipping Carrier *
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
            >
              {popularCarriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1D1B] mb-1.5">
              Tracking / AWB Number *
            </label>
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. DTDC-889421 or DEL-90219402"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs font-mono text-[#1F1D1B] outline-none focus:border-[#C84B31]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1D1B] mb-1.5">
              Dispatch Note (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Handed to pickup agent at 4:30 PM"
              className="w-full px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-xs text-[#1F1D1B] outline-none focus:border-[#C84B31]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8DE] text-xs font-semibold text-[#5C4F46] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm & Dispatch</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
