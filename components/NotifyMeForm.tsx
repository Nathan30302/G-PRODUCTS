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
        <p className="text-sm font-semibold text-ink-850">You&apos;re on the list</p>
        <p className="mt-1 text-sm text-gp-text-muted">
          The shop will WhatsApp or email you
          {variantName ? ` when ${variantName} is back` : " when it's back"} in
          stock.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gp-border bg-gp-surface p-4 shadow-sm">
      <p className="text-sm font-semibold text-gp-text">Notify me when available</p>
      <p className="mt-1 text-sm text-gp-text-muted">
        This option is out of stock. Leave your WhatsApp or email and the shop
        will reach out when it&apos;s back.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          placeholder="Phone or email"
          className="w-full rounded-xl border border-gp-border bg-gp-surface px-4 py-3 text-sm text-gp-text outline-none placeholder:text-gp-text-subtle focus:border-brand/70 focus:shadow-[0_0_0_4px_rgba(229,243,79,0.28)]"
        />
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full min-h-11 rounded-pill bg-ink-850 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-ink-950 disabled:opacity-60"
        >
          {status === "loading" ? "Saving…" : "Notify me"}
        </button>
      </form>
    </div>
  );
}
