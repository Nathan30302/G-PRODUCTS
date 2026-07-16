"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  compact = false
}: {
  product: Product;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock === "sold_out";

  function handleAdd() {
    if (soldOut) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  if (soldOut) {
    return (
      <button
        disabled
        className={`w-full cursor-not-allowed rounded-pill bg-ink-700 px-4 font-semibold text-white/40 ${
          compact ? "py-2 text-sm" : "py-3"
        }`}
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full rounded-pill font-semibold transition-colors ${
        added
          ? "bg-brand-dark text-white"
          : "bg-brand text-ink-950 hover:bg-brand-soft"
      } ${compact ? "px-4 py-2 text-sm" : "px-4 py-3"}`}
    >
      {added ? "Added \u2713" : "Add to Cart"}
    </button>
  );
}
