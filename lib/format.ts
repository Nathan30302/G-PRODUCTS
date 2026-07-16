import { siteConfig } from "@/config/site";

export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat("en-ZM", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
  return `${siteConfig.currencySymbol} ${formatted}`;
}

export function discountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
