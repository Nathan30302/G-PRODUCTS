"use client";

import { siteConfig } from "@/config/site";

export type DeliveryMethod = "PICKUP" | "YANGO";

const field =
  "mt-1 w-full rounded-xl border border-ink-950/10 bg-[#f7f8f9] px-4 py-2.5 text-ink-950 outline-none focus:border-brand";

export function DeliveryPicker({
  method,
  address,
  onMethod,
  onAddress
}: {
  method: DeliveryMethod;
  address: string;
  onMethod: (m: DeliveryMethod) => void;
  onAddress: (a: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-ink-950">How do you want it?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onMethod("PICKUP")}
          className={`rounded-xl border p-4 text-left transition-colors ${
            method === "PICKUP"
              ? "border-brand bg-brand/10"
              : "border-ink-700 bg-white hover:border-ink-600"
          }`}
        >
          <span className="block font-bold text-ink-950">Pickup</span>
          <span className="text-sm text-ink-950/45">{siteConfig.branch}</span>
        </button>
        <button
          type="button"
          onClick={() => onMethod("YANGO")}
          className={`rounded-xl border p-4 text-left transition-colors ${
            method === "YANGO"
              ? "border-brand bg-brand/10"
              : "border-ink-700 bg-white hover:border-ink-600"
          }`}
        >
          <span className="block font-bold text-ink-950">Yango delivery</span>
          <span className="text-sm text-ink-950/45">
            Delivered by G-Products (Yango)
          </span>
        </button>
      </div>
      {method === "YANGO" && (
        <label className="block">
          <span className="text-sm text-ink-950/50">Delivery address / area</span>
          <input
            value={address}
            onChange={(e) => onAddress(e.target.value)}
            className={field}
            placeholder="e.g. Kabulonga, Lusaka — near Shoprite"
            required
          />
        </label>
      )}
      <p className="text-xs text-ink-950/40">{siteConfig.deliveryNote}</p>
    </div>
  );
}
