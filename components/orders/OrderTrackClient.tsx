"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  labelForOrderStatus,
  type OrderStatusKey
} from "@/lib/commerce-hooks";
import { formatPrice } from "@/lib/format";
import { Icon } from "@/components/Icons";

type TrackResult = {
  ref: string;
  paymentStatus: string;
  orderStatus: string;
  customerName?: string;
  total?: number;
  createdAt?: string;
  items?: { name: string; qty: number; price: number }[];
  timeline?: { key: string; label: string; done: boolean; current: boolean }[];
};

const FLOW: OrderStatusKey[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED"
];

export function OrderTrackClient({ initialRef = "" }: { initialRef?: string }) {
  const [ref, setRef] = useState(initialRef);
  const [phoneLast4, setPhoneLast4] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TrackResult | null>(null);

  async function runLookup(value: string, last4: string) {
    const clean = value.trim().toUpperCase();
    const digits = last4.replace(/\D/g, "").slice(-4);
    if (!clean) {
      setError("Enter your order reference.");
      return;
    }
    if (digits.length !== 4) {
      setError("Enter the last 4 digits of your checkout phone number.");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const qs = new URLSearchParams({ phoneLast4: digits });
      const res = await fetch(
        `/api/orders/${encodeURIComponent(clean)}/track?${qs.toString()}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Order not found.");
        return;
      }
      setData(json);
    } catch {
      setError("Could not look up that order. Try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialRef.trim() && phoneLast4.replace(/\D/g, "").length === 4) {
      void runLookup(initialRef, phoneLast4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRef, phoneLast4]);

  return (
    <div className="mx-auto max-w-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runLookup(ref, phoneLast4);
        }}
        className="space-y-3"
      >
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="e.g. GP-AB12CD"
          autoCapitalize="characters"
          className="w-full rounded-2xl border border-gp-border bg-gp-surface px-4 py-3.5 text-sm text-gp-text shadow-sm outline-none transition-all placeholder:text-gp-text-subtle focus:border-ink-700/35 focus:shadow-[0_0_0_4px_rgba(35,55,70,0.08)]"
        />
        <input
          value={phoneLast4}
          onChange={(e) =>
            setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          placeholder="Last 4 digits of checkout phone"
          className="w-full rounded-2xl border border-gp-border bg-gp-surface px-4 py-3.5 text-center font-mono text-sm tracking-[0.35em] text-gp-text shadow-sm outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-gp-text-subtle focus:border-ink-700/35 focus:shadow-[0_0_0_4px_rgba(35,55,70,0.08)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5"
        >
          {loading ? "Looking up…" : "Track order"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {data ? (
        <div className="panel mt-8 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gp-text-subtle">
                Order
              </p>
              <p className="font-display text-xl font-extrabold text-gp-text">
                {data.ref}
              </p>
              {data.customerName ? (
                <p className="mt-1 text-sm text-gp-text-muted">{data.customerName}</p>
              ) : null}
            </div>
            {typeof data.total === "number" ? (
              <p className="text-lg font-extrabold tabular-nums text-ink-850">
                {formatPrice(data.total)}
              </p>
            ) : null}
          </div>

          <ol className="mt-6 space-y-3">
            {(
              data.timeline ??
              FLOW.map((key) => {
                const idx = FLOW.indexOf(data.orderStatus as OrderStatusKey);
                const my = FLOW.indexOf(key);
                const cancelled = data.orderStatus === "CANCELLED";
                return {
                  key,
                  label: labelForOrderStatus(key).label,
                  done: !cancelled && my <= idx && idx >= 0,
                  current: !cancelled && key === data.orderStatus
                };
              })
            ).map((step) => (
              <li key={step.key} className="flex items-center gap-3 text-sm">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                    step.done || step.current
                      ? "bg-brand text-ink-950"
                      : "border border-gp-border text-gp-text-subtle"
                  }`}
                >
                  {step.done && !step.current ? (
                    <Icon name="check" className="h-3.5 w-3.5" />
                  ) : (
                    "·"
                  )}
                </span>
                <span
                  className={
                    step.current
                      ? "font-bold text-ink-850"
                      : step.done
                        ? "text-gp-text"
                        : "text-gp-text-subtle"
                  }
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>

          {data.orderStatus === "CANCELLED" ? (
            <p className="mt-4 text-sm text-gp-text-muted">This order was cancelled.</p>
          ) : null}

          {data.items && data.items.length > 0 ? (
            <ul className="mt-6 space-y-2 border-t border-gp-border/70 pt-4">
              {data.items.map((item, i) => (
                <li
                  key={`${item.name}-${i}`}
                  className="flex justify-between gap-3 text-sm text-gp-text"
                >
                  <span>
                    {item.qty}× {item.name}
                  </span>
                  <span className="tabular-nums text-gp-text-muted">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-6 text-center text-xs text-gp-text-subtle">
            Printing jobs? Use the track link from your print confirmation, or
            open{" "}
            <Link href="/services" className="font-semibold text-ink-700 hover:underline">
              Services
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
