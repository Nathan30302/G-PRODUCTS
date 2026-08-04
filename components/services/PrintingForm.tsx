"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ServiceSettings } from "@/lib/services";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/config/site";
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
  "mt-1 w-full rounded-xl border border-ink-950/10 bg-[#f7f8f9] px-4 py-2.5 text-ink-950 outline-none focus:border-brand";

type Phase = "form" | "submitting" | "done" | "pending";

const NEEDS_FILE = new Set([
  "bw-copy",
  "color-copy",
  "bw-print",
  "color-print",
  "nrc-copy",
  "certificate"
]);

export function PrintingForm({ settings }: { settings: ServiceSettings }) {
  const menu = settings.printMenu?.length
    ? settings.printMenu
    : [
        { id: "bw-print", name: "Printing (B&W)", price: settings.printBw },
        { id: "color-print", name: "Colour Printing", price: settings.printColor }
      ];
  const [jobId, setJobId] = useState(menu[0]?.id ?? "bw-print");
  const job = menu.find((m) => m.id === jobId) ?? menu[0];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
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

  const perUnit = job?.price ?? settings.printBw;
  const estimate = useMemo(
    () => Math.round(perUnit * pages * copies * 10) / 10,
    [perUnit, pages, copies]
  );
  const needsFile = NEEDS_FILE.has(jobId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (needsFile && (!files || files.length === 0)) {
      setError("Please upload at least one document.");
      return;
    }
    setPhase("submitting");

    const form = new FormData();
    form.set("serviceType", "PRINTING");
    form.set("customerName", name);
    form.set("customerPhone", phone);
    form.set("deliveryMethod", delivery);
    form.set("address", address);
    form.set("paymentMethod", pay);
    form.set(
      "details",
      JSON.stringify({
        jobId,
        jobName: job?.name,
        unitPrice: perUnit,
        pages,
        copies,
        notes
      })
    );
    if (files) Array.from(files).forEach((f) => form.append("files", f));

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
          ? "Print order received. Pay with Mobile Money and confirm on WhatsApp — we'll prepare your job for pickup or Yango delivery."
          : "Approve the payment on your phone. Once paid, we'll process your job."
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
              if (j.paymentStatus === "SUCCESS") {
                setPhase("done");
                setMessage("Payment received. We'll prepare your print job.");
              } else {
                setError("Payment failed. You can try again.");
                setPhase("form");
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
        title={phase === "pending" ? "Approve payment" : "Print order placed"}
        refCode={refCode}
        message={message}
        total={total}
        pending={phase === "pending"}
        waLines={[
          `*Printing* — ${refCode}`,
          `${job?.name ?? "Print"} · ${pages} × ${copies}`,
          `Total: ${formatPrice(total)}`,
          `Delivery: ${
            delivery === "YANGO"
              ? `Yango — ${address}`
              : `Pickup (${siteConfig.locations[0]})`
          }`
        ]}
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-ink-950/50">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-sm text-ink-950/50">Phone (WhatsApp)</span>
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
        <p className="text-sm font-semibold text-ink-950">Service</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {menu.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setJobId(m.id)}
              className={`rounded-xl border p-3 text-left ${
                jobId === m.id
                  ? "border-brand bg-brand/10"
                  : "border-ink-700 bg-white"
              }`}
            >
              <span className="block text-sm font-bold text-ink-950">{m.name}</span>
              <span className="text-xs text-ink-950/45">
                {formatPrice(m.price)} / unit
              </span>
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm text-ink-950/50">
          Upload documents (PDF, Word, images — max 12MB each)
          {needsFile ? "" : " — optional for this service"}
        </span>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
          onChange={(e) => setFiles(e.target.files)}
          className="mt-1 block w-full text-sm text-ink-950/70 file:mr-4 file:rounded-pill file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-bold file:text-ink-950"
          required={needsFile}
        />
        {files && files.length > 0 && (
          <p className="mt-2 text-xs text-ink-950/40">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </p>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-ink-950/50">Quantity / pages</span>
          <input
            type="number"
            min={1}
            value={pages}
            onChange={(e) => setPages(Math.max(1, Number(e.target.value) || 1))}
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-sm text-ink-950/50">Copies</span>
          <input
            type="number"
            min={1}
            value={copies}
            onChange={(e) =>
              setCopies(Math.max(1, Number(e.target.value) || 1))
            }
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-ink-950/50">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={field}
          placeholder="e.g. Staple, double-sided, A4…"
        />
      </label>

      <DeliveryPicker
        method={delivery}
        address={address}
        onMethod={setDelivery}
        onAddress={setAddress}
      />

      <PaymentPicker method={pay} onChange={setPay} />

      <div className="flex items-center justify-between rounded-xl border border-ink-950/10 bg-white px-4 py-3">
        <span className="text-sm text-ink-950/50">Estimated total</span>
        <span className="text-lg font-black text-ink-950">
          {formatPrice(estimate)}
        </span>
      </div>
      <p className="text-xs text-ink-950/40">
        We&apos;ll confirm on WhatsApp if the final count changes after we check
        your files.
      </p>

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
        {phase === "submitting" ? "Placing order..." : "Place print order"}
      </button>
    </form>
  );
}
