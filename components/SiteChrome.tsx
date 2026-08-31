"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
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
  auth: initialAuth = null
}: {
  children: ReactNode;
  auth?: ShopAuth;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [auth, setAuth] = useState<ShopAuth>(initialAuth);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && (data === null || data?.kind === "customer")) {
          setAuth(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (isAdmin) return <>{children}</>;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-gp-bg text-gp-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-[max(1rem,var(--safe-top))] focus:z-[100] focus:rounded-pill focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <Suspense fallback={null}>
        <Navbar auth={auth} />
      </Suspense>
      <main
        id="main-content"
        className="min-h-[70vh] pb-[calc(var(--mobile-nav-offset)+0.75rem)] md:pb-0"
      >
        {children}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <MobileNav auth={auth} />
    </div>
  );
}
