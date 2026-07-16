"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { orderWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";

type PayMethod = "mtn" | "airtel" | "zamtel";

const payOptions: { id: PayMethod; label: string; number: string }[] = [
  { id: "mtn", label: siteConfig.mobileMoney.mtn.label, number: siteConfig.mobileMoney.mtn.number },
  { id: "airtel", label: siteConfig.mobileMoney.airtel.label, number: siteConfig.mobileMoney.airtel.number },
  { id: "zamtel", label: siteConfig.mobileMoney.zamtel.label, number: siteConfig.mobileMoney.zamtel.number }
];

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [method, setMethod] = useState<PayMethod>("mtn");
  const [placed, setPlaced] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const canPlace =
    items.length > 0 && form.name.trim() && form.phone.trim();

  function placeOrder() {
    // Phase 1 placeholder: real MoMo API integration comes with the backend.
    // For now we record the intent and hand off to WhatsApp for confirmation.
    setPlaced(true);
    clear();
  }

  if (placed) {
    return (
      <div className="container-g py-20 text-center">
        <div className="mx-auto max-w-md rounded-card border border-ink-800 bg-ink-850 p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">
            <Icon name="whatsapp" className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-black text-white">Order received!</h1>
          <p className="mt-3 text-white/60">
            Thank you, {form.name || "friend"}. We will confirm your order and{" "}
            {payOptions.find((p) => p.id === method)?.label} payment shortly.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-g py-10">
      <h1 className="text-3xl font-black text-white">Checkout</h1>

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
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
              <h2 className="text-lg font-bold text-white">Delivery Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-white/60">Full name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-white/60">Phone number</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="09xx xxx xxx"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm text-white/60">
                    Delivery address / area
                  </span>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="e.g. Kabulonga, Lusaka"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
              <h2 className="text-lg font-bold text-white">Payment Method</h2>
              <p className="mt-1 text-sm text-white/50">
                Pay securely with Mobile Money.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {payOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setMethod(opt.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      method === opt.id
                        ? "border-brand bg-brand/10"
                        : "border-ink-700 bg-ink-900 hover:border-ink-600"
                    }`}
                  >
                    <span className="block font-bold text-white">{opt.label}</span>
                    <span className="text-sm text-white/50">{opt.number}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-ink-900 p-3 text-xs text-white/40">
                Pay to {siteConfig.mobileMoney.mtn.accountName} (Kalingalinga branch).
                Live in-app Mobile Money payment is activated in the backend
                phase. For now your order is recorded and confirmed via WhatsApp.
              </p>
            </section>
          </div>

          <div className="h-fit rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Order Summary</h2>
            <div className="mt-4 space-y-2">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex justify-between text-sm text-white/60"
                >
                  <span className="pr-2">
                    {i.name} x{i.qty}
                  </span>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-ink-800 pt-4 flex justify-between text-lg font-black text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              onClick={placeOrder}
              disabled={!canPlace}
              className="mt-6 w-full rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-white/40"
            >
              Place Order
            </button>

            <a
              href={orderWhatsAppLink(
                items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
                total
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/20"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Order on WhatsApp instead
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
