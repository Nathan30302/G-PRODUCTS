import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";

export function productWhatsAppLink(product: Product, url?: string): string {
  const lines = [
    `Hi G-Products, I'm interested in:`,
    `*${product.name}* - ${formatPrice(product.price)}`,
    url ? `Link: ${url}` : ""
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function orderWhatsAppLink(
  items: { name: string; qty: number; price: number }[],
  total: number
): string {
  const header = "Hi G-Products, I'd like to order:";
  const body = items
    .map((i) => `- ${i.name} x${i.qty} (${formatPrice(i.price * i.qty)})`)
    .join("\n");
  const footer = `Total: ${formatPrice(total)}`;
  const text = encodeURIComponent(`${header}\n${body}\n${footer}`);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}
