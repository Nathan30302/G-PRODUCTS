"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import { Icon } from "@/components/Icons";
import { Product, unitPrice, hasPricedOptions } from "@/lib/types";
import { useProductVariant } from "@/components/ProductVariantContext";
import { coverImageForProduct } from "@/lib/product-images";

export function MobileBuyBar({ product }: { product: Product }) {
  const { add } = useCart();
  const { toast } = useToast();
  const { selected } = useProductVariant();

  const soldOut = product.stock === "sold_out";
  const multi = product.variants.length > 1;
  const chosen = selected ?? product.variants.find((v) => v.available) ?? null;
  const displayPrice = unitPrice(product, chosen);
  const chooseLabel = hasPricedOptions(product) ? "Choose option" : "Choose colour";
  const waLink = productWhatsAppLink(
    product,
    typeof window !== "undefined" ? window.location.href : undefined,
    chosen ?? undefined
  );

  function handleAdd() {
    if (soldOut || !chosen?.available) return;
    if (multi && !selected) return;
    add(product, chosen);
    toast({
      title: "Added to cart",
      description: `${product.name} · ${chosen.name}`,
      image: coverImageForProduct(product, chosen),
      href: "/cart",
      hrefLabel: "View cart"
    });
  }

  const canQuickAdd = chosen?.available && (!multi || selected);

  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+3.75rem)] z-40 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur-lg md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-white/45">
            {selected ? `${selected.name} · ` : ""}
            Price
          </p>
          <p className="truncate text-lg font-extrabold text-white">
            {formatPrice(displayPrice)}
          </p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on WhatsApp"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-accent/40 bg-accent/10 text-accent"
        >
          <Icon name="whatsapp" className="h-5 w-5" />
        </a>
        {soldOut || !chosen?.available ? (
          <Link
            href="#buy"
            className="flex flex-1 items-center justify-center rounded-pill border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/60"
          >
            Notify me
          </Link>
        ) : !canQuickAdd ? (
          <Link
            href="#buy"
            className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950"
          >
            {chooseLabel}
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950 transition-all active:scale-[0.98]"
          >
            <Icon name="cart" className="h-4 w-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
