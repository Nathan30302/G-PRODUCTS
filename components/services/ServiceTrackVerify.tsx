"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ServiceTrackVerify({ ref }: { ref: string }) {
  const router = useRouter();
  const [phoneLast4, setPhoneLast4] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const last4 = phoneLast4.replace(/\D/g, "").slice(-4);
    if (last4.length !== 4) {
      setError("Enter the last 4 digits of the phone number on this request.");
      return;
    }
    setError("");
    router.replace(
      `/services/track/${encodeURIComponent(ref)}?phoneLast4=${encodeURIComponent(last4)}`
    );
  }

  return (
    <div className="container-g py-10 sm:py-14">
      <div className="mx-auto max-w-md rounded-[1.35rem] border border-white/[0.08] bg-ink-900/60 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
          Verify it&apos;s you
        </p>
        <h1 className="display mt-2 text-2xl">Track {ref}</h1>
        <p className="mt-2 text-sm text-white/45">
          Enter the last 4 digits of the phone number you used on this service
          request. This keeps your files and details private.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="field-label">Last 4 digits of your phone</span>
            <input
              value={phoneLast4}
              onChange={(e) =>
                setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              className="field text-center font-mono text-lg tracking-[0.35em]"
              placeholder="••••"
            />
          </label>
          {error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn-brand w-full py-3.5 text-sm">
            View status
          </button>
        </form>
      </div>
    </div>
  );
}
