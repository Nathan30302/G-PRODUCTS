import { siteConfig } from "@/config/site";

export function formatPrice(amount: number): string {
  const whole = Number.isInteger(amount);
  const formatted = new Intl.NumberFormat("en-ZM", {
    minimumFractionDigits: whole ? 0 : 1,
    maximumFractionDigits: 1
  }).format(amount);
  return `${siteConfig.currencySymbol} ${formatted}`;
}

export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

const dt = new Intl.DateTimeFormat("en-ZM", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});

export function formatDateTime(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return dt.format(d);
}

export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-ZM", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
