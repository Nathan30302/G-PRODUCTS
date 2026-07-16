"use client";

import { useEffect, useRef, useState } from "react";
import {
  KEY_CUTTING_PRICE,
  KEY_TYPES
} from "@/lib/services";
import { formatPrice } from "@/lib/format";
import {
  DeliveryPicker,
  type DeliveryMethod
} from "@/components/services/DeliveryPicker";
import {
  PaymentPicker,
  type PayMethod
} from "@/components/services/PaymentPicker";
import { ServiceResult } from "@/components/services/ServiceResult";

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";

type Phase = "form" | "submitting" | "done" | "pending";

export function KeyCuttingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [keyType, setKeyType] = useState("household");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("PICKUP");
  const [address, setAddress] = useState("");
  const [pay, setPay] = useState<PayMethod>("mtn");
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState("");
  const [refCode, setRefCode] = useState("");
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const estimate = KEY_CUTTING_PRICE * qty;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPhase("submitting");
    const form = new FormData();
    form.set("serviceType", "KEY_CUTTING");
    form.set("customerName", name);
    form.set("customerPhone", phone);
    form.set("deliveryMethod", delivery);
    form.set("address", address);
    form.set("paymentMethod", pay);
    form.set(
      "details",
      JSON.stringify({ keyType, qty, notes })
    );

    try {
      const res = await fetch("/api/services/request", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setPhase("form");
        return;
      }
      setRefCode(data.ref);
      setTotal(data.total ?? estimate);
      setMessage(
        data.mode === "manual"
          ? "Order received. Pay with Mobile Money and confirm on WhatsApp — we'll cut your key and arrange pickup or Yango delivery."
          : "Approve the payment on your phone. We'll prepare your key once payment confirms."
      );
      if (data.mode === "live" && data.paymentStatus === "PENDING") {
        setPhase("pending");
        let tries = 0;
        pollRef.current = setInterval(async () => {
          tries += 1;
          try {
            const s = await fetch(`/api/orders/${data.ref}/status`, {
              cache: "no-store"
            });
            const j = await s.json();
            if (j.paymentStatus === "SUCCESS" || j.paymentStatus === "FAILED") {
              if (pollRef.current) clearInterval(pollRef.current);
              setPhase("done");
              if (j.paymentStatus === "SUCCESS") {
                setMessage(
                  "Payment confirmed! We'll cut your key and notify you for pickup or Yango delivery."
                );
              }
            }
          } catch {
            /* keep polling */
          }
          if (tries >= 24 && pollRef.current) clearInterval(pollRef.current);
        }, 4000);
      } else {
        setPhase("done");
      }
    } catch {
      setError("Network error. Please try again.");
      setPhase("form");
    }
  }

  if (phase === "done" || phase === "pending") {
    return (
      <ServiceResult
        title={phase === "pending" ? "Approve payment" : "Key cutting ordered"}
        refCode={refCode}
        message={message}
        total={total}
        pending={phase === "pending"}
        waLines={[
          `*Key Cutting* — ${refCode}`,
          `Type: ${keyType}`,
          `Qty: ${qty}`,
          `Total: ${formatPrice(total)}`,
          `Delivery: ${delivery === "YANGO" ? `Yango — ${address}` : "Pickup at Kalingalinga"}`
        ]}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-white/60">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/60">Phone (WhatsApp)</span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={field}
            placeholder="09xx xxx xxx"
          />
        </label>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">What do you need cut?</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {KEY_TYPES.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKeyType(k.id)}
              className={`rounded-xl border p-3 text-left text-sm font-semibold ${
                keyType === k.id
                  ? "border-brand bg-brand/10 text-white"
                  : "border-ink-700 bg-ink-900 text-white/70"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block max-w-[10rem]">
        <span className="text-sm text-white/60">How many keys?</span>
        <input
          type="number"
          min={1}
          max={20}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className={field}
        />
      </label>

      <label className="block">
        <span className="text-sm text-white/60">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={field}
          placeholder="Any details we should know"
        />
      </label>

      <DeliveryPicker
        method={delivery}
        address={address}
        onMethod={setDelivery}
        onAddress={setAddress}
      />

      <PaymentPicker method={pay} onChange={setPay} />

      <div className="flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900 px-4 py-3">
        <span className="text-sm text-white/60">
          {formatPrice(KEY_CUTTING_PRICE)} × {qty}
        </span>
        <span className="text-lg font-black text-white">
          {formatPrice(estimate)}
        </span>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={phase === "submitting"}
        className="w-full rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:opacity-60"
      >
        {phase === "submitting" ? "Placing order..." : "Order key cutting"}
      </button>
    </form>
  );
}
