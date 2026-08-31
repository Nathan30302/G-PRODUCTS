import Link from "next/link";
import { homeFaqs } from "@/lib/home-faqs";

/** Homepage FAQ accordion — short answers, expandable. */
export function HomeFAQ() {
  return (
    <section className="container-g mt-14 sm:mt-16">
      <div className="gp-card shadow-float">
        <div className="max-w-xl">
          <p className="eyebrow">Questions</p>
          <h2 className="display heading-section mt-1.5">Before you checkout</h2>
          <p className="mt-2 text-sm text-gp-text-muted">
            Quick answers about payment, delivery and ordering.{" "}
            <Link href="/faq" className="font-semibold text-ink-700 hover:underline">
              See all FAQs
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {homeFaqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-gp-border/80 bg-gp-muted px-5 py-4 open:border-ink-700/20 open:bg-white open:shadow-card"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-gp-text marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-gp-text-subtle transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-2 pb-1 text-sm leading-relaxed text-gp-text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
