"use client";

import { useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product, fromPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { coverImageForProduct } from "@/lib/product-images";
import { Icon } from "@/components/Icons";
import { useCart } from "@/lib/cart";

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

function defaultVariant(product: Product) {
  return (
    product.variants.find((v) => v.available) ?? product.variants[0] ?? undefined
  );
}

/** Standard product card — used on home, search, category grids and rails. */
export function ProductCard({
  product,
  priority = false,
  compact = false
}: {
  product: Product;
  priority?: boolean;
  /** Denser layout for horizontal rails. */
  compact?: boolean;
}) {
  const router = useRouter();
  const { add } = useCart();
  const soldOut = product.stock === "sold_out";
  const photos = peekUrls(product);
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const swiping = useRef(false);
  const pricedOptions = hasPricedOptions(product);
  const multi = product.variants.length > 1;
  const off = !pricedOptions
    ? discountPercent(product.price, product.compareAtPrice)
    : null;

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

  function onQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    if (pricedOptions || multi) {
      router.push(`/product/${product.slug}`);
      return;
    }
    add(product, defaultVariant(product), 1);
  }

  const pad = compact ? "p-2" : "p-2.5 sm:p-3";
  const imageSizes = compact
    ? "(max-width: 640px) 30vw, 11rem"
    : "(max-width: 640px) 46vw, 14rem";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gp-border bg-gp-surface shadow-card transition-shadow hover:shadow-card-hover">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f2]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => {
          if (photos.length > 1) setIndex(1 % photos.length);
        }}
        onMouseLeave={() => setIndex(0)}
      >
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SafeImage
                src={photos[index] ?? null}
                alt={product.name}
                fill
                priority={priority}
                quality={85}
                sizes={imageSizes}
                className={`object-contain p-2 ${soldOut ? "opacity-50 grayscale" : ""}`}
              />
            </motion.div>
          </AnimatePresence>
        </Link>

        {off ? (
          <span className="pointer-events-none absolute left-2 top-2 z-[2] rounded-pill bg-brand px-2 py-0.5 text-[10px] font-bold text-ink-950">
            Save {off}%
          </span>
        ) : product.hotDeal ? (
          <span className="pointer-events-none absolute left-2 top-2 z-[2] rounded-pill bg-brand px-2 py-0.5 text-[10px] font-bold text-ink-950">
            Deal
          </span>
        ) : null}

        {!soldOut ? (
          <button
            type="button"
            onClick={onQuickAdd}
            aria-label={
              pricedOptions || multi
                ? `View options for ${product.name}`
                : `Add ${product.name} to cart`
            }
            className="absolute bottom-2 right-2 z-[2] grid h-9 w-9 place-items-center rounded-full border border-gp-border bg-gp-surface/95 text-gp-text shadow-card transition-all hover:border-accent hover:bg-accent hover:text-white"
          >
            <Icon name={pricedOptions || multi ? "chevron-right" : "cart"} className="h-4 w-4" />
          </button>
        ) : (
          <span className="absolute bottom-2 right-2 z-[2] rounded-pill bg-gp-bg px-2 py-0.5 text-[10px] font-semibold uppercase text-gp-text-subtle">
            Sold out
          </span>
        )}
      </div>

      <Link
        href={`/product/${product.slug}`}
        className={`flex flex-1 flex-col ${pad}`}
      >
        <h3
          className={`line-clamp-2 font-semibold leading-snug text-gp-text transition-colors group-hover:text-accent ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {product.name}
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 pt-1.5">
          <span
            className={`font-bold tabular-nums text-gp-text ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {pricedOptions
              ? `From ${formatPrice(fromPrice(product))}`
              : formatPrice(product.price)}
          </span>
          {product.compareAtPrice &&
          product.compareAtPrice > product.price &&
          !pricedOptions ? (
            <span className="text-[11px] tabular-nums text-gp-text-subtle line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
