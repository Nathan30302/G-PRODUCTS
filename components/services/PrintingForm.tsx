"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PRINT_PRICE_BW, PRINT_PRICE_COLOR } from "@/lib/services";
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

export function PrintingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [colour, setColour] = useState<"bw" | "color">("bw");
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

  const estimate = useMemo(() => {
    const rate = colour === "color" ? PRINT_PRICE_COLOR : PRINT_PRICE_BW;
    return rate * pages * copies;
  }, [colour, pages, copies]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!files || files.length === 0) {
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
      JSON.stringify({ colour, pages, copies, notes })
    );
    Array.from(files).forEach((f) => form.append("files", f));

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
          ? "Print order received. Pay with Mobile Money and confirm on WhatsApp — we'll download your files, print, then ready for pickup or Yango delivery."
          : "Approve the payment on your phone. Once paid, we'll print your documents."
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
                  "Payment confirmed! We'll print your documents and notify you for pickup or Yango delivery."
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
        title={phase === "pending" ? "Approve payment" : "Print order placed"}
        refCode={refCode}
        message={message}
        total={total}
        pending={phase === "pending"}
        waLines={[
          `*Printing* — ${refCode}`,
          `${colour === "color" ? "Colour" : "Black & white"} · ${pages} pages × ${copies} copies`,
          `Total: ${formatPrice(total)}`,
          `Delivery: ${delivery === "YANGO" ? `Yango — ${address}` : "Pickup at Kalingalinga"}`,
          "Files were uploaded with this order."
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

      <label className="block">
        <span className="text-sm text-white/60">
          Upload documents (PDF, Word, images — max 12MB each)
        </span>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
          onChange={(e) => setFiles(e.target.files)}
          className="mt-1 block w-full text-sm text-white/70 file:mr-4 file:rounded-pill file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-bold file:text-ink-950"
          required
        />
        {files && files.length > 0 && (
          <p className="mt-2 text-xs text-white/40">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </p>
        )}
      </label>

      <div>
        <p className="text-sm font-semibold text-white">Print colour</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setColour("bw")}
            className={`rounded-xl border p-3 text-left ${
              colour === "bw"
                ? "border-brand bg-brand/10"
                : "border-ink-700 bg-ink-900"
            }`}
          >
            <span className="block font-bold text-white">Black & white</span>
            <span className="text-sm text-white/50">
              {formatPrice(PRINT_PRICE_BW)} / page
            </span>
          </button>
          <button
            type="button"
            onClick={() => setColour("color")}
            className={`rounded-xl border p-3 text-left ${
              colour === "color"
                ? "border-brand bg-brand/10"
                : "border-ink-700 bg-ink-900"
            }`}
          >
            <span className="block font-bold text-white">Colour</span>
            <span className="text-sm text-white/50">
              {formatPrice(PRINT_PRICE_COLOR)} / page
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-white/60">Pages (estimate)</span>
          <input
            type="number"
            min={1}
            value={pages}
            onChange={(e) => setPages(Math.max(1, Number(e.target.value) || 1))}
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/60">Copies</span>
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
        <span className="text-sm text-white/60">Notes (optional)</span>
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

      <div className="flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900 px-4 py-3">
        <span className="text-sm text-white/60">Estimated total</span>
        <span className="text-lg font-black text-white">
          {formatPrice(estimate)}
        </span>
      </div>
      <p className="text-xs text-white/40">
        Final page count may be adjusted after we open your files — we&apos;ll
        confirm on WhatsApp before printing if it changes.
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
        {phase === "submitting" ? "Uploading & placing order..." : "Order printing"}
      </button>
    </form>
  );
}
