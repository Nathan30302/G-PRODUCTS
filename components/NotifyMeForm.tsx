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
      <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-4">
        <p className="text-sm font-semibold text-accent">You&apos;re on the list</p>
        <p className="mt-1 text-sm text-accent/80">
          We&apos;ll notify you
          {variantName ? ` when ${variantName} is back` : " when it&apos;s back"}{" "}
          in stock.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-ink-900/50 p-4">
      <p className="text-sm font-semibold text-white">Notify me when available</p>
      <p className="mt-1 text-sm text-white/45">
        This colour is out of stock. Leave your WhatsApp or email and we&apos;ll
        reach out when it&apos;s back.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
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
        className="w-full rounded-pill bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-white/[0.12] disabled:opacity-60"
      >
        {status === "loading" ? "Saving..." : "Notify me"}
      </button>
    </form>
    </div>
  );
}
