"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  KEY_TYPES,
  type ServiceSettings,
  type KeyFlow
} from "@/lib/services";
import { formatPrice } from "@/lib/format";
import {
  PaymentPicker,
  type PayMethod
} from "@/components/services/PaymentPicker";
import { ServiceResult } from "@/components/services/ServiceResult";
import { ServiceSteps } from "@/components/services/ServiceSteps";
import { siteConfig } from "@/config/site";

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";

type Phase = "form" | "submitting" | "done" | "pending";

const STEPS = ["Key", "How", "Pay"];

export function KeyCuttingForm({
  settings
}: {
  settings: ServiceSettings;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [keyType, setKeyType] = useState("household");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [flow, setFlow] = useState<KeyFlow>("IN_STORE");
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

  const cutFee = settings.keyCuttingPrice * qty;
  const yangoToStore = flow === "YANGO_ROUNDTRIP" ? settings.yangoLegFee : 0;
  const yangoReturn = flow === "YANGO_ROUNDTRIP" ? settings.yangoLegFee : 0;
  const estimate = useMemo(
    () => cutFee + yangoToStore + yangoReturn,
    [cutFee, yangoToStore, yangoReturn]
  );

  const stepIndex = useMemo(() => {
    if (!keyType) return 0;
    if (flow === "YANGO_ROUNDTRIP" && !address.trim()) return 1;
    if (!name || !phone) return 1;
    return 2;
  }, [keyType, flow, address, name, phone]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (flow === "YANGO_ROUNDTRIP" && !address.trim()) {
      setError("Enter your address so Yango can collect and return your key.");
      return;
    }
    setPhase("submitting");
    const form = new FormData();
    form.set("serviceType", "KEY_CUTTING");
    form.set("customerName", name);
    form.set("customerPhone", phone);
    form.set(
      "deliveryMethod",
      flow === "YANGO_ROUNDTRIP" ? "YANGO" : "PICKUP"
    );
    form.set("address", address);
    form.set("paymentMethod", pay);
    form.set(
      "details",
      JSON.stringify({ keyType, qty, notes, flow })
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
        flow === "IN_STORE"
          ? data.mode === "manual"
            ? `Order received. Bring your key to ${siteConfig.branch}, pay if you haven't already, and we'll cut it for you.`
            : "Approve payment on your phone, then bring your key to the store for cutting."
          : data.mode === "manual"
            ? "Order received. Pay for the key cut + both Yango trips, then we'll arrange Yango to collect your key, cut a copy, and send original + new key back."
            : "Approve payment on your phone (key cut + 2 Yango trips). We'll then arrange collection and return."
      );
      if (data.mode === "live" && data.paymentStatus === "PENDING") {
        setPhase("pending");
        let tries = 0;
        pollRef.current = setInterval(async () => {
          tries += 1;
          try {
            const s = await fetch(`/api/services/${data.ref}/status`, {
              cache: "no-store"
            });
            const j = await s.json();
            if (j.paymentStatus === "SUCCESS" || j.paymentStatus === "FAILED") {
              if (pollRef.current) clearInterval(pollRef.current);
              setPhase("done");
              if (j.paymentStatus === "SUCCESS") {
                setMessage(
                  flow === "IN_STORE"
                    ? "Payment confirmed! Bring your key to the store and we'll cut it."
                    : "Payment confirmed! We'll arrange Yango to collect your key, cut a copy, and return both keys to you."
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
        trackHref={`/services/track/${refCode}`}
        waLines={[
          `*Key Cutting* — ${refCode}`,
          `Type: ${keyType} × ${qty}`,
          flow === "IN_STORE"
            ? `Flow: In-store (I'll bring my key to ${siteConfig.branch})`
            : `Flow: Yango round-trip — collect from ${address}, cut, return`,
          `Key cut: ${formatPrice(cutFee)}`,
          ...(flow === "YANGO_ROUNDTRIP"
            ? [
                `Yango to store: ${formatPrice(yangoToStore)}`,
                `Yango return: ${formatPrice(yangoReturn)}`
              ]
            : []),
          `Total: ${formatPrice(total)}`
        ]}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <ServiceSteps steps={STEPS} current={stepIndex} />

      <div className="rounded-[1.15rem] border border-ink-800 bg-ink-900 p-4 text-sm text-white/60">
        <p className="font-semibold text-white">How key cutting works</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          <li>
            <span className="text-white/80">At the store:</span> bring the key
            you want copied to {siteConfig.branch} — we cut it while you wait
            (or after you order online).
          </li>
          <li>
            <span className="text-white/80">From home:</span> order online →
            Yango collects your key → we cut a copy → Yango returns original +
            new key. You pay{" "}
            <span className="text-brand">the cut + both Yango trips</span>.
          </li>
        </ol>
      </div>

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
              className={`rounded-xl border p-3 text-left text-sm font-semibold transition-colors ${
                keyType === k.id
                  ? "border-brand bg-brand/10 text-white"
                  : "border-ink-700 bg-ink-900 text-white/70 hover:border-ink-600"
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

      <div>
        <p className="text-sm font-semibold text-white">How will you get it done?</p>
        <div className="mt-3 grid gap-3">
          <button
            type="button"
            onClick={() => setFlow("IN_STORE")}
            className={`rounded-xl border p-4 text-left transition-colors ${
              flow === "IN_STORE"
                ? "border-brand bg-brand/10"
                : "border-ink-700 bg-ink-900 hover:border-ink-600"
            }`}
          >
            <span className="block font-bold text-white">
              I&apos;ll bring my key to the store
            </span>
            <span className="mt-1 block text-sm text-white/50">
              Come to {siteConfig.branch} with the key. You only pay for the
              key cut ({formatPrice(settings.keyCuttingPrice)} each).
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFlow("YANGO_ROUNDTRIP")}
            className={`rounded-xl border p-4 text-left transition-colors ${
              flow === "YANGO_ROUNDTRIP"
                ? "border-brand bg-brand/10"
                : "border-ink-700 bg-ink-900 hover:border-ink-600"
            }`}
          >
            <span className="block font-bold text-white">
              Send my key by Yango (round trip)
            </span>
            <span className="mt-1 block text-sm text-white/50">
              Yango collects your key → we cut a copy → Yango brings original +
              new key back. You pay key cut + 2 Yango trips (
              {formatPrice(settings.yangoLegFee)} each way).
            </span>
          </button>
        </div>
      </div>

      {flow === "YANGO_ROUNDTRIP" && (
        <label className="block">
          <span className="text-sm text-white/60">
            Your address (Yango pickup & return)
          </span>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={field}
            placeholder="e.g. Kamwala, Lusaka — near the market"
            required
          />
          <p className="mt-1 text-xs text-white/40">
            Gift drives for Yango — we arrange both trips for you.
          </p>
        </label>
      )}

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

      <PaymentPicker method={pay} onChange={setPay} />

      <div className="space-y-2 rounded-xl border border-ink-800 bg-ink-900 px-4 py-3 text-sm">
        <div className="flex justify-between text-white/60">
          <span>
            Key cut ({formatPrice(settings.keyCuttingPrice)} × {qty})
          </span>
          <span className="text-white">{formatPrice(cutFee)}</span>
        </div>
        {flow === "YANGO_ROUNDTRIP" && (
          <>
            <div className="flex justify-between text-white/60">
              <span>Yango to G-Products</span>
              <span className="text-white">{formatPrice(yangoToStore)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Yango return to you</span>
              <span className="text-white">{formatPrice(yangoReturn)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between border-t border-ink-800 pt-2 text-lg font-black text-white">
          <span>Total</span>
          <span>{formatPrice(estimate)}</span>
        </div>
        {flow === "YANGO_ROUNDTRIP" && (
          <p className="text-xs text-white/40">
            Yango fees are estimates for Lusaka; if the fare differs for your
            area we&apos;ll confirm on WhatsApp before confirming.
          </p>
        )}
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
