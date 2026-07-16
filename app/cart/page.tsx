"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, setQty, remove } = useCart();

  return (
    <div className="container-g py-10">
      <h1 className="text-3xl font-black text-white">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-card border border-ink-800 bg-ink-850 p-10 text-center">
          <p className="text-white/60">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-card border border-ink-800 bg-ink-850 p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-800">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-semibold text-white hover:text-brand"
                  >
                    {item.name}
                  </Link>
                  <span className="mt-1 text-sm text-white/50">
                    {formatPrice(item.price)}
                  </span>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-ink-800 text-white/80 hover:text-white"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-ink-800 text-white/80 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-sm text-white/40 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="hidden font-bold text-white sm:block">
                  {formatPrice(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm text-white/60">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-white/60">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="mt-4 border-t border-ink-800 pt-4 flex justify-between text-lg font-black text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-pill bg-brand px-6 py-3 text-center text-sm font-bold text-ink-950 hover:bg-brand-soft"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
