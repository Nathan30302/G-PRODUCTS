"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { orderWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";

type PayMethod = "mtn" | "airtel" | "zamtel";
type Phase = "idle" | "submitting" | "manual" | "pending" | "success" | "failed";

const payOptions: { id: PayMethod; label: string; number: string }[] = [
  { id: "mtn", label: siteConfig.mobileMoney.mtn.label, number: siteConfig.mobileMoney.mtn.number },
  { id: "airtel", label: siteConfig.mobileMoney.airtel.label, number: siteConfig.mobileMoney.airtel.number },
  { id: "zamtel", label: siteConfig.mobileMoney.zamtel.label, number: siteConfig.mobileMoney.zamtel.number }
];

type Snapshot = {
  items: { name: string; qty: number; price: number }[];
  total: number;
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [method, setMethod] = useState<PayMethod>("mtn");
  const [phase, setPhase] = useState<Phase>("idle");
  const [orderRef, setOrderRef] = useState("");
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const canPlace =
    items.length > 0 && Boolean(form.name.trim()) && Boolean(form.phone.trim());

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function startPolling(ref: string) {
    let tries = 0;
    pollRef.current = setInterval(async () => {
      tries += 1;
      try {
        const res = await fetch(`/api/orders/${ref}/status`, {
          cache: "no-store"
        });
        const data = await res.json();
        if (data.paymentStatus === "SUCCESS") {
          if (pollRef.current) clearInterval(pollRef.current);
          setPhase("success");
        } else if (data.paymentStatus === "FAILED") {
          if (pollRef.current) clearInterval(pollRef.current);
          setPhase("failed");
        }
      } catch {
        // keep trying
      }
      if (tries >= 24 && pollRef.current) {
        clearInterval(pollRef.current);
      }
    }, 4000);
  }

  async function placeOrder() {
    if (!canPlace || phase === "submitting") return;
    setError("");
    setPhase("submitting");
    const snap: Snapshot = {
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total
    };
    setSnapshot(snap);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty
          })),
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.address
          },
          method
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setPhase("idle");
        return;
      }

      setOrderRef(data.ref);
      clear();

      if (data.mode === "manual") {
        setPhase("manual");
      } else if (data.paymentStatus === "SUCCESS") {
        setPhase("success");
      } else if (data.paymentStatus === "FAILED") {
        setPhase("failed");
      } else {
        setPhase("pending");
        startPolling(data.ref);
      }
    } catch {
      setError("Network error. Please try again.");
      setPhase("idle");
    }
  }

  if (phase === "manual" || phase === "success" || phase === "pending") {
    const waFallback = snapshot
      ? orderWhatsAppLink(snapshot.items, snapshot.total)
      : `https://wa.me/${siteConfig.whatsappNumber}`;
    const providerLabel = payOptions.find((p) => p.id === method)?.label;

    return (
      <div className="container-g py-20 text-center">
        <div className="mx-auto max-w-md rounded-card border border-ink-800 bg-ink-850 p-10">
          <div
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
              phase === "success"
                ? "bg-accent/15 text-accent"
                : "bg-brand/15 text-brand"
            }`}
          >
            <Icon
              name={phase === "success" ? "cart" : "whatsapp"}
              className="h-8 w-8"
            />
          </div>

          <h1 className="mt-6 text-2xl font-black text-white">
            {phase === "success"
              ? "Payment confirmed!"
              : phase === "pending"
                ? "Approve the payment"
                : "Order received!"}
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Order <span className="font-mono text-white/70">{orderRef}</span>
          </p>

          <p className="mt-3 text-white/60">
            {phase === "success" &&
              `Thank you, ${form.name || "friend"}. Your ${providerLabel} payment was received. We'll prepare your order right away.`}
            {phase === "pending" &&
              `Check your phone and enter your ${providerLabel} PIN to approve the payment. This page updates automatically.`}
            {phase === "manual" &&
              `Thank you, ${form.name || "friend"}. Send your ${providerLabel} payment and confirm on WhatsApp so we can prepare your order.`}
          </p>

          {phase === "pending" && (
            <div className="mt-6 flex justify-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          )}

          {(phase === "manual" || phase === "pending") && (
            <a
              href={waFallback}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/20"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Confirm on WhatsApp
            </a>
          )}

          <Link
            href="/"
            className="mt-4 inline-block rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="container-g py-20 text-center">
        <div className="mx-auto max-w-md rounded-card border border-ink-800 bg-ink-850 p-10">
          <h1 className="text-2xl font-black text-white">Payment not completed</h1>
          <p className="mt-2 text-sm text-white/40">
            Order <span className="font-mono text-white/70">{orderRef}</span>
          </p>
          <p className="mt-3 text-white/60">
            The payment was declined or cancelled. You can try again or reach us
            on WhatsApp and we&apos;ll help you complete your order.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/20"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            Chat with us
          </a>
          <Link
            href="/"
            className="mt-4 inline-block rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft"
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
                Pay to {siteConfig.mobileMoney.mtn.accountName} (Kalingalinga
                branch). When live Mobile Money is configured you&apos;ll get a
                prompt on your phone; otherwise your order is confirmed on
                WhatsApp.
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

            {error && (
              <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={placeOrder}
              disabled={!canPlace || phase === "submitting"}
              className="mt-6 w-full rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-white/40"
            >
              {phase === "submitting" ? "Placing order..." : "Place Order"}
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
