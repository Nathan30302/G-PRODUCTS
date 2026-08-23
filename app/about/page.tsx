import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icons";
import { getPublishedTeamMembers } from "@/lib/shop-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${siteConfig.legalName} — genuine products, fair prices, excellent customer service and fast service across Lusaka.`
};

export default async function AboutPage() {
  const team = await getPublishedTeamMembers().catch(() => []);

  return (
    <div className="container-g py-10 sm:py-14">
      <p className="eyebrow">Company</p>
      <h1 className="display mt-2 text-3xl sm:text-5xl">About G-Products</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
        {siteConfig.legalName} is your trusted store for electronics,
        stationery, printing, accessories and essential services — built around
        one promise: {siteConfig.tagline}
      </p>

      <section className="mt-12 max-w-2xl">
        <h2 className="display text-2xl">Our mission</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-[15px]">
          To make everyday products and services easy to find, fair to buy, and
          reliable to collect — whether you shop online, message us on WhatsApp,
          or walk into one of our Lusaka locations.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="display text-2xl">Our values</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {siteConfig.values.map((v) => (
            <article
              key={v.title}
              className="rounded-[1.25rem] border border-white/[0.07] bg-ink-900/50 p-5"
            >
              <h3 className="text-base font-bold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {v.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {team.length > 0 ? (
        <section className="mt-12">
          <h2 className="display text-2xl">Our team</h2>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            The people behind the counter and on WhatsApp.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <article
                key={m.id}
                className="overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-ink-900/50"
              >
                {m.photoUrl ? (
                  <div className="aspect-[4/3] bg-ink-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.photoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <h3 className="text-base font-bold text-white">{m.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{m.title}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 max-w-2xl">
        <h2 className="display text-2xl">Where to find us</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          We operate physical locations at UNZA, Kalingalinga and Balastone, with
          free campus delivery where applicable and Mobile Money payments (MTN,
          Airtel, Zamtel).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/#locations" className="btn-brand px-5 py-2.5 text-sm">
            Our locations
            <Icon name="map-pin" className="h-4 w-4" />
          </Link>
          <Link
            href="/services/printing"
            className="rounded-pill border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 hover:border-brand/40 hover:text-brand"
          >
            Upload &amp; Print
          </Link>
        </div>
      </section>
    </div>
  );
}
