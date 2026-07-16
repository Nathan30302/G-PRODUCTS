"use client";

import { siteConfig } from "@/config/site";

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
      <p className="text-sm font-semibold text-white">Pay with Mobile Money</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              method === opt.id
                ? "border-brand bg-brand/10"
                : "border-ink-700 bg-ink-900 hover:border-ink-600"
            }`}
          >
            <span className="block text-sm font-bold text-white">{opt.label}</span>
            <span className="text-xs text-white/50">{opt.number}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
