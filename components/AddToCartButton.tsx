"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icons";
import { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  compact = false
}: {
  product: Product;
  compact?: boolean;
}) {
  const { add } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock === "sold_out";

  function handleAdd() {
    if (soldOut) return;
    add(product);
    setAdded(true);
    toast({
      title: "Added to cart",
      description: product.name,
      image: product.images[0]?.url,
      href: "/cart",
      hrefLabel: "View cart"
    });
    setTimeout(() => setAdded(false), 1400);
  }

  if (soldOut) {
    return (
      <button
        disabled
        className={`w-full cursor-not-allowed rounded-pill bg-ink-700 font-semibold text-white/40 ${
          compact ? "px-4 py-2 text-sm" : "px-4 py-3"
        }`}
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
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
