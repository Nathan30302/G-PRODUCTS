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
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
          Your Cart
        </h1>
        <div className="mt-8 flex flex-col items-center rounded-[1.5rem] border border-ink-950/8 bg-white p-12 text-center shadow-[0_4px_24px_rgba(6,24,28,0.06)]">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-[#b89000]">
            <Icon name="cart" className="h-7 w-7" />
          </span>
          <p className="mt-5 text-lg font-semibold text-ink-950">
            Your cart is empty
          </p>
          <p className="mt-1 text-sm text-ink-950/45">
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
    <div className="container-g py-6 pb-36 sm:py-10 md:pb-10">
      <h1 className="text-center text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
        Your Cart
      </h1>

      {/* Promo banner — Plug style */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#fff6c2] px-4 py-3.5 sm:px-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/70 text-[#b89000]">
          <Icon name="truck" className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium leading-snug text-ink-950/80">
          Enjoy free shipping on every order within school. No minimums.
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
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
                className="flex gap-4 rounded-[1.25rem] border border-ink-950/8 bg-white p-4 shadow-[0_4px_20px_rgba(6,24,28,0.04)]"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f0f2f3]"
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
                      className="font-semibold leading-snug text-ink-950 transition-colors hover:text-[#b89000]"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Remove item"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-950/30 transition-colors hover:bg-ink-950/5 hover:text-red-500"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="grid h-8 w-8 place-items-center rounded-full border border-ink-950/12 text-ink-950/70 transition-colors hover:bg-ink-950/5"
                      >
                        <Icon name="minus" className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-ink-950">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                        className="grid h-8 w-8 place-items-center rounded-full border border-ink-950/12 text-ink-950/70 transition-colors hover:bg-ink-950/5"
                      >
                        <Icon name="plus" className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-base font-extrabold text-ink-950">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-950/45 transition-colors hover:text-ink-950"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        <div className="h-fit lg:sticky lg:top-24">
          <div className="rounded-[1.35rem] border border-ink-950/8 bg-white p-6 shadow-[0_4px_24px_rgba(6,24,28,0.06)]">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-ink-950/50">
                Subtotal · {count} item{count === 1 ? "" : "s"}
              </span>
              <span className="text-xl font-extrabold text-ink-950">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-950/40">
              Shipping/taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-ink-950 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-ink-900 active:scale-[0.98]"
            >
              Checkout
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-950/40">
              <Icon name="shield" className="h-3.5 w-3.5" />
              Secure Mobile Money checkout
            </p>
          </div>
        </div>
      </div>

      {/* mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] z-40 px-4 lg:hidden">
        <div className="rounded-2xl border border-ink-950/8 bg-white/95 p-3 shadow-[0_12px_40px_rgba(6,24,28,0.15)] backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-ink-950/40">Subtotal</p>
              <p className="text-lg font-extrabold text-ink-950">
                {formatPrice(total)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="flex flex-1 items-center justify-center rounded-pill bg-ink-950 px-4 py-3 text-sm font-bold text-white active:scale-[0.98]"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
