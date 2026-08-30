"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icons";

export function ProductRail({
  title,
  subtitle,
  products,
  href,
  hrefLabel = "View all",
  accent = "brand",
  className = "",
  embedded = false,
  eyebrow
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
  hrefLabel?: string;
  accent?: "brand" | "accent";
  className?: string;
  embedded?: boolean;
  eyebrow?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, products.length]);

  const wrap = embedded ? "w-full" : "container-g";

  if (products.length === 0) {
    return (
      <section className={`${wrap} mt-10 sm:mt-12 ${className}`}>
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="display mt-1 text-lg font-extrabold text-white sm:text-xl">
          {title}
        </h2>
        <p className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-8 text-center text-sm text-white/45">
          New products coming soon — browse the full shop in the meantime.
        </p>
      </section>
    );
  }

  return (
    <section className={`${wrap} mt-10 sm:mt-12 ${className}`}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                accent === "accent" ? "text-accent/90" : "text-white/40"
              }`}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2 className="display mt-1 text-lg font-extrabold leading-tight text-white sm:text-xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1.5 hidden max-w-lg text-sm text-white/45 sm:block">
              {subtitle}
            </p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-soft sm:inline-flex"
          >
            {hrefLabel}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="relative mt-4">
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-ink-950 to-transparent transition-opacity ${
            atStart ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-ink-950 to-transparent transition-opacity ${
            atEnd ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          ref={scroller}
          className="no-scrollbar snap-rail -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-3 sm:px-6"
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className="snap-item w-[9.25rem] shrink-0 sm:w-[10.5rem]"
            >
              <ProductCard product={p} priority={i < 3} compact />
            </div>
          ))}
        </div>
      </div>

      {href ? (
        <div className="mt-4 sm:hidden">
          <Link
            href={href}
            className="flex min-h-10 items-center justify-center gap-1 text-sm font-semibold text-brand"
          >
            {hrefLabel}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
