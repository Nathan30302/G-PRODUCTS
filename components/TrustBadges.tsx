import { siteConfig } from "@/config/site";

export function TrustBadges() {
  return (
    <section className="container-g mt-14">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {siteConfig.trust.map((t) => (
          <div
            key={t.title}
            className="rounded-card border border-ink-800 bg-ink-850 p-5"
          >
            <p className="text-sm font-bold text-white">{t.title}</p>
            <p className="mt-1 text-xs text-white/50">{t.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
