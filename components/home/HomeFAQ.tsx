import Link from "next/link";
import { homeFaqs } from "@/lib/home-faqs";

/** Homepage FAQ accordion — short answers, expandable. */
export function HomeFAQ() {
  return (
    <section className="container-g mt-14 sm:mt-16">
      <div className="rounded-[1.35rem] border border-gp-border bg-gp-surface p-6 shadow-card sm:p-8">
        <div className="max-w-xl">
          <p className="eyebrow">Questions</p>
          <h2 className="display heading-section mt-1.5">Before you checkout</h2>
          <p className="mt-2 text-sm text-gp-text-muted">
            Quick answers about payment, delivery and ordering.{" "}
            <Link href="/faq" className="font-semibold text-accent hover:underline">
              See all FAQs
            </Link>
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {homeFaqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-gp-border bg-gp-bg/60 px-4 py-3 open:border-accent/30 open:bg-white"
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
