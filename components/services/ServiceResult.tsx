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
  pending
}: {
  title: string;
  refCode: string;
  message: string;
  total?: number;
  waLines: string[];
  pending?: boolean;
}) {
  return (
    <div className="mx-auto max-w-md rounded-[1.35rem] border border-ink-950/8 bg-white p-8 text-center">
      <div
        className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
          pending ? "bg-brand/15 text-brand" : "bg-accent/15 text-accent"
        }`}
      >
        <Icon name={pending ? "clock" : "check"} className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-ink-950">{title}</h2>
      <p className="mt-2 text-sm text-ink-950/40">
        Ref <span className="font-mono text-ink-950/70">{refCode}</span>
      </p>
      {typeof total === "number" && (
        <p className="mt-2 text-lg font-bold text-brand">{formatPrice(total)}</p>
      )}
      <p className="mt-3 text-ink-950/50">{message}</p>
      {pending && (
        <div className="mt-5 flex justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      )}
      <a
        href={serviceWhatsAppLink(waLines)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/20"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Confirm on WhatsApp
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
