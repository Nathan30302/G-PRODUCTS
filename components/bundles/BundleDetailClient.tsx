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
import { ShopStickyBar } from "@/components/shop/ui";

export function BundleDetailClient({
  bundle,
  productsBySlug
}: {
  bundle: BundleDef;
  productsBySlug: Map<string, Product>;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { total, missing, lines } = bundleLineTotal(bundle, productsBySlug);
  const ready = lines.length > 0 && missing.length === 0;
  const itemCount = bundle.items.reduce((n, i) => n + i.qty, 0);

  function addBundle() {
    if (!ready) return;
    hapticTap();
    setBusy(true);
    for (const line of lines) {
      add(line.product, undefined, line.qty);
    }
    router.push("/cart");
  }

  return (
    <>
      <div className="mt-8 grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <div className="gp-card !p-0 overflow-hidden">
            <div className="border-b border-gp-border/70 bg-gp-muted/50 px-5 py-4 sm:px-6">
              <p className="section-label">What&apos;s inside</p>
              <p className="mt-1 text-sm text-gp-text-muted">
                {itemCount} items · adjust quantities in cart after adding
              </p>
            </div>
            <ul className="divide-y divide-gp-border/70">
              {bundle.items.map((item) => {
                const p = productsBySlug.get(item.slug);
                const cover = p
                  ? coverImageForProduct(
                      p,
                      p.variants.find((v) => v.available) ??
                        p.variants[0] ??
                        null
                    )
                  : null;
                return (
                  <li
                    key={item.slug}
                    className="flex items-center gap-4 px-5 py-4 sm:px-6"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gp-border bg-white">
                      {cover ? (
                        <Image
                          src={cover}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-gp-text-subtle">
                          <Icon name="cart" className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gp-text">
                        <span className="text-ink-700">{item.qty}×</span>{" "}
                        {p ? (
                          <Link
                            href={`/product/${p.slug}`}
                            className="hover:text-ink-700 hover:underline"
                          >
                            {p.name}
                          </Link>
                        ) : (
                          item.slug
                        )}
                      </p>
                      {item.note ? (
                        <p className="mt-0.5 text-xs text-gp-text-subtle">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                    {p ? (
                      <p className="shrink-0 font-bold tabular-nums text-gp-text">
                        {formatPrice(p.price * item.qty)}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="gp-card shadow-float lg:sticky lg:top-[calc(var(--chrome-h)+0.75rem)]">
            <p className="section-label">Pack total</p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-ink-700">
              {ready ? formatPrice(total) : "—"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
              {bundle.description}
            </p>

            {missing.length > 0 ? (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                Some items are temporarily unavailable in the catalogue.
              </p>
            ) : null}

            <button
              type="button"
              disabled={!ready || busy}
              onClick={addBundle}
              className="btn-brand mt-6 w-full disabled:opacity-40"
            >
              <Icon name="cart" className="h-5 w-5" />
              {busy ? "Adding to cart…" : "Add entire pack to cart"}
            </button>

            <Link
              href="/search"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill border border-gp-border px-4 py-3 text-sm font-semibold text-gp-text-muted transition-colors hover:border-ink-700/25 hover:text-gp-text"
            >
              Browse catalogue instead
            </Link>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gp-text-subtle">
              <Icon name="shield" className="h-3.5 w-3.5" />
              Edit quantities in cart before checkout
            </p>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <ShopStickyBar>
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-gp-text-subtle">Pack total</p>
              <p className="text-lg font-extrabold tabular-nums text-gp-text">
                {ready ? formatPrice(total) : "—"}
              </p>
            </div>
            <button
              type="button"
              disabled={!ready || busy}
              onClick={addBundle}
              className="btn-brand flex flex-1 justify-center disabled:opacity-40"
            >
              <Icon name="cart" className="h-4 w-4" />
              {busy ? "Adding…" : "Add pack"}
            </button>
          </div>
        </ShopStickyBar>
      </div>
    </>
  );
}
