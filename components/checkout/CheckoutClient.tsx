"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { orderWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";
import { ShopEmptyState, ShopStickyBar } from "@/components/shop/ui";
import { FieldGroup, FieldInput } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { applyPromoCode, listPublicPromoHints } from "@/lib/promo-codes";

type PayMethod = "mtn" | "airtel" | "zamtel";
type Phase = "idle" | "submitting" | "manual" | "pending" | "success" | "failed";

const payOptions: { id: PayMethod; label: string; number: string }[] = [
  {
    id: "mtn",
    label: siteConfig.mobileMoney.mtn.label,
    number: siteConfig.mobileMoney.mtn.number
  },
  {
    id: "airtel",
    label: siteConfig.mobileMoney.airtel.label,
    number: siteConfig.mobileMoney.airtel.number
  },
  {
    id: "zamtel",
    label: siteConfig.mobileMoney.zamtel.label,
    number: siteConfig.mobileMoney.zamtel.number
  }
];

type Snapshot = {
  items: { name: string; qty: number; price: number }[];
  total: number;
  subtotal: number;
  discount: number;
  promoCode?: string;
};

export type CheckoutPrefill = {
  name: string;
  phone: string;
  address: string;
};

export function CheckoutClient({
  prefill
}: {
  prefill?: CheckoutPrefill | null;
}) {
  const { items, total, clear } = useCart();
  const [method, setMethod] = useState<PayMethod>("mtn");
  const [phase, setPhase] = useState<Phase>("idle");
  const [orderRef, setOrderRef] = useState("");
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefilled = useRef(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    label: string;
    discountZmw: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  const discount = promoApplied?.discountZmw ?? 0;
  const payTotal = Math.max(0, total - discount);

  useEffect(() => {
    if (prefilled.current || !prefill) return;
    prefilled.current = true;
    setForm({
      name: prefill.name,
      phone: prefill.phone,
      address: prefill.address
    });
  }, [prefill]);

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
      total: payTotal,
      subtotal: total,
      discount,
      promoCode: promoApplied?.code
    };
    setSnapshot(snap);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId ?? i.id,
            name: i.name,
            price: i.price,
            qty: i.qty
          })),
          customer: {
            name: form.name,
            phone: form.phone,
            address: form.address
          },
          method,
          promoCode: promoApplied?.code
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
      ? orderWhatsAppLink(snapshot.items, snapshot.total, orderRef)
      : `https://wa.me/${siteConfig.whatsappNumber}`;
    const payOpt = payOptions.find((p) => p.id === method);
    const providerLabel = payOpt?.label;
    const momo = siteConfig.mobileMoney[method];

    return (
      <div className="container-g py-12 sm:py-16">
        <div className="relative mx-auto max-w-lg overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/90 to-ink-900/95 p-6 text-left shadow-[0_30px_80px_-36px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.04] sm:p-8">
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
          <div className="text-center">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
                phase === "success"
                  ? "bg-accent/15 text-accent shadow-accent-glow"
                  : "bg-brand/15 text-brand shadow-brand-glow"
              }`}
            >
              {phase === "success" ? (
                <Icon name="check" className="h-8 w-8" />
              ) : phase === "pending" ? (
                <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand border-t-transparent" />
              ) : (
                <Icon name="wallet" className="h-8 w-8" />
              )}
            </div>

            <h1 className="mt-6 text-2xl font-black text-white">
              {phase === "success"
                ? "Payment confirmed!"
                : phase === "pending"
                  ? "Approve the payment"
                  : "Order received — pay now"}
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Order{" "}
              <span className="font-mono text-white/70">{orderRef}</span>
            </p>
          </div>

          <p className="mt-4 text-center text-white/60">
            {phase === "success" &&
              `Thank you, ${form.name || "friend"}. Your ${providerLabel} payment was received. We'll prepare your order right away.`}
            {phase === "pending" &&
              `Check your phone and enter your ${providerLabel} PIN to approve the payment. This page updates automatically.`}
            {phase === "manual" &&
              `Thank you, ${form.name || "friend"}. Send ${providerLabel} to the number below, then confirm on WhatsApp so we can prepare your order.`}
          </p>

          {snapshot && (
            <div className="mt-5 rounded-xl border border-white/10 bg-ink-900/80 p-4 text-sm">
              <p className="font-semibold text-white">Order summary</p>
              <ul className="mt-2 space-y-1.5 text-white/65">
                {snapshot.items.map((i) => (
                  <li key={i.name} className="flex justify-between gap-3">
                    <span>
                      {i.name} ×{i.qty}
                    </span>
                    <span className="shrink-0 text-white/80">
                      {formatPrice(i.price * i.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-white/10 pt-3 font-bold text-white">
                <span>Total to pay</span>
                <span className="text-brand">{formatPrice(snapshot.total)}</span>
              </p>
              {snapshot.discount > 0 ? (
                <p className="mt-1 text-xs text-accent">
                  Promo saved {formatPrice(snapshot.discount)}
                  {snapshot.promoCode ? ` (${snapshot.promoCode})` : ""}
                </p>
              ) : null}
            </div>
          )}

          {(phase === "success" || phase === "manual") && (
            <Link
              href={`/orders/track?ref=${encodeURIComponent(orderRef)}`}
              className="mt-4 block text-center text-sm font-semibold text-brand hover:underline"
            >
              Track this order
            </Link>
          )}

          {phase === "manual" && momo && (
            <div className="mt-4 rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm">
              <p className="font-semibold text-brand">Pay with {momo.label}</p>
              <p className="mt-2 text-white/80">
                Send{" "}
                <strong className="text-white">
                  {snapshot ? formatPrice(snapshot.total) : "the total"}
                </strong>{" "}
                to:
              </p>
              <p className="mt-2 font-mono text-lg font-bold tracking-wide text-white">
                {momo.number}
              </p>
              <p className="mt-1 text-white/50">
                Account name: {momo.accountName}
              </p>
              <p className="mt-3 text-xs text-white/45">
                Use order {orderRef} as the payment reference / note if your
                phone asks for one.
              </p>
            </div>
          )}

          {(phase === "success" || phase === "manual") && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
              <p className="font-semibold text-white">What happens next</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>We confirm your payment</li>
                <li>Order is prepared at our shop</li>
                <li>
                  Pickup at {siteConfig.locations[0]?.name} or{" "}
                  {siteConfig.locations[1]?.name} — or Yango delivery. We update
                  you on WhatsApp
                </li>
              </ol>
            </div>
          )}

          {(phase === "manual" || phase === "pending") && (
            <a
              href={waFallback}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-6 w-full"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Confirm on WhatsApp
            </a>
          )}

          <Link href="/" className="btn-brand mt-4 w-full">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="container-g py-16 sm:py-20">
        <div className="mx-auto max-w-md rounded-[1.35rem] border border-white/[0.07] bg-ink-900/55 p-8 text-center shadow-card sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/15 text-red-400">
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-black text-white">
            Payment not completed
          </h1>
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
            className="btn-whatsapp mt-6 w-full"
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            Chat with us
          </a>
          <Link href="/" className="btn-brand mt-4 w-full">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-g py-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Secure checkout
        </p>
        <h1 className="mt-1.5 display text-3xl sm:text-4xl">Checkout</h1>
        <div className="mt-10">
          <ShopEmptyState
            icon="cart"
            title="Your cart is empty"
            description="Add a few items, then come back to pay with Mobile Money."
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
        Secure checkout
      </p>
      <h1 className="mt-1.5 display heading-page">Checkout</h1>
      <p className="mt-2 text-sm text-white/50">
        Delivery details, then pay with Mobile Money.
      </p>

      {prefill?.address ? (
        <p className="mt-3 rounded-xl border border-accent/25 bg-accent/10 px-4 py-2.5 text-sm text-accent">
          Using your saved delivery location — edit below if needed.
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                1
              </span>
              <h2 className="text-lg font-bold text-white">Delivery details</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FieldGroup label="Full name" htmlFor="checkout-name">
                <FieldInput
                  id="checkout-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </FieldGroup>
              <FieldGroup label="Phone number" htmlFor="checkout-phone">
                <FieldInput
                  id="checkout-phone"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  inputMode="tel"
                  placeholder="09xx xxx xxx"
                />
              </FieldGroup>
              <div className="sm:col-span-2">
                <FieldGroup
                  label="Delivery address / room"
                  htmlFor="checkout-address"
                >
                  <FieldInput
                    id="checkout-address"
                    name="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="e.g. Kalingalinga Block A Room 12"
                  />
                </FieldGroup>
              </div>
            </div>
            {!prefill?.address ? (
              <p className="mt-4 text-xs text-white/40">
                <Link href="/profile/account" className="text-brand hover:underline">
                  Save a location in your profile
                </Link>{" "}
                to skip typing next time.
              </p>
            ) : null}
          </Panel>

          <Panel className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                2
              </span>
              <h2 className="text-lg font-bold text-white">Payment method</h2>
            </div>
            <p className="mt-1.5 pl-11 text-sm text-white/50">
              Pay securely with Mobile Money.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {payOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMethod(opt.id)}
                  className={`relative rounded-xl border p-4 text-left transition-all ${
                    method === opt.id
                      ? "border-brand bg-brand/10 shadow-brand-glow"
                      : "border-white/10 bg-ink-900 hover:border-white/20"
                  }`}
                >
                  {method === opt.id && (
                    <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-brand text-ink-950">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                  )}
                  <span className="block font-bold text-white">
                    {opt.label}
                  </span>
                  <span className="text-sm text-white/50">{opt.number}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-ink-900 p-3 text-xs text-white/40">
              <Icon
                name="shield"
                className="mt-0.5 h-4 w-4 shrink-0 text-brand/70"
              />
              Pay to {siteConfig.mobileMoney.mtn.accountName}. When live Mobile
              Money is configured you&apos;ll get a prompt on your phone;
              otherwise your order is confirmed on WhatsApp.
            </p>
          </Panel>
        </div>

        <div className="h-fit lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
          <Panel className="p-4 sm:p-6">
            <h2 className="text-lg font-bold text-white">Order summary</h2>
            <div className="mt-4 space-y-2.5">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex justify-between gap-2 text-sm text-white/60"
                >
                  <span className="pr-2">
                    {i.name}{" "}
                    <span className="text-white/40">x{i.qty}</span>
                  </span>
                  <span className="shrink-0 text-white/80">
                    {formatPrice(i.price * i.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Promo code
              </p>
              <div className="mt-2 flex gap-2">
                <FieldInput
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    setPromoError("");
                  }}
                  placeholder="WELCOME50"
                  className="mt-0 min-w-0 flex-1 uppercase"
                />
                <button
                  type="button"
                  className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-white/80 hover:border-brand/40 hover:text-brand"
                  onClick={() => {
                    const result = applyPromoCode(promoInput, total);
                    if (!result.ok) {
                      setPromoApplied(null);
                      setPromoError(result.error);
                      return;
                    }
                    setPromoApplied({
                      code: result.code,
                      label: result.label,
                      discountZmw: result.discountZmw
                    });
                    setPromoError("");
                  }}
                >
                  Apply
                </button>
              </div>
              {promoError ? (
                <p className="mt-1.5 text-xs text-red-300">{promoError}</p>
              ) : null}
              {promoApplied ? (
                <p className="mt-1.5 text-xs text-accent">
                  {promoApplied.code}: −{formatPrice(promoApplied.discountZmw)}{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      setPromoApplied(null);
                      setPromoInput("");
                    }}
                  >
                    Remove
                  </button>
                </p>
              ) : (
                <p className="mt-1.5 text-[10px] text-white/30">
                  {listPublicPromoHints().join(" · ")}
                </p>
              )}
            </div>

            {discount > 0 ? (
              <div className="mt-3 flex justify-between text-sm text-white/50">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
            ) : null}
            {discount > 0 ? (
              <div className="mt-1 flex justify-between text-sm text-accent">
                <span>Discount</span>
                <span className="tabular-nums">−{formatPrice(discount)}</span>
              </div>
            ) : null}
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-lg font-black text-white">
              <span>Total</span>
              <span>{formatPrice(payTotal)}</span>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={placeOrder}
              disabled={!canPlace || phase === "submitting"}
              className="btn-brand mt-6 w-full disabled:shadow-none"
            >
              {phase === "submitting" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/40 border-t-ink-950" />
                  Placing order...
                </>
              ) : (
                "Place order"
              )}
            </button>

            <a
              href={orderWhatsAppLink(
                items.map((i) => ({
                  name: i.name,
                  qty: i.qty,
                  price: i.price
                })),
                total
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-3 w-full"
            >
              <Icon name="whatsapp" className="h-5 w-5" />
              Order on WhatsApp instead
            </a>
          </Panel>
        </div>
      </div>

      <div className="lg:hidden">
        <ShopStickyBar>
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-white/45">Total</p>
              <p className="text-lg font-extrabold tabular-nums text-white">
              {formatPrice(payTotal)}
              </p>
            </div>
            <button
              type="button"
              onClick={placeOrder}
              disabled={!canPlace || phase === "submitting"}
              className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-brand px-4 py-3 text-sm font-bold text-ink-950 transition-all active:scale-[0.98] disabled:bg-ink-700 disabled:text-white/40"
            >
              {phase === "submitting" ? "Placing..." : "Place order"}
            </button>
          </div>
        </ShopStickyBar>
      </div>
    </div>
  );
}
