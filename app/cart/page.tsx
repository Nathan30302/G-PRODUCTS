"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Icon } from "@/components/Icons";

export default function CartPage() {
  const { items, total, count, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-g py-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Bag
        </p>
        <h1 className="mt-1.5 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Your cart
        </h1>
        <div className="mt-10 flex flex-col items-center rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-12 text-center shadow-card">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
            <Icon name="cart" className="h-7 w-7" />
          </span>
          <p className="mt-5 text-lg font-semibold text-white">
            Your cart is empty
          </p>
          <p className="mt-1 text-sm text-white/50">
            Add products and they&apos;ll show up here.
          </p>
          <Link href="/search" className="btn-brand mt-6">
            Start shopping
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-g py-8 pb-28 sm:py-10 md:pb-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
        Bag
      </p>
      <h1 className="mt-1.5 text-3xl font-black tracking-tight text-white sm:text-4xl">
        Your cart
      </h1>
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
                className="flex gap-4 rounded-[1.25rem] border border-white/[0.07] bg-ink-900/50 p-4 shadow-card"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-900"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-semibold text-white transition-colors hover:text-brand"
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
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08]"
                      >
                        <Icon name="minus" className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">
                        {item.qty}
                      </span>
                      <button
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

        <div className="h-fit lg:sticky lg:top-24">
          <div className="rounded-[1.35rem] border border-white/[0.07] bg-ink-900/55 p-6 shadow-card backdrop-blur-sm">
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

      {/* mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] z-40 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-white/45">Total</p>
            <p className="text-lg font-extrabold text-white">
              {formatPrice(total)}
            </p>
          </div>
          <Link
            href="/checkout"
            className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950 active:scale-[0.98]"
          >
            Checkout
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
