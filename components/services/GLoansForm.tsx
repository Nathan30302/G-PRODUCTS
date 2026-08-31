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
import {
  serviceField,
  serviceLabel,
  serviceOptionClass,
  ServiceSubmitButton
} from "@/components/services/service-ui";

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

      <div className="service-estimate">
        <p className="text-sm font-semibold text-gp-text">What you need</p>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-gp-text-muted">
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
              className={`${serviceOptionClass(weeks === r.weeks)} text-center`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gp-text-subtle">
                {r.weeks} wk
              </p>
              <p className="text-lg font-black text-ink-700">{r.rate}%</p>
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
            <span className={serviceLabel}>Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={serviceField}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={serviceLabel}>Amount needed (ZMW)</span>
            <input
              type="number"
              min={LOAN_MIN}
              step={50}
              required
              value={amount}
              onChange={(e) =>
                setAmount(Math.max(LOAN_MIN, Number(e.target.value) || LOAN_MIN))
              }
              className={serviceField}
            />
          </label>
          <label className="block">
            <span className={serviceLabel}>Term</span>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className={serviceField}
            >
              {LOAN_RATES.map((r) => (
                <option key={r.weeks} value={r.weeks}>
                  {r.weeks} week{r.weeks > 1 ? "s" : ""} — {r.rate}%
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="rounded-xl border border-gp-border bg-gp-muted px-4 py-3 text-sm text-gp-text-muted">
          Est. interest {formatPrice(interest)} · Est. repay{" "}
          <span className="font-bold text-ink-700">{formatPrice(repay)}</span>
        </div>
      </FormSection>

      <FormSection
        title="2 · Collateral"
        hint="Describe what you will leave — must be worth more than the loan."
      >
        <label className="block">
          <span className={serviceLabel}>Collateral description</span>
          <textarea
            required
            value={collateral}
            onChange={(e) => setCollateral(e.target.value)}
            rows={2}
            className={serviceField}
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
        <label className="flex items-start gap-3 text-sm text-gp-text-muted">
          <input
            type="checkbox"
            checked={hasNrc}
            onChange={(e) => setHasNrc(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#f6d400]"
          />
          I confirm this is a copy of my original NRC
        </label>
        <label className="block">
          <span className={serviceLabel}>Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={serviceField}
          />
        </label>
      </FormSection>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <ServiceSubmitButton
        busy={submitting}
        label={`Request ${formatPrice(amount)} loan`}
        busyLabel="Sending request..."
      />
    </form>
  );
}
