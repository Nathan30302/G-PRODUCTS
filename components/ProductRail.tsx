"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ShopSectionHeader } from "@/components/shop/ui";
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

  if (products.length === 0) {
    return (
      <section
        className={`${embedded ? "w-full" : "container-g"} mt-14 sm:mt-16 ${className}`}
      >
        <ShopSectionHeader
          eyebrow={eyebrow ?? (accent === "accent" ? "Deals" : "Shop")}
          title={title}
          subtitle={subtitle}
        />
        <p className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-8 text-center text-sm text-white/45">
          New products coming soon — browse the full shop in the meantime.
        </p>
      </section>
    );
  }

  const gridItems = products.slice(0, 8);

  return (
    <section
      className={`${embedded ? "w-full" : "container-g"} mt-14 sm:mt-16 lg:mt-20 ${className}`}
    >
      <ShopSectionHeader
        eyebrow={eyebrow ?? (accent === "accent" ? "Deals" : "Shop")}
        title={title}
        subtitle={subtitle}
        action={
          href ? (
            <Link
              href={href}
              className="hidden shrink-0 items-center gap-1 rounded-pill border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:border-brand/40 hover:text-brand sm:inline-flex"
            >
              {hrefLabel}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          ) : undefined
        }
      />

      <div className="relative mt-6 md:hidden">
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-ink-950 to-transparent transition-opacity ${
            atStart ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-ink-950 to-transparent transition-opacity ${
            atEnd ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          ref={scroller}
          className="no-scrollbar snap-rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6"
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className="snap-item w-[min(16.5rem,72vw)] shrink-0"
            >
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 hidden md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {gridItems.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>

      {href ? (
        <div className="mt-5 sm:hidden">
          <Link
            href={href}
            className="flex min-h-11 items-center justify-center gap-1 rounded-pill border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white/80"
          >
            {hrefLabel}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
