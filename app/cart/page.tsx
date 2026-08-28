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
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Bag
        </p>
        <h1 className="mt-1.5 display text-3xl sm:text-4xl">Your cart</h1>
        <div className="mt-10">
          <ShopEmptyState
            icon="cart"
            title="Your cart is empty"
            description="Add products and they&apos;ll show up here."
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
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
        Bag
      </p>
      <h1 className="mt-1.5 display heading-page">Your cart</h1>
      <p className="mt-2 text-sm text-white/50">
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
                className="flex gap-3 rounded-[1.25rem] border border-white/[0.07] bg-ink-900/50 p-3 shadow-card sm:gap-4 sm:p-4"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f4f4f2] sm:h-24 sm:w-24"
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
                    className="min-w-0 font-semibold text-white transition-colors hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Remove item"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-red-400"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="mt-1 text-sm text-white/50">
                    {formatPrice(item.price)}
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 rounded-pill border border-white/10 bg-ink-900 p-1">
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]"
                      >
                        <Icon name="minus" className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]"
                      >
                        <Icon name="plus" className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-bold text-white">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        <div className="h-fit lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
          <div className="rounded-[1.35rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/80 to-ink-900/70 p-6 shadow-card ring-1 ring-white/[0.03] backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white">Order summary</h2>
            <div className="mt-4 flex justify-between text-sm text-white/60">
              <span>Subtotal</span>
              <span className="font-medium text-white/90">
                {formatPrice(total)}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-white/60">
              <span>Delivery</span>
              <span className="text-white/50">Calculated at checkout</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-lg font-black text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-brand mt-6 w-full">
              Checkout
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/40">
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
              <p className="text-[11px] text-white/45">Total</p>
              <p className="text-lg font-extrabold tabular-nums text-white">
                {formatPrice(total)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950 transition-transform active:scale-[0.98]"
            >
              Checkout
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </ShopStickyBar>
      </div>
    </div>
  );
}
