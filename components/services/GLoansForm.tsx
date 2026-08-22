"use client";

import { useMemo, useState } from "react";
import type { ServiceSettings } from "@/lib/services";
import { formatPrice } from "@/lib/format";
import { ServiceResult } from "@/components/services/ServiceResult";
import {
  FormSection,
  ServiceSteps
} from "@/components/services/ServiceSteps";
import { FileUploadField } from "@/components/services/FileUploadField";

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";

const STEPS = ["Details", "Collateral", "NRC", "Send"];

export function GLoansForm({ settings }: { settings: ServiceSettings }) {
  const LOAN_MIN = settings.loanMin;
  const LOAN_RATES = settings.loanRates;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(LOAN_MIN);
  const [weeks, setWeeks] = useState(1);
  const [collateral, setCollateral] = useState("");
  const [hasNrc, setHasNrc] = useState(false);
  const [nrcFiles, setNrcFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{
    ref: string;
    message: string;
    files: number;
  } | null>(null);

  const rate = LOAN_RATES.find((r) => r.weeks === weeks)?.rate ?? 15;
  const interest = useMemo(
    () => Math.round((amount * rate) / 100),
    [amount, rate]
  );
  const repay = amount + interest;

  const stepIndex = useMemo(() => {
    if (!name || !phone || !amount) return 0;
    if (!collateral.trim()) return 1;
    if (!hasNrc || nrcFiles.length === 0) return 2;
    return 3;
  }, [name, phone, amount, collateral, hasNrc, nrcFiles.length]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!hasNrc) {
      setError("Confirm that you can provide your NRC.");
      return;
    }
    if (nrcFiles.length === 0) {
      setError("Please upload a clear photo or scan of your NRC.");
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
    nrcFiles.forEach((f) => form.append("files", f));

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
          "Loan request received. We'll review and contact you on WhatsApp.",
        files: typeof data.files === "number" ? data.files : nrcFiles.length
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
        trackHref={`/services/track/${done.ref}`}
        fileCount={done.files}
        waLines={[
          `*G-Loans request* — ${done.ref}`,
          `Amount: ${formatPrice(amount)}`,
          `Term: ${weeks} week(s) @ ${rate}%`,
          `Est. interest: ${formatPrice(interest)}`,
          `Est. repay: ${formatPrice(repay)}`,
          `Collateral: ${collateral}`,
          done.files > 0 ? `NRC files uploaded: ${done.files}` : ""
        ].filter(Boolean)}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <ServiceSteps steps={STEPS} current={stepIndex} />

      <div className="rounded-[1.15rem] border border-brand/20 bg-brand/[0.06] px-4 py-3.5">
        <p className="text-sm font-semibold text-white">What you need</p>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-white/55">
          <li>• Collateral worth more than the loan amount</li>
          <li>• Clear photo / scan of your original NRC</li>
          <li>• Minimum {formatPrice(LOAN_MIN)}</li>
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LOAN_RATES.map((r) => (
            <button
              key={r.weeks}
              type="button"
              onClick={() => setWeeks(r.weeks)}
              className={`rounded-xl border px-3 py-2 text-center transition-colors ${
                weeks === r.weeks
                  ? "border-brand bg-brand/15 ring-1 ring-brand/30"
                  : "border-ink-700 bg-ink-900/80 hover:border-ink-600"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
                {r.weeks} wk
              </p>
              <p className="text-lg font-black text-brand">{r.rate}%</p>
            </button>
          ))}
        </div>
      </div>

      <FormSection
        title="1 · Loan details"
        hint="Amount and term — interest updates live below."
      >
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
          <span className="font-bold text-brand">{formatPrice(repay)}</span>
        </div>
      </FormSection>

      <FormSection
        title="2 · Collateral"
        hint="Describe what you will leave — must be worth more than the loan."
      >
        <label className="block">
          <span className="text-sm text-white/60">Collateral description</span>
          <textarea
            required
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
            rows={2}
            className={field}
            placeholder="e.g. Laptop, phone, appliance…"
          />
        </label>
      </FormSection>

      <FormSection
        title="3 · NRC"
        hint="Upload a clear front (and back if needed). Kept for review only."
      >
        <FileUploadField
          files={nrcFiles}
          onChange={setNrcFiles}
          required
          multiple={false}
          maxFiles={2}
          label="Upload NRC"
          hint="Clear photo or scan of your original NRC."
          accept=".pdf,.png,.jpg,.jpeg,.webp"
        />
        <label className="flex items-start gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={hasNrc}
            onChange={(e) => setHasNrc(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#f6d400]"
          />
          I confirm this is a copy of my original NRC
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
      </FormSection>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-pill bg-brand px-6 py-3.5 text-sm font-bold text-ink-950 shadow-brand-glow hover:bg-brand-soft disabled:opacity-60"
      >
        {submitting
          ? "Sending request..."
          : `Request ${formatPrice(amount)} loan`}
      </button>
    </form>
  );
}
