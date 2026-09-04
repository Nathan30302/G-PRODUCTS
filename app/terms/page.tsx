import type { Metadata } from "next";
import { PolicyLayout } from "@/components/PolicyLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for the ${siteConfig.name} online store.`
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Use" eyebrow="Company">
      <p>
        By using {siteConfig.name} online or in store, you agree to these terms.
        Prices are in Zambian Kwacha (ZMW) unless stated otherwise.
      </p>

      <h2 className="display !mt-8 text-xl">Orders &amp; stock</h2>
      <p>
        Product availability and pricing may change. We may cancel or adjust an
        order if an item is unavailable, mispriced, or payment is not confirmed.
        We will contact you to resolve the issue.
      </p>

      <h2 className="display !mt-8 text-xl">Payments</h2>
      <p>
        We accept Mobile Money (MTN, Airtel, Zamtel) and other methods shown at
        checkout. Orders and print jobs are processed after payment confirmation
        where payment is required.
      </p>

      <h2 className="display !mt-8 text-xl">Services</h2>
      <p>
        Printing, key cutting and G-Loans are subject to their own operational
        rules. See{" "}
        <a href="/terms/g-loans" className="font-semibold text-ink-700 hover:underline">
          G-Loans Terms
        </a>{" "}
        for loan-specific conditions.
      </p>

      <h2 className="display !mt-8 text-xl">Conduct</h2>
      <p>
        Do not upload unlawful content for printing or misuse our systems. We
        may refuse service that appears illegal, harmful or abusive.
      </p>
    </PolicyLayout>
  );
}
