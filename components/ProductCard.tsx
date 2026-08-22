"use client";

import { useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Product, fromPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { coverImageForProduct } from "@/lib/product-images";

function StockPill({ status }: { status: Product["stock"] }) {
  if (status === "sold_out") {
    return (
      <span className="shrink-0 text-[10px] font-medium text-white/35">
        Out of stock
      </span>
    );
  }
  if (status === "low_stock") {
    return (
      <span className="shrink-0 text-[10px] font-medium text-brand">
        Low stock
      </span>
    );
  }
  return (
    <span className="shrink-0 text-[10px] font-medium text-accent/90">
      In stock
    </span>
  );
}

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
  priority = false
}: {
  product: Product;
  priority?: boolean;
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

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/70 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-brand-glow active:scale-[0.97]">
      <div
        className="relative aspect-square overflow-hidden bg-[#f4f4f2]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => {
          if (photos.length > 1) setIndex(1 % photos.length);
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
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <SafeImage
                src={photos[index] ?? null}
                alt={product.name}
                fill
                priority={priority}
                quality={88}
                sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 16rem"
                className={`object-contain p-2.5 ${
                  soldOut ? "opacity-50 saturate-[0.65]" : ""
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </Link>
        {photos.length > 1 && (
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
        )}
      </div>

      <Link
        href={`/product/${product.slug}`}
        className="flex flex-1 flex-col gap-1 px-2.5 pb-2.5 pt-2"
      >
        <h3 className="line-clamp-2 text-[12px] font-semibold leading-snug text-white transition-colors group-hover:text-brand sm:text-[13px]">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-0.5">
          <span className="text-[13px] font-bold tabular-nums text-white sm:text-sm">
            {hasPricedOptions(product)
              ? `From ${formatPrice(fromPrice(product))}`
              : formatPrice(product.price)}
          </span>
          <StockPill status={product.stock} />
        </div>
      </Link>
    </article>
  );
}
