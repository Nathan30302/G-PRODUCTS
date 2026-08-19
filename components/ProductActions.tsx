"use client";

import { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/AddToCartButton";
import { NotifyMeForm } from "@/components/NotifyMeForm";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";
import { useProductVariant } from "@/components/ProductVariantContext";

export function ProductActions({ product }: { product: Product }) {
  const { selected } = useProductVariant();

  const waLink = productWhatsAppLink(
    product,
    typeof window !== "undefined" ? window.location.href : undefined,
    selected ?? undefined
  );

  const unavailable = selected
    ? !selected.available
    : product.stock === "sold_out";

  return (
    <div id="buy" className="scroll-mt-28 space-y-3">
      {unavailable ? (
        <NotifyMeForm
          productId={product.id}
          variantId={selected?.id}
          variantName={selected?.name}
        />
      ) : (
        <AddToCartButton product={product} variant={selected} />
      )}

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-pill border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-accent/30 hover:text-accent"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Order on WhatsApp
      </a>
    </div>
  );
}
