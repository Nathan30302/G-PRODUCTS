"use client";

import { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/AddToCartButton";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";

export function ProductActions({ product }: { product: Product }) {
  const waLink = productWhatsAppLink(
    product,
    typeof window !== "undefined" ? window.location.href : undefined
  );

  return (
    <div className="space-y-3">
      <AddToCartButton product={product} />
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-3 font-semibold text-accent hover:bg-accent/20"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Order on WhatsApp
      </a>
    </div>
  );
}
