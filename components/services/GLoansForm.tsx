"use client";

import { useMemo, useState } from "react";
import type { ServiceSettings } from "@/lib/services";
import { formatPrice } from "@/lib/format";
import { ServiceResult } from "@/components/services/ServiceResult";

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";

export function GLoansForm({ settings }: { settings: ServiceSettings }) {
  const LOAN_MIN = settings.loanMin;
  const LOAN_RATES = settings.loanRates;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(LOAN_MIN);
  const [weeks, setWeeks] = useState(1);
  const [collateral, setCollateral] = useState("");
  const [hasNrc, setHasNrc] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ ref: string; message: string } | null>(
    null
  );

  const rate = LOAN_RATES.find((r) => r.weeks === weeks)?.rate ?? 15;
  const interest = useMemo(
    () => Math.round((amount * rate) / 100),
    [amount, rate]
  );
  const repay = amount + interest;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!hasNrc) {
      setError("A copy of your original NRC is required.");
      return;
    }
    if (!collateral.trim()) {
      setError("Please describe your collateral.");
      return;
    }
    setSubmitting(true);
    const form = new FormData();
    form.set("serviceType", "G_LOANS");
    form.set("customerName", name);
    form.set("customerPhone", phone);
    form.set("deliveryMethod", "PICKUP");
    form.set(
      "details",
      JSON.stringify({ amount, weeks, rate, collateral, hasNrc, notes })
    );

    try {
      const res = await fetch("/api/services/request", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      setDone({
        ref: data.ref,
        message:
          data.message ??
          "Loan request received. We'll review and contact you on WhatsApp."
      });
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <ServiceResult
        title="Loan request sent"
        refCode={done.ref}
        message={done.message}
        total={amount}
        waLines={[
          `*G-Loans request* — ${done.ref}`,
          `Amount: ${formatPrice(amount)}`,
          `Term: ${weeks} week(s) @ ${rate}%`,
          `Est. interest: ${formatPrice(interest)}`,
          `Est. repay: ${formatPrice(repay)}`,
          `Collateral: ${collateral}`
        ]}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-card border border-ink-800 bg-ink-900 p-5">
        <h3 className="font-bold text-white">Requirements</h3>
        <ul className="mt-3 space-y-2 text-sm text-white/60">
          <li>• Collateral more valuable than the money borrowed</li>
          <li>• Copy of original NRC</li>
          <li>• Least amount: {formatPrice(LOAN_MIN)}</li>
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LOAN_RATES.map((r) => (
            <div
              key={r.weeks}
              className="rounded-xl border border-ink-700 bg-ink-850 px-3 py-2 text-center"
            >
              <p className="text-xs text-white/40">{r.weeks} week</p>
              <p className="text-lg font-black text-brand">{r.rate}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-white/60">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-white/60">Amount needed (ZMW)</span>
          <input
            type="number"
            min={LOAN_MIN}
            step={50}
            required
            value={amount}
            onChange={(e) =>
              setAmount(Math.max(LOAN_MIN, Number(e.target.value) || LOAN_MIN))
            }
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/60">Term</span>
          <select
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            className={field}
          >
            {LOAN_RATES.map((r) => (
              <option key={r.weeks} value={r.weeks}>
                {r.weeks} week{r.weeks > 1 ? "s" : ""} — {r.rate}%
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-ink-800 bg-ink-900 px-4 py-3 text-sm text-white/60">
        Est. interest {formatPrice(interest)} · Est. repay{" "}
        <span className="font-bold text-white">{formatPrice(repay)}</span>
      </div>

      <label className="block">
        <span className="text-sm text-white/60">
          Collateral (must be worth more than the loan)
        </span>
        <textarea
          required
          value={collateral}
          onChange={(e) => setCollateral(e.target.value)}
          rows={2}
          className={field}
          placeholder="e.g. Laptop, phone, appliance…"
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-white/70">
        <input
          type="checkbox"
          checked={hasNrc}
          onChange={(e) => setHasNrc(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#f6d400]"
        />
        I can provide a copy of my original NRC
      </label>

      <label className="block">
        <span className="text-sm text-white/60">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={field}
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:opacity-60"
      >
        {submitting ? "Sending request..." : "Request a loan"}
      </button>
    </form>
  );
}
