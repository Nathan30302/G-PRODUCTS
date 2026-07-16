"use client";

import { useState, type FormEvent } from "react";

export function NotifyMeForm({
  productId,
  variantId,
  variantName
}: {
  productId: string;
  variantId?: string;
  variantName?: string;
}) {
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/stock-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, contact })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setError("Network error.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
        Got it — we&apos;ll notify you
        {variantName ? ` when ${variantName} is back` : " when it&apos;s back"}{" "}
        in stock.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-sm text-white/50">
        This option is out of stock. Leave your WhatsApp number or email and
        we&apos;ll tell you when it&apos;s available.
      </p>
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
        placeholder="Phone or email"
        className="w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-pill border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/[0.1] disabled:opacity-60"
      >
        {status === "loading" ? "Saving..." : "Notify me"}
      </button>
    </form>
  );
}
