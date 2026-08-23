import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { siteConfig, type ContactNumber } from "@/config/site";

function ContactActions({
  contact,
  compact
}: {
  contact: ContactNumber;
  compact?: boolean;
}) {
  const btn =
    compact
      ? "inline-flex flex-1 items-center justify-center gap-1.5 rounded-pill border px-3 py-2 text-xs font-semibold transition-colors"
      : "inline-flex items-center justify-center gap-1.5 rounded-pill border px-3.5 py-2 text-xs font-semibold transition-colors";

  return (
    <div className={`flex gap-2 ${compact ? "w-full" : "flex-wrap"}`}>
      <a
        href={`tel:${contact.tel}`}
        className={`${btn} border-white/15 bg-white/[0.03] text-white/80 hover:border-brand/40 hover:text-brand`}
      >
        <Icon name="phone" className="h-3.5 w-3.5" />
        Call
      </a>
      <a
        href={`https://wa.me/${contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} border-accent/30 bg-accent/10 text-accent hover:bg-accent hover:text-ink-950`}
      >
        <Icon name="whatsapp" className="h-3.5 w-3.5" />
        WhatsApp
      </a>
    </div>
  );
}

export function LocationsBand() {
  const defaultContact = siteConfig.contacts[0];

  return (
    <section id="locations" className="container-g mt-20 mb-8 scroll-mt-24 sm:mt-24">
      <Reveal>
        <div className="mb-8 text-center sm:text-left">
          <p className="eyebrow">Visit us</p>
          <h2 className="display mt-2 text-2xl sm:text-3xl">Our locations</h2>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Four pickup points across Lusaka — call or WhatsApp before you
            visit if you need live stock or directions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {siteConfig.locations.map((loc) => {
            const contact = loc.phone ?? defaultContact;
            return (
              <article
                key={loc.id}
                className="flex flex-col rounded-[1.35rem] border border-white/[0.07] bg-ink-900/55 p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                    <Icon name="map-pin" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white">{loc.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">
                      {loc.address}
                    </p>
                    {loc.landmark ? (
                      <p className="mt-1 text-xs text-white/35">
                        Landmark: {loc.landmark}
                      </p>
                    ) : null}
                  </div>
                </div>

                <p className="mt-4 flex items-start gap-2 text-xs text-white/45">
                  <Icon name="clock" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <span>{loc.hours}</span>
                </p>

                <p className="mt-3 text-sm font-semibold tabular-nums text-white/80">
                  {contact.display}
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <ContactActions contact={contact} compact />
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-pill border border-white/15 bg-transparent px-3.5 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-brand/40 hover:text-brand sm:shrink-0"
                  >
                    <Icon name="external" className="h-3.5 w-3.5" />
                    Get directions
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-[1.35rem] border border-white/[0.07] bg-[#0a2429]/80 px-5 py-6 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Contact numbers
          </p>
          <p className="mt-2 text-sm text-white/50">
            Separate Call and WhatsApp for each line — pick the number that
            works for you.
          </p>
          <ul className="mt-5 space-y-4">
            {siteConfig.contacts.map((c) => (
              <li
                key={c.tel}
                className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 first:border-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs text-white/40">{c.label}</p>
                  <p className="mt-0.5 text-base font-semibold tabular-nums text-white">
                    {c.display}
                  </p>
                </div>
                <ContactActions contact={c} />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
