"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { LaunchSplash } from "@/components/LaunchSplash";

export type ShopAuth = {
  kind: "provider" | "customer";
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
  // Auth forms need taps immediately — don't cover them with the launch splash.
  const skipSplash =
    pathname === "/profile" ||
    pathname?.startsWith("/profile/customer");

  if (isAdmin) return <>{children}</>;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-white">
      {skipSplash ? null : <LaunchSplash variant="shop" />}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,212,0,0.06),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,201,138,0.05),_transparent_45%)]" />
      </div>
      <Navbar auth={auth} />
      <main className="min-h-[70vh] pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav auth={auth} />
    </div>
  );
}
