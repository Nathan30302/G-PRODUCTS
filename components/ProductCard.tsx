"use client";

import { useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Product, fromPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { StockBadge } from "@/components/StockBadge";
import { coverImageForProduct } from "@/lib/product-images";
import { DealCountdown } from "@/components/DealCountdown";
import { siteConfig } from "@/config/site";

function peekUrls(product: Product): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const img of product.images) {
    if (!img.url || seen.has(img.url)) continue;
    seen.add(img.url);
    out.push(img.url);
    if (out.length >= 3) break;
  }
  if (out.length === 0) {
    const cover = coverImageForProduct(
      product,
      product.variants.find((v) => v.available) ?? product.variants[0] ?? null
    );
    if (cover) out.push(cover);
  }
  return out;
}

export function ProductCard({
  product,
  priority = false,
  compact = false
}: {
  product: Product;
  priority?: boolean;
  /** Smaller card for horizontal rails and dense grids (Plug-style). */
  compact?: boolean;
}) {
  const soldOut = product.stock === "sold_out";
  const photos = peekUrls(product);
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const swiping = useRef(false);

  function onTouchStart(e: TouchEvent) {
    startX.current = e.touches[0].clientX;
    swiping.current = false;
  }

  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) < 28 || photos.length < 2) return;
    swiping.current = true;
    setIndex((i) =>
      Math.max(0, Math.min(photos.length - 1, i + (dx < 0 ? 1 : -1)))
    );
  }

  const radius = compact ? "rounded-xl" : "rounded-2xl";
  const imagePad = compact ? "p-1 sm:p-1.5" : "p-2 sm:p-2.5";
  const imageSizes = compact
    ? "(max-width: 640px) 30vw, 11rem"
    : "(max-width: 640px) 46vw, (max-width: 768px) 72vw, (max-width: 1024px) 30vw, 16rem";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border border-white/[0.06] bg-ink-900/70 transition-all duration-300 ease-out-expo hover:border-brand/25 active:scale-[0.98] ${radius} ${
        compact ? "" : "hover:-translate-y-0.5 hover:shadow-brand-glow sm:active:scale-[0.97]"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-[#f4f4f2] ${
          compact ? "aspect-[5/6]" : "aspect-square"
        }`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => {
          if (!compact && photos.length > 1) setIndex(1 % photos.length);
        }}
        onMouseLeave={() => setIndex(0)}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#fff_0%,#ececeb_70%)]" />
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-[1]"
          onClick={(e) => {
            if (swiping.current) e.preventDefault();
          }}
          aria-label={product.name}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={photos[index] ?? "empty"}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <SafeImage
                src={photos[index] ?? null}
                alt={product.name}
                fill
                priority={priority}
                quality={compact ? 82 : 88}
                sizes={imageSizes}
                className={`object-contain ${imagePad} ${
                  soldOut ? "opacity-50 saturate-[0.65]" : ""
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </Link>
        {product.hotDeal ? (
          <span className="pointer-events-none absolute left-1.5 top-1.5 z-[2] rounded-pill bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-950 shadow-sm">
            Deal
          </span>
        ) : null}
        {!compact && photos.length > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[2] flex justify-center gap-1">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? "w-3.5 bg-ink-950" : "w-1 bg-ink-950/25"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <Link
        href={`/product/${product.slug}`}
        className={`flex flex-1 flex-col gap-0.5 ${compact ? "px-1.5 pb-2 pt-1.5" : "gap-1 px-2 pb-2.5 pt-2 sm:px-2.5"}`}
      >
        {product.brand ? (
          <p className="truncate text-[10px] font-medium uppercase tracking-wide text-white/40">
            {product.brand}
          </p>
        ) : null}
        <h3
          className={`line-clamp-2 font-semibold leading-snug text-white transition-colors group-hover:text-brand ${
            compact ? "text-[11px] sm:text-xs" : "text-[13px] sm:text-sm"
          }`}
        >
          {product.name}
        </h3>
        <div className="mt-auto flex flex-col gap-0.5 pt-0.5">
          <div className="flex items-baseline justify-between gap-1">
            <span
              className={`font-bold tabular-nums text-white ${
                compact ? "text-[11px] sm:text-xs" : "text-[13px] sm:text-sm"
              }`}
            >
              {hasPricedOptions(product)
                ? `From ${formatPrice(fromPrice(product))}`
                : formatPrice(product.price)}
            </span>
            {!compact ? (
              <StockBadge status={product.stock} size="compact" />
            ) : soldOut ? (
              <span className="text-[9px] font-semibold uppercase text-white/35">
                Out
              </span>
            ) : null}
          </div>
          {product.compareAtPrice &&
          product.compareAtPrice > product.price &&
          !hasPricedOptions(product) ? (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] tabular-nums text-white/35 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              {!compact ? (
                <span className="rounded-pill bg-accent/15 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              ) : null}
              {product.hotDeal && !compact ? (
                <DealCountdown endsAt={siteConfig.dealSeasonEndsAt} />
              ) : null}
            </div>
          ) : product.hotDeal && !compact ? (
            <DealCountdown endsAt={siteConfig.dealSeasonEndsAt} />
          ) : null}
        </div>
      </Link>
    </article>
  );
}
