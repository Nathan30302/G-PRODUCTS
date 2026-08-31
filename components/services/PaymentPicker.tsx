"use client";

import { siteConfig } from "@/config/site";
import { serviceOptionClass } from "@/components/services/service-ui";

export type PayMethod = "mtn" | "airtel" | "zamtel";

const options: { id: PayMethod; label: string; number: string }[] = [
  {
    id: "mtn",
    label: siteConfig.mobileMoney.mtn.label,
    number: siteConfig.mobileMoney.mtn.number
  },
  {
    id: "airtel",
    label: siteConfig.mobileMoney.airtel.label,
    number: siteConfig.mobileMoney.airtel.number
  },
  {
    id: "zamtel",
    label: siteConfig.mobileMoney.zamtel.label,
    number: siteConfig.mobileMoney.zamtel.number
  }
];

export function PaymentPicker({
  method,
  onChange
}: {
  method: PayMethod;
  onChange: (m: PayMethod) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-gp-text">Pay with Mobile Money</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={serviceOptionClass(method === opt.id)}
          >
            <span className="block text-sm font-bold text-gp-text">{opt.label}</span>
            <span className="text-xs text-gp-text-muted">{opt.number}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
