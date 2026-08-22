"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icons";
import { Product, ProductVariant, hasPricedOptions } from "@/lib/types";
import { coverImageForProduct } from "@/lib/product-images";

export function AddToCartButton({
  product,
  variant,
  qty = 1,
  fitment,
  requireFitment = false,
  compact = false,
  requireOptions = false
}: {
  product: Product;
  variant?: ProductVariant | null;
  qty?: number;
  fitment?: string | null;
  /** When true, block add until fitment is chosen */
  requireFitment?: boolean;
  compact?: boolean;
  /** On cards: if multiple options, link to product page instead of adding */
  requireOptions?: boolean;
}) {
  const { add } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  const multiOptions = product.variants.length > 1;
  const soldOut = product.stock === "sold_out";
  const variantSoldOut = variant ? !variant.available : false;
  const chooseLabel = hasPricedOptions(product) ? "Choose option" : "Choose colour";
  const needsFitment = requireFitment && !fitment;

  if (soldOut || variantSoldOut) {
    return (
      <Link
        href={`/product/${product.slug}`}
        className={`flex w-full items-center justify-center rounded-pill border border-white/15 bg-white/[0.04] font-semibold text-white/50 ${
          compact ? "px-4 py-2 text-sm" : "px-4 py-3"
        }`}
      >
        Notify me
      </Link>
    );
  }

  if (requireOptions && multiOptions) {
    return (
      <Link
        href={`/product/${product.slug}`}
        className={`flex w-full items-center justify-center gap-2 rounded-pill bg-brand font-semibold text-ink-950 hover:bg-brand-soft ${
          compact ? "px-4 py-2 text-sm" : "px-4 py-3"
        }`}
      >
        {chooseLabel}
      </Link>
    );
  }

  function handleAdd() {
    if (needsFitment) return;
    const chosen =
      variant ??
      product.variants.find((v) => v.available) ??
      product.variants[0];
    if (product.variants.length > 0 && (!chosen || !chosen.available)) return;
    const n = Math.max(1, Math.round(qty));
    add(product, chosen, n, fitment ?? undefined);
    setAdded(true);
    const detail = [chosen?.name, fitment].filter(Boolean).join(" · ");
    toast({
      title: n > 1 ? `Added ×${n}` : "Added to cart",
      description: detail ? `${product.name} · ${detail}` : product.name,
      image: coverImageForProduct(product, chosen, fitment),
      href: "/cart",
      hrefLabel: "View cart"
    });
    setTimeout(() => setAdded(false), 1400);
  }

  if (needsFitment) {
    return (
      <button
        type="button"
        disabled
        className={`flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-pill border border-white/15 bg-white/[0.04] font-semibold text-white/45 ${
          compact ? "px-4 py-2 text-sm" : "px-4 py-3"
        }`}
      >
        Choose iPhone model
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className={`flex w-full items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200 ease-out-expo active:scale-[0.97] ${
        added
          ? "bg-accent text-ink-950"
          : "bg-brand text-ink-950 hover:bg-brand-soft hover:shadow-brand-glow"
      } ${compact ? "px-4 py-2 text-sm" : "px-4 py-3"}`}
    >
      {added ? (
        <>
          <Icon name="check" className="h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <Icon name="cart" className={compact ? "h-4 w-4" : "h-5 w-5"} />
          Add to Cart
        </>
      )}
    </button>
  );
}
