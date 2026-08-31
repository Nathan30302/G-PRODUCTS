"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BundleDef } from "@/lib/bundles";
import { bundleLineTotal } from "@/lib/bundles";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { coverImageForProduct } from "@/lib/product-images";
import { Icon } from "@/components/Icons";
import { hapticTap } from "@/lib/haptics";

function packPreviewImages(
  bundle: BundleDef,
  productsBySlug: Map<string, Product>
): string[] {
  const urls: string[] = [];
  for (const item of bundle.items) {
    const p = productsBySlug.get(item.slug);
    if (!p) continue;
    const cover = coverImageForProduct(
      p,
      p.variants.find((v) => v.available) ?? p.variants[0] ?? null
    );
    if (cover && !urls.includes(cover)) urls.push(cover);
    if (urls.length >= 4) break;
  }
  return urls;
}

export function BundleCard({
  bundle,
  productsBySlug,
  featured = false
}: {
  bundle: BundleDef;
  productsBySlug: Map<string, Product>;
  featured?: boolean;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { total, missing, lines } = bundleLineTotal(bundle, productsBySlug);
  const ready = lines.length > 0 && missing.length === 0;
  const previews = packPreviewImages(bundle, productsBySlug);
  const itemCount = bundle.items.reduce((n, i) => n + i.qty, 0);

  function addBundle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!ready) return;
    hapticTap();
    setBusy(true);
    for (const line of lines) {
      add(line.product, undefined, line.qty);
    }
    router.push("/cart");
  }

  return (
    <Link
      href={`/bundles/${bundle.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-gp-border/80 bg-gp-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.99] ${
        featured ? "ring-1 ring-brand/25" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gp-muted">
        {previews.length > 0 ? (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
            {previews.slice(0, 4).map((url, i) => (
              <div
                key={url}
                className={`relative overflow-hidden bg-white ${
                  previews.length === 1 ? "col-span-2 row-span-2" : ""
                } ${previews.length === 3 && i === 0 ? "col-span-2" : ""}`}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-850 to-ink-950">
            <Icon name="cart" className="h-10 w-10 text-brand/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
        {bundle.badge ? (
          <span className="absolute left-3 top-3 rounded-pill bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-950 shadow-sm">
            {bundle.badge}
          </span>
        ) : null}
        <span className="absolute bottom-3 right-3 rounded-pill bg-white/95 px-2.5 py-1 text-[10px] font-bold tabular-nums text-ink-700 shadow-sm">
          {itemCount} items
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold text-gp-text">
              {bundle.name}
            </h2>
            <p className="mt-1 text-sm text-gp-text-muted">{bundle.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gp-text-subtle">
              From
            </p>
            <p className="text-xl font-extrabold tabular-nums text-ink-700">
              {ready ? formatPrice(total) : "—"}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gp-text-muted">
          {bundle.description}
        </p>

        {missing.length > 0 ? (
          <p className="mt-3 text-xs text-amber-700">
            Some items temporarily unavailable
          </p>
        ) : null}

        <div className="mt-auto flex gap-2 pt-5">
          <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-pill border border-gp-border bg-gp-muted px-4 py-2.5 text-sm font-bold text-gp-text transition-colors group-hover:border-ink-700/25">
            View pack
            <Icon
              name="arrow-right"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>
          <button
            type="button"
            disabled={!ready || busy}
            onClick={addBundle}
            className="btn-brand shrink-0 px-4 py-2.5 text-sm disabled:opacity-40"
            aria-label="Add pack to cart"
          >
            <Icon name="cart" className="h-4 w-4" />
            {busy ? "…" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
