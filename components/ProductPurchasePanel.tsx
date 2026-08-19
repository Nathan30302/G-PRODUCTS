"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product, ProductImage, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { swatchStyle } from "@/lib/swatch";
import { useProductVariant } from "@/components/ProductVariantContext";

const SWIPE_THRESHOLD = 36;

function ProductGalleryFrame({
  images,
  name,
  badge
}: {
  images: ProductImage[];
  name: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const dragging = useRef(false);

  const list = images.length > 0 ? images : [{ url: "", alt: name }];
  const count = list.length;
  const current = list[Math.min(active, count - 1)];

  useEffect(() => {
    setActive(0);
  }, [images]);

  function go(dir: -1 | 1) {
    setActive((i) => Math.max(0, Math.min(count - 1, i + dir)));
  }

  function onPointerDown(clientX: number) {
    pointerStart.current = clientX;
    dragging.current = true;
  }

  function onPointerUp(clientX: number) {
    if (!dragging.current || pointerStart.current === null) return;
    const delta = clientX - pointerStart.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }
    pointerStart.current = null;
    dragging.current = false;
  }

  return (
    <div className="w-full">
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/55"
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseUp={(e) => onPointerUp(e.clientX)}
        onMouseLeave={() => {
          pointerStart.current = null;
          dragging.current = false;
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${active}-${current.url}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={current.url || null}
              alt={current.alt ?? name}
              fill
              sizes="(max-width: 640px) 72vw, 320px"
              className="pointer-events-none object-contain p-3 select-none sm:p-4"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {badge && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-pill bg-accent px-2 py-0.5 text-[10px] font-bold text-ink-950">
            {badge}
          </span>
        )}
      </div>

      {count > 1 && (
        <div className="mt-2.5 space-y-2">
          <div className="flex justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-5 bg-brand" : "w-1.5 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {list.map((img, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border transition-all ${
                  i === active
                    ? "border-brand ring-1 ring-brand/40"
                    : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                <SafeImage
                  src={img.url || null}
                  alt={img.alt ?? `${name} ${i + 1}`}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CircularSwatches({
  variants,
  selectedId,
  onSelect
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (variants.length <= 1) return null;

  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2.5">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const out = !v.available;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              aria-label={v.name}
              aria-pressed={active}
              title={out ? `${v.name} — out of stock` : v.name}
              className={`relative rounded-full transition-transform active:scale-95 ${
                active
                  ? "ring-2 ring-brand ring-offset-2 ring-offset-ink-950"
                  : "ring-1 ring-white/20 hover:ring-white/40"
              } ${out ? "opacity-45" : ""}`}
            >
              <span
                className={`block h-8 w-8 rounded-full ${out ? "grayscale" : ""}`}
                style={swatchStyle(v.colorHex, v.name)}
              />
              {out && (
                <span className="pointer-events-none absolute inset-0 rounded-full bg-ink-950/40" />
              )}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="mt-2 text-xs text-white/50">
          {selected.name}
          {!selected.available ? " · Out of stock" : ""}
        </p>
      )}
    </div>
  );
}

export function ProductPurchasePanel({
  product,
  badge,
  compareOff,
  saved
}: {
  product: Product;
  badge?: string | null;
  compareOff?: number | null;
  saved?: number;
}) {
  const { galleryImages, selectedId, setSelectedId, selected } =
    useProductVariant();

  const inStock = selected
    ? selected.available
    : product.stock !== "sold_out";

  return (
    <div className="lg:sticky lg:top-24">
      <ProductGalleryFrame
        key={selectedId ?? "default"}
        images={galleryImages}
        name={product.name}
        badge={badge}
      />

      <CircularSwatches
        variants={product.variants}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-2xl font-extrabold tabular-nums tracking-tight text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-white/35 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={
              inStock
                ? product.stock === "low_stock"
                  ? "font-medium text-brand"
                  : "font-medium text-accent"
                : "font-medium text-white/40"
            }
          >
            {inStock
              ? product.stock === "low_stock"
                ? "Low stock"
                : "In stock"
              : "Out of stock"}
          </span>
          {compareOff && saved ? (
            <span className="rounded-pill bg-accent/10 px-2 py-0.5 font-semibold text-accent">
              Save {formatPrice(saved)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
