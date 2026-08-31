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
import {
  FormSection,
  ServiceSteps
} from "@/components/services/ServiceSteps";
import {
  serviceField,
  serviceLabel,
  serviceOptionClass,
  ServiceSubmitButton
} from "@/components/services/service-ui";
import { siteConfig } from "@/config/site";

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
            const last4 = phone.replace(/\D/g, "").slice(-4);
            const s = await fetch(
              `/api/services/${data.ref}/status?phoneLast4=${encodeURIComponent(last4)}`,
              {
              cache: "no-store"
              }
            );
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
    <form onSubmit={submit} className="space-y-5">
      <ServiceSteps steps={STEPS} current={stepIndex} />

      <FormSection
        title="1 · What do you need cut?"
        hint="Pick the key type, then how many copies."
      >
        <div className="grid gap-2.5 sm:grid-cols-3">
          {KEY_TYPES.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKeyType(k.id)}
              className={serviceOptionClass(keyType === k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>
        <label className="block max-w-[10rem]">
          <span className={serviceLabel}>How many keys?</span>
          <input
            type="number"
            min={1}
            max={20}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className={serviceField}
          />
        </label>
      </FormSection>

      <FormSection
        title="2 · How will you get it done?"
        hint="In-store is fastest. Yango collects and returns if you cannot visit."
      >
        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => setFlow("IN_STORE")}
            className={serviceOptionClass(flow === "IN_STORE", true)}
          >
            <span className="block font-bold text-gp-text">
              I&apos;ll bring my key to the store
            </span>
            <span className="mt-1 block text-sm text-gp-text-muted">
              Come to {siteConfig.branch}. You only pay for the cut (
              {formatPrice(settings.keyCuttingPrice)} each).
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFlow("YANGO_ROUNDTRIP")}
            className={serviceOptionClass(flow === "YANGO_ROUNDTRIP", true)}
          >
            <span className="block font-bold text-gp-text">
              Send my key by Yango (round trip)
            </span>
            <span className="mt-1 block text-sm text-gp-text-muted">
              Collect → cut → return. Cut + 2 Yango trips (
              {formatPrice(settings.yangoLegFee)} each way).
            </span>
          </button>
        </div>
        {flow === "YANGO_ROUNDTRIP" && (
          <label className="block">
            <span className={serviceLabel}>
              Your address (Yango pickup & return)
            </span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={serviceField}
              placeholder="e.g. Kamwala, Lusaka — near the market"
              required
            />
          </label>
        )}
      </FormSection>

      <FormSection
        title="3 · Your details & payment"
        hint="We confirm on WhatsApp after you order."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={serviceLabel}>Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={serviceField}
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className={serviceLabel}>Phone (WhatsApp)</span>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={serviceField}
              placeholder="09xx xxx xxx"
            />
          </label>
        </div>
        <label className="block">
          <span className={serviceLabel}>Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={serviceField}
            placeholder="Any details we should know"
          />
        </label>
        <PaymentPicker method={pay} onChange={setPay} />
      </FormSection>

      <div className="service-estimate">
        <div className="flex justify-between text-gp-text-muted">
          <span>
            Key cut ({formatPrice(settings.keyCuttingPrice)} × {qty})
          </span>
          <span className="font-medium text-gp-text">{formatPrice(cutFee)}</span>
        </div>
        {flow === "YANGO_ROUNDTRIP" && (
          <>
            <div className="flex justify-between text-gp-text-muted">
              <span>Yango to G-Products</span>
              <span className="font-medium text-gp-text">{formatPrice(yangoToStore)}</span>
            </div>
            <div className="flex justify-between text-gp-text-muted">
              <span>Yango return to you</span>
              <span className="font-medium text-gp-text">{formatPrice(yangoReturn)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between border-t border-gp-border pt-2 text-lg font-black text-gp-text">
          <span>Total</span>
          <span className="text-ink-700">{formatPrice(estimate)}</span>
        </div>
        {flow === "YANGO_ROUNDTRIP" && (
          <p className="text-xs text-gp-text-subtle">
            Yango fees are estimates for Lusaka; we confirm on WhatsApp if your
            area differs.
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <ServiceSubmitButton
        busy={phase === "submitting"}
        label={`Order key cutting · ${formatPrice(estimate)}`}
        busyLabel="Placing order..."
      />
    </form>
  );
}
