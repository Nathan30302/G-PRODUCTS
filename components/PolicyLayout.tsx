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
      <nav className="flex items-center gap-1.5 text-sm text-white/40">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <Icon name="chevron-right" className="h-3.5 w-3.5" />
        <span className="text-white/70">{title}</span>
      </nav>
      <p className="eyebrow mt-6">{eyebrow}</p>
      <h1 className="display mt-2 text-3xl sm:text-4xl">{title}</h1>
      <div className="prose-g mt-8 max-w-3xl space-y-5 text-sm leading-relaxed text-white/60 sm:text-[15px]">
        {children}
      </div>
    </div>
  );
}
