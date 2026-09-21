import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";
import { getSession } from "@/lib/auth";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Provider desk",
  description:
    "G-Products provider desk — sign in to manage products, orders, and services.",
  robots: { index: false, follow: false }
};

export default async function DeskLandingPage() {
  const session = await getSession();
  if (session) redirect(siteConfig.apps.provider.home);

  return (
    <div className="desk-gate">
      <div className="desk-gate-bg" aria-hidden>
        <span className="desk-gate-orb desk-gate-orb--a" />
        <span className="desk-gate-orb desk-gate-orb--b" />
        <span className="desk-gate-grid" />
      </div>

      <div className="desk-gate-inner">
        <header className="desk-gate-brand">
          <Logo size="xl" priority />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gp-text-subtle">
            Provider desk
          </p>
        </header>

        <section className="desk-gate-hero">
          <h1 className="display text-[clamp(1.85rem,1.4rem+2vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight text-gp-text">
            Run the shop from here
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-gp-text-muted sm:text-[1.05rem]">
            Products, orders, and services — for G-Products owners and staff
            only. Separate from the customer shop.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={siteConfig.apps.provider.login} className="desk-gate-cta">
              Sign in to the desk
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <ul className="desk-gate-points" aria-label="What you can do">
          <li>
            <span className="desk-gate-point-dot" aria-hidden />
            Catalogue &amp; stock
          </li>
          <li>
            <span className="desk-gate-point-dot" aria-hidden />
            Orders &amp; fulfilment
          </li>
          <li>
            <span className="desk-gate-point-dot" aria-hidden />
            Services &amp; team
          </li>
        </ul>

        <p className="desk-gate-foot">
          Looking for the shop?{" "}
          <Link href="/" className="font-semibold text-ink-700 hover:text-ink-850">
            Go to G-Products
          </Link>
        </p>
      </div>
    </div>
  );
}
