"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-g flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-red-500/15 text-red-400">
        <Icon name="refresh" className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-2xl font-black text-white">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-sm text-white/50">
        We hit a snag loading this page. Please try again in a moment.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn-brand">
          <Icon name="refresh" className="h-4 w-4" />
          Try again
        </button>
        <Link href="/" className="btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
