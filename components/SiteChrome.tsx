"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f8f9] text-ink-950">
      <Navbar />
      <main className="min-h-[70vh] pb-28 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
