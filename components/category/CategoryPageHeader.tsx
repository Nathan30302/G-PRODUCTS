"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";

export function CategoryPageHeader({
  title,
  backHref = "/search",
  onFilterClick
}: {
  title: string;
  backHref?: string;
  onFilterClick?: () => void;
}) {
  const router = useRouter();

  return (
    <header
      className="sticky top-0 z-50 border-b border-gp-border/80 bg-white/95 backdrop-blur-xl"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="grid h-14 grid-cols-[3rem_1fr_5.5rem] items-center gap-2 px-2 sm:px-0">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Go back"
            className="grid h-10 w-10 place-items-center rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
          >
            <Icon name="chevron-left" className="h-6 w-6" />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="grid h-10 w-10 place-items-center rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
          >
            <Icon name="chevron-left" className="h-6 w-6" />
          </button>
        )}

        <h1 className="truncate text-center text-base font-bold text-gp-text">
          {title}
        </h1>

        <div className="flex items-center justify-end gap-0.5">
          <Link
            href="/search/find"
            aria-label="Search products"
            className="grid h-10 w-10 place-items-center rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>
          <button
            type="button"
            aria-label="Filter products"
            onClick={onFilterClick}
            className="grid h-10 w-10 place-items-center rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
          >
            <Icon name="sliders" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
