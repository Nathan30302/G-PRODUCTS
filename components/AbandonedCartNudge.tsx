"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

const KEY = "gproducts_cart_nudge_v1";

/** Gentle reminder if the cart still has items after a short idle period. */
export function AbandonedCartNudge() {
  const { items, total } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setShow(false);
      return;
    }
    const dismissed = sessionStorage.getItem(KEY);
    if (dismissed === "1") return;
    const t = setTimeout(() => setShow(true), 45_000);
    return () => clearTimeout(t);
  }, [items.length]);

  if (!show || items.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-[60] mx-auto max-w-md rounded-2xl border border-brand/30 bg-ink-900/95 p-4 shadow-brand-glow backdrop-blur sm:left-auto sm:right-6 sm:bottom-6">
      <p className="text-sm font-bold text-white">Still thinking it over?</p>
      <p className="mt-1 text-xs text-white/55">
        You have {items.length} item{items.length === 1 ? "" : "s"} (
        {formatPrice(total)}) waiting in your cart.
      </p>
      <div className="mt-3 flex gap-2">
        <Link href="/cart" className="btn-primary flex-1 justify-center text-sm">
          View cart
        </Link>
        <button
          type="button"
          className="rounded-xl px-3 text-xs font-semibold text-white/45 hover:text-white"
          onClick={() => {
            sessionStorage.setItem(KEY, "1");
            setShow(false);
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
