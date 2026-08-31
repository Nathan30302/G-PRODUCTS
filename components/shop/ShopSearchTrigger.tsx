import Link from "next/link";
import { Icon } from "@/components/Icons";

/** Tappable search field — opens the dedicated search screen. */
export function ShopSearchTrigger({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/search/find"
      className={`flex min-h-[3.25rem] items-center gap-3 rounded-2xl px-1 py-2 transition-colors hover:bg-gp-muted/60 active:bg-gp-muted ${className}`}
      aria-label="Open search"
    >
      <Icon name="search" className="h-5 w-5 shrink-0 text-gp-text-subtle" />
      <span className="text-base text-gp-text-subtle">What are you looking for?</span>
    </Link>
  );
}
