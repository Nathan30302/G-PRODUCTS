"use client";

import Link from "next/link";
import { Icon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";
import { serviceWhatsAppLink } from "@/lib/whatsapp";

export function ServiceResult({
  title,
  refCode,
  message,
  total,
  waLines,
  pending,
  trackHref,
  fileCount
}: {
  title: string;
  refCode: string;
  message: string;
  total?: number;
  waLines: string[];
  pending?: boolean;
  trackHref?: string;
  fileCount?: number;
}) {
  return (
    <div className="mx-auto max-w-md rounded-[1.35rem] border border-white/[0.07] bg-ink-900/55 p-8 text-center">
      <div
        className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          pending ? "bg-brand/15 text-brand" : "bg-accent/15 text-accent"
        }`}
      >
        <Icon name={pending ? "clock" : "check"} className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/40">
        Ref <span className="font-mono text-white/70">{refCode}</span>
      </p>
      {typeof total === "number" && (
        <p className="mt-2 text-lg font-bold text-brand">{formatPrice(total)}</p>
      )}
      {typeof fileCount === "number" && fileCount > 0 ? (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-pill border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          <Icon name="file" className="h-3.5 w-3.5" />
          {fileCount} file{fileCount === 1 ? "" : "s"} with Gift&apos;s team
        </p>
      ) : null}
      <p className="mt-3 text-white/60">{message}</p>
      {pending && (
        <div className="mt-5 flex justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      )}
      {trackHref ? (
        <Link
          href={trackHref}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white hover:border-brand/40 hover:bg-brand/10"
        >
          <Icon name="clock" className="h-4 w-4 text-brand" />
          Track this request
        </Link>
      ) : null}
      <a
        href={serviceWhatsAppLink(waLines)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/20"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Message on WhatsApp
      </a>
      <Link
        href="/services"
        className="mt-3 inline-block rounded-pill bg-brand px-6 py-3 text-sm font-bold text-ink-950 hover:bg-brand-soft"
      >
        Back to services
      </Link>
    </div>
  );
}
