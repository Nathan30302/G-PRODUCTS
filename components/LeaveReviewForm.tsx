"use client";

import { useState } from "react";
import { Icon } from "@/components/Icons";

export function LeaveReviewForm({
  productSlug,
  productName,
  defaultName = "",
  orderRef = ""
}: {
  productSlug: string;
  productName: string;
  defaultName?: string;
  orderRef?: string;
}) {
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState(defaultName);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ref, setRef] = useState(orderRef);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productSlug,
          rating,
          title,
          body,
          authorName,
          orderRef: ref || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save review.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-accent/25 bg-accent/10 px-4 py-5 text-sm text-accent">
        Thank you — your review for <strong>{productName}</strong> is live.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[1.25rem] border border-white/[0.08] bg-ink-900/60 p-5"
    >
      <h3 className="text-sm font-bold text-white">Leave a review</h3>
      <p className="mt-1 text-xs text-white/45">
        Sign in on your account first. Reviews are tied to your profile.
      </p>

      <div className="mt-4 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className="p-1"
            aria-label={`${n} stars`}
          >
            <Icon
              name="star"
              className={`h-6 w-6 ${
                n <= rating ? "text-brand" : "text-white/20"
              }`}
            />
          </button>
        ))}
      </div>

      <label className="mt-4 block text-xs text-white/50">
        Your name
        <input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
        />
      </label>

      <label className="mt-3 block text-xs text-white/50">
        Title (optional)
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
          placeholder="Short headline"
        />
      </label>

      <label className="mt-3 block text-xs text-white/50">
        Your review
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          className="mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
          placeholder="What did you like? Would you buy again?"
        />
      </label>

      <label className="mt-3 block text-xs text-white/50">
        Order ref (optional — marks as verified purchase)
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value.toUpperCase())}
          className="mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm uppercase text-white outline-none focus:border-brand"
          placeholder="GP-XXXXXX"
        />
      </label>

      {error ? (
        <p className="mt-3 text-xs text-red-300">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary mt-4 w-full justify-center"
      >
        {busy ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
