"use client";

import { useState } from "react";
import { REFERRAL_MIN_ZMW, REFERRAL_PERCENT } from "@/lib/referral-terms";

export function ReferralCard({
  name,
  email,
  link,
  rewardReady
}: {
  name: string;
  email: string;
  link: string;
  rewardReady: boolean;
}) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setShown(true);
      }}
    >
      <div className="rounded-2xl border border-brand/40 bg-brand/15 px-4 py-4">
        <p className="text-sm font-bold text-ink-950">Share the love</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-800">
          Your friend gets {REFERRAL_PERCENT}% off their first G-Products order
          of K{REFERRAL_MIN_ZMW} plus. After that order is fulfilled, you also
          get {REFERRAL_PERCENT}% off your next order.
        </p>
        {rewardReady ? (
          <p className="mt-3 text-sm font-semibold text-ink-950">
            Your {REFERRAL_PERCENT}% off is ready. It applies on your next
            order.
          </p>
        ) : null}
      </div>

      <label className="block">
        <span className="field-label">Your name</span>
        <input
          name="name"
          defaultValue={name}
          required
          className="field mt-2"
        />
      </label>
      <label className="block">
        <span className="field-label">Email address</span>
        <input
          name="email"
          type="email"
          defaultValue={email}
          required
          className="field mt-2"
        />
      </label>
      <button type="submit" className="btn-brand px-5 py-2.5 text-sm">
        Get my referral link
      </button>

      {shown && link ? (
        <div className="rounded-2xl border border-gp-border bg-gp-surface px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gp-text-subtle">
            Your link
          </p>
          <p className="mt-2 break-all text-sm font-semibold text-ink-800">
            {link}
          </p>
          <button
            type="button"
            className="btn-ghost mt-3 px-4 py-2 text-sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(link);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
