"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

export type ShopAuth = {
  kind: "customer";
  name: string;
  home: string;
} | null;

export function SiteChrome({
  children,
  auth
}: {
  children: ReactNode;
  auth: ShopAuth;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-ink-950 text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-[max(1rem,var(--safe-top))] focus:z-[100] focus:rounded-pill focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink-950"
      >
        Skip to content
      </a>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,212,0,0.07),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,201,138,0.055),_transparent_45%)]" />
      </div>
      <Navbar auth={auth} />
      <main
        id="main-content"
        className="min-h-[70vh] pb-[calc(var(--mobile-nav-offset)+0.75rem)] md:pb-0"
      >
        {children}
      </main>
      <Footer />
      <MobileNav auth={auth} />
    </div>
  );
}
