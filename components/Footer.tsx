import Link from "next/link";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-800 bg-ink-900">
      <div className="container-g grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-brand/90 font-medium">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 text-sm text-white/60">{siteConfig.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Working Hours</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {siteConfig.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-3">
                <span>{h.days}</span>
                <span className="text-white/80">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/40">
            {siteConfig.branch} · Pay with MTN, Airtel & Zamtel
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Get in touch</h4>
          <p className="mt-4 text-sm text-white/60">
            Message us on WhatsApp for quick help with any product.
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {siteConfig.phoneDisplay}
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            className="mt-4 inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-ink-950 hover:brightness-110"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-ink-800 py-6">
        <p className="container-g text-xs text-white/40">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
