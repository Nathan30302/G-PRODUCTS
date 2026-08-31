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
    <div className="gp-card mx-auto max-w-md p-8 text-center shadow-float">
      <div
        className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          pending ? "bg-brand/15 text-brand" : "bg-accent/15 text-accent-dark"
        }`}
      >
        <Icon name={pending ? "clock" : "check"} className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-gp-text">{title}</h2>
      <p className="mt-2 text-sm text-gp-text-subtle">
        Ref <span className="font-mono font-medium text-gp-text">{refCode}</span>
      </p>
      {typeof total === "number" && (
        <p className="mt-2 text-lg font-bold text-ink-700">{formatPrice(total)}</p>
      )}
      {typeof fileCount === "number" && fileCount > 0 ? (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-pill border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-ink-800">
          <Icon name="file" className="h-3.5 w-3.5" />
          {fileCount} file{fileCount === 1 ? "" : "s"} with our printing team
        </p>
      ) : null}
      <p className="mt-3 text-gp-text-muted">{message}</p>
      {pending && (
        <div className="mt-5 flex justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      )}
      {trackHref ? (
        <Link
          href={trackHref}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill border border-gp-border bg-gp-muted px-4 py-3 text-sm font-semibold text-gp-text transition-colors hover:border-brand/40 hover:bg-brand/10"
        >
          <Icon name="clock" className="h-4 w-4 text-brand" />
          Track this request
        </Link>
      ) : null}
      <a
        href={serviceWhatsAppLink(waLines)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-3 w-full"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Message on WhatsApp
      </a>
      <Link href="/services" className="btn-brand mt-3 w-full">
        Back to services
      </Link>
    </div>
  );
}
