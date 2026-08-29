import { siteConfig } from "@/config/site";

/** Clear 3-step path so new visitors know exactly what to do. */
export function ShopSteps() {
  return (
    <section
      className="container-g mt-6 sm:mt-8"
      aria-label="How shopping works"
    >
      <ol className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {siteConfig.shopSteps.map((item) => (
          <li
            key={item.step}
            className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-ink-900/50 px-4 py-3.5 sm:flex-col sm:items-center sm:px-4 sm:py-5 sm:text-center"
          >
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand ring-1 ring-brand/25 sm:h-9 sm:w-9"
              aria-hidden
            >
              {item.step}
            </span>
            <div className="min-w-0 sm:mt-1">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/45 sm:mt-1">
                {item.hint}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
