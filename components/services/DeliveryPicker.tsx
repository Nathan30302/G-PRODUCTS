"use client";

import { siteConfig } from "@/config/site";
import { serviceField, serviceLabel, serviceOptionClass } from "@/components/services/service-ui";

export type DeliveryMethod = "PICKUP" | "YANGO";

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
      <p className="text-sm font-semibold text-gp-text">How do you want it?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onMethod("PICKUP")}
          className={serviceOptionClass(method === "PICKUP", true)}
        >
          <span className="block font-bold text-gp-text">Pickup</span>
          <span className="text-sm text-gp-text-muted">{siteConfig.branch}</span>
        </button>
        <button
          type="button"
          onClick={() => onMethod("YANGO")}
          className={serviceOptionClass(method === "YANGO", true)}
        >
          <span className="block font-bold text-gp-text">Yango delivery</span>
          <span className="text-sm text-gp-text-muted">
            Delivered by G-Products (Yango)
          </span>
        </button>
      </div>
      {method === "YANGO" && (
        <label className="block">
          <span className={serviceLabel}>Delivery address / area</span>
          <input
            value={address}
            onChange={(e) => onAddress(e.target.value)}
            className={serviceField}
            placeholder="e.g. Kabulonga, Lusaka — near Shoprite"
            required
          />
        </label>
      )}
      <p className="text-xs text-gp-text-subtle">{siteConfig.deliveryNote}</p>
    </div>
  );
}
