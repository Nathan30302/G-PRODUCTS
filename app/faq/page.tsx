import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/lib/faqs";
import { siteConfig, whatsappHref } from "@/config/site";

export const metadata: Metadata = {
  title: "FAQs",
  description: `Frequently asked questions about ordering, delivery, printing and services at ${siteConfig.name}.`
};

export default function FaqPage() {
  return (
    <div className="container-g py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="eyebrow">Help</p>
        <h1 className="display heading-page mt-2">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-sm text-gp-text-muted sm:text-base">
          Quick answers. Still stuck?{" "}
          <a
            href={whatsappHref("Hi G-Products, I have a question.")}
            className="font-semibold text-accent hover:underline"
          >
            WhatsApp us
          </a>{" "}
          or see{" "}
          <Link href="/delivery" className="font-semibold text-accent hover:underline">
            Delivery &amp; Pickup
          </Link>
          .
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {faqs.map((group) => (
          <section key={group.category}>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-gp-text-subtle">
              {group.category}
            </h2>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-gp-border bg-gp-surface px-4 py-3 open:border-accent/30"
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
          </section>
        ))}
      </div>
    </div>
  );
}
