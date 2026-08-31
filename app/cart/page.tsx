"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Icon } from "@/components/Icons";
import { ShopEmptyState, ShopStickyBar } from "@/components/shop/ui";

export default function CartPage() {
  const { items, total, count, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-g py-10">
        <p className="eyebrow">Bag</p>
        <h1 className="mt-1.5 display heading-page">Your cart</h1>
        <div className="mt-10">
          <ShopEmptyState
            icon="cart"
            title="Your cart is empty"
            description="Add products and they'll show up here."
            action={
              <Link href="/search" className="btn-brand">
                Start shopping
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container-g py-8 pb-32 sm:py-10 lg:pb-10">
      <p className="eyebrow">Bag</p>
      <h1 className="mt-1.5 display heading-page">Your cart</h1>
      <p className="mt-2 text-sm text-gp-text-muted">
        {count} item{count === 1 ? "" : "s"} ready to checkout
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 rounded-2xl border border-gp-border/80 bg-gp-surface p-4 shadow-card sm:gap-5 sm:p-5"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gp-muted sm:h-24 sm:w-24"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-contain p-1.5"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/product/${item.slug}`}
                      className="min-w-0 font-semibold text-gp-text transition-colors hover:text-ink-700"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Remove item"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gp-text-subtle transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="mt-1 text-sm text-gp-text-muted">
                    {formatPrice(item.price)}
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 rounded-pill border border-gp-border bg-gp-bg p-1">
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-gp-text transition-colors hover:bg-gp-surface"
                      >
                        <Icon name="minus" className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums text-gp-text">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-gp-text transition-colors hover:bg-gp-surface"
                      >
                        <Icon name="plus" className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-bold text-gp-text">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-gp-text-muted transition-colors hover:text-gp-text"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        <div className="h-fit lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
          <div className="gp-card lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
            <h2 className="text-lg font-bold text-gp-text">Order summary</h2>
            <div className="mt-4 flex justify-between text-sm text-gp-text-muted">
              <span>Subtotal</span>
              <span className="font-medium text-gp-text">
                {formatPrice(total)}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gp-text-muted">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-gp-border pt-4 text-lg font-black text-gp-text">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-brand mt-6 w-full">
              Proceed to checkout
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gp-text-subtle">
              <Icon name="shield" className="h-3.5 w-3.5" />
              Secure Mobile Money checkout
            </p>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <ShopStickyBar>
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-gp-text-muted">Total</p>
              <p className="text-lg font-extrabold tabular-nums text-gp-text">
                {formatPrice(total)}
              </p>
            </div>
            <Link href="/checkout" className="btn-brand flex flex-1 justify-center">
              Checkout now
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </ShopStickyBar>
      </div>
    </div>
  );
}
