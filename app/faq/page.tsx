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
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
          Help
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-sm text-white/55 sm:text-base">
          Quick answers. Still stuck?{" "}
          <a
            href={whatsappHref("Hi G-Products, I have a question.")}
            className="font-semibold text-brand hover:underline"
          >
            WhatsApp us
          </a>{" "}
          or see{" "}
          <Link href="/delivery" className="font-semibold text-brand hover:underline">
            Delivery &amp; Pickup
          </Link>
          .
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {faqs.map((group) => (
          <section key={group.category}>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
              {group.category}
            </h2>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/[0.08] bg-ink-900/60 px-4 py-3 open:border-brand/30"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {item.q}
                      <span className="text-white/35 transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-2 pb-1 text-sm leading-relaxed text-white/55">
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
