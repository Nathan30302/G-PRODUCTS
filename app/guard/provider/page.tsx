import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";
import { DeskPhotoBackdrop } from "@/components/guard/DeskPhotoBackdrop";
import { getSession } from "@/lib/auth";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Provider desk",
  description: "The private desk for running G-Products.",
  robots: { index: false, follow: false }
};

/** One real catalogue photo for each day, Sunday through Saturday. */
const deskPhotos = [
  "/products/catalog/jbl-headphones-1.jpg",
  "/products/catalog/calus-s69-speaker-1.jpg",
  "/products/catalog/airpods-pro-2-type-c-1.jpg",
  "/products/catalog/extension-6-way-5m-1.jpg",
  "/products/catalog/flash-disk-32gb-1.jpg",
  "/products/catalog/hard-drive-500gb-1.jpg",
  "/products/catalog/casio-scientific-calculator-1.jpg"
];

function lusakaWeekday() {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Lusaka",
    weekday: "short"
  }).format(new Date());
  const index = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
  return index < 0 ? 0 : index;
}

const lanes = [
  { label: "Orders", detail: "Confirm the cash, then prepare", width: "78%" },
  { label: "Printing", detail: "Download and print today", width: "54%" },
  { label: "G-Loans", detail: "Book the visit, then pay out", width: "36%" }
];

const steps = [
  {
    n: "01",
    icon: "grid" as const,
    title: "Catalogue",
    body: "A real photo, a clear price, and the product is on the shop."
  },
  {
    n: "02",
    icon: "wallet" as const,
    title: "Get cash",
    body: "They pay your number. You confirm it here before anything moves."
  },
  {
    n: "03",
    icon: "printer" as const,
    title: "Printing",
    body: "The file is waiting. Download it, print it, and it clears itself."
  },
  {
    n: "04",
    icon: "shield" as const,
    title: "G-Loans",
    body: "Read the NRC, meet them, approve, and they collect the cash."
  }
];

export default async function ProviderLandingPage() {
  const session = await getSession().catch(() => null);
  if (session) redirect(siteConfig.apps.provider.home);

  return (
    <div className="desk-home">
      <header className="desk-home-nav">
        <Logo variant="lockupNavy" size="md" priority />
        <Link href={siteConfig.apps.provider.login} className="desk-home-nav-btn">
          Sign in
        </Link>
      </header>

      <main className="desk-home-main">
        <section className="desk-stage">
          <DeskPhotoBackdrop photo={deskPhotos[lusakaWeekday()]} />

          <div className="desk-stage-copy">
            <p className="desk-stage-kicker">
              <span className="desk-stage-live" aria-hidden />
              Provider desk
            </p>
            <h1 className="display desk-stage-title">
              The shop,
              <br />
              held in one desk.
            </h1>
            <p className="desk-stage-lead">
              Orders, stock, printing, and loans. Gift adds the team. Sign in
              is the only way through this door.
            </p>
            <div className="desk-stage-actions">
              <Link href={siteConfig.apps.provider.login} className="desk-stage-cta">
                Sign in
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <p>New teammate? The owner creates your login first.</p>
            </div>
          </div>

          <aside className="desk-window" aria-label="A look at the desk">
            <div className="desk-window-bar">
              <span className="desk-window-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <strong>Today</strong>
              <em>Live</em>
            </div>
            <ul>
              {lanes.map((lane) => (
                <li key={lane.label}>
                  <div>
                    <strong>{lane.label}</strong>
                    <span>{lane.detail}</span>
                  </div>
                  <div className="desk-meter" aria-hidden>
                    <b style={{ ["--desk-fill" as string]: lane.width }} />
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="desk-steps" aria-label="What the desk is for">
          <p className="desk-steps-label">What you run from here</p>
          <ol>
            {steps.map((step) => (
              <li key={step.n}>
                <span className="desk-steps-n">{step.n}</span>
                <span className="desk-steps-icon" aria-hidden>
                  <Icon name={step.icon} className="h-5 w-5" />
                </span>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="desk-close">
          <div>
            <h2 className="display">Open the desk.</h2>
            <p>Orders, stock, printing, and the people you added.</p>
          </div>
          <Link href={siteConfig.apps.provider.login} className="desk-stage-cta">
            Sign in
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
