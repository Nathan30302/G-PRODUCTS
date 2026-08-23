import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { Product, ProductVariant } from "@/lib/types";

export function productWhatsAppLink(
  product: Product,
  url?: string,
  variant?: ProductVariant,
  fitment?: string
): string {
  const bits = [variant?.name, fitment].filter(Boolean).join(" · ");
  const name = bits ? `${product.name} (${bits})` : product.name;
  const price = formatPrice(variant?.price ?? product.price);
  const lines = [
    `Hi G-Products, I'm interested in the ${name} at ${price}. Is it available?`,
    url ? `Link: ${url}` : ""
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function orderWhatsAppLink(
  items: { name: string; qty: number; price: number }[],
  total: number,
  orderRef?: string
): string {
  const header = orderRef
    ? `Hi G-Products, I've placed order *${orderRef}* and paid / will pay:`
    : "Hi G-Products, I'd like to order:";
  const body = items
    .map((i) => `- ${i.name} x${i.qty} (${formatPrice(i.price * i.qty)})`)
    .join("\n");
  const footer = `Total: ${formatPrice(total)}`;
  const text = encodeURIComponent(`${header}\n${body}\n${footer}`);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function serviceWhatsAppLink(lines: string[]): string {
  const text = encodeURIComponent(
    ["Hi G-Products, I'd like a service:", ...lines].join("\n")
  );
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}
