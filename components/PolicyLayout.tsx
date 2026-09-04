import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icons";

export function PolicyLayout({
  title,
  eyebrow = "Policies",
  children
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-g py-10 sm:py-14">
      <nav className="flex items-center gap-1.5 text-sm text-gp-text-subtle">
        <Link href="/" className="transition-colors hover:text-gp-text">
          Home
        </Link>
        <Icon name="chevron-right" className="h-3.5 w-3.5" />
        <span className="text-gp-text-muted">{title}</span>
      </nav>
      <p className="eyebrow mt-6">{eyebrow}</p>
      <h1 className="display heading-page mt-2">{title}</h1>
      <div className="prose-g mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-gp-text-muted sm:text-[15px]">
        {children}
      </div>
    </div>
  );
}
