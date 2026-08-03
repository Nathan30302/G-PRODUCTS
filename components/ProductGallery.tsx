"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  name,
  badge
}: {
  images: ProductImage[];
  name: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [{ url: "", alt: name }];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/55 shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {current.url && (
              <Image
                src={current.url}
                alt={current.alt ?? name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>
        {badge && (
          <span className="absolute left-4 top-4 rounded-pill bg-accent px-3 py-1 text-sm font-bold text-ink-950 shadow-accent-glow">
            {badge}
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition-all ${
                i === active
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              {img.url && (
                <Image
                  src={img.url}
                  alt={img.alt ?? `${name} ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
