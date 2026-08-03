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
