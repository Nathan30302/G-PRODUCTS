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
  description: "The private desk for running G-Products.",
  robots: { index: false, follow: false }
};

const work = [
  {
    icon: "grid" as const,
    title: "Catalogue",
    body: "Photograph the product, set the price, and put it on the shop the same day."
  },
  {
    icon: "wallet" as const,
    title: "Get cash",
    body: "A customer pays your number. You confirm it on the order, then you prepare it."
  },
  {
    icon: "printer" as const,
    title: "Printing",
    body: "Their file lands here. Download it, print it, and the copy clears itself later."
  },
  {
    icon: "shield" as const,
    title: "G-Loans",
    body: "Read the NRC, book the visit, approve, and they collect the cash in person."
  }
];

const board = [
  { label: "New orders", value: "Confirm cash", hint: "Then prepare" },
  { label: "Print queue", value: "Download", hint: "Files stay 12 hours" },
  { label: "Loans", value: "Book a visit", hint: "They collect cash" }
];

export default async function ProviderLandingPage() {
  const session = await getSession().catch(() => null);
  if (session) redirect(siteConfig.apps.provider.home);

  return (
    <div className="desk-home">
      <div className="desk-home-bg" aria-hidden>
        <span className="desk-home-glow desk-home-glow--a" />
        <span className="desk-home-glow desk-home-glow--b" />
      </div>

      <header className="desk-home-nav">
        <Logo size="md" priority />
        <Link href={siteConfig.apps.provider.login} className="desk-home-nav-btn">
          Sign in
        </Link>
      </header>

      <main className="desk-home-main">
        <section className="desk-home-hero">
          <div>
            <p className="desk-home-kicker">G-Products · Provider desk</p>
            <h1 className="display desk-home-title">
              Run the shop from one private desk.
            </h1>
            <p className="desk-home-lead">
              Products, payments, printing, and loans. Gift adds the team.
              Everyone else signs in here — the customer shop is a different door.
            </p>
            <div className="desk-home-actions">
              <Link href={siteConfig.apps.provider.login} className="desk-home-cta">
                Sign in
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <p className="desk-home-note">
                New teammate? The owner creates your login, then you sign in.
              </p>
            </div>
          </div>

          <aside className="desk-home-board" aria-label="What the desk holds">
            <p className="desk-home-board-label">Today on the desk</p>
            <ul>
              {board.map((row) => (
                <li key={row.label}>
                  <span>
                    <strong>{row.label}</strong>
                    <em>{row.hint}</em>
                  </span>
                  <b>{row.value}</b>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="desk-home-work" aria-label="What you can do">
          {work.map((item) => (
            <article key={item.title}>
              <span aria-hidden>
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </section>

        <section className="desk-home-close">
          <div>
            <h2 className="display">Ready when you are.</h2>
            <p>Sign in to open orders, stock, printing, and the team.</p>
          </div>
          <Link href={siteConfig.apps.provider.login} className="desk-home-cta">
            Sign in to the desk
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
