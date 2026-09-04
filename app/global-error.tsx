"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-white font-sans text-[#1a2321] antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f6b68]">
            G-Products
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#5f6b68]">
            The page hit a loading error. Tap below to reload — your cart and
            account are safe.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-[#233746] px-6 py-3 text-sm font-bold text-white"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-full border border-[#e8ebea] px-6 py-3 text-sm font-bold text-[#233746]"
            >
              Back to shop
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
