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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TrackResult | null>(null);

  async function runLookup(value: string) {
    const clean = value.trim().toUpperCase();
    if (!clean) {
      setError("Enter your order reference.");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(clean)}/track`);
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
    if (initialRef.trim()) {
      void runLookup(initialRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRef]);

  return (
    <div className="mx-auto max-w-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runLookup(ref);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="e.g. GP-AB12CD"
          autoCapitalize="characters"
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary justify-center sm:px-6"
        >
          {loading ? "Looking up…" : "Track"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {data ? (
        <div className="mt-8 rounded-[1.35rem] border border-white/[0.08] bg-ink-900/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                Order
              </p>
              <p className="font-display text-xl font-extrabold text-white">
                {data.ref}
              </p>
              {data.customerName ? (
                <p className="mt-1 text-sm text-white/50">{data.customerName}</p>
              ) : null}
            </div>
            {typeof data.total === "number" ? (
              <p className="text-lg font-extrabold tabular-nums text-brand">
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
                      : "border border-white/15 text-white/35"
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
                      ? "font-bold text-brand"
                      : step.done
                        ? "text-white/80"
                        : "text-white/35"
                  }
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>

          {data.orderStatus === "CANCELLED" ? (
            <p className="mt-4 text-sm text-white/50">This order was cancelled.</p>
          ) : null}

          {data.items && data.items.length > 0 ? (
            <ul className="mt-6 space-y-2 border-t border-white/[0.06] pt-4">
              {data.items.map((item, i) => (
                <li
                  key={`${item.name}-${i}`}
                  className="flex justify-between gap-3 text-sm text-white/65"
                >
                  <span>
                    {item.qty}× {item.name}
                  </span>
                  <span className="tabular-nums text-white/45">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-6 text-center text-xs text-white/40">
            Printing jobs? Use the track link from your print confirmation, or
            open{" "}
            <Link href="/services" className="text-brand hover:underline">
              Services
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
