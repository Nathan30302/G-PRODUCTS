import type { Metadata } from "next";
import { PolicyLayout } from "@/components/PolicyLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "G-Loans Terms",
  description: `Terms for G-Loans collateral loans offered by ${siteConfig.legalName}.`
};

export default function GLoansTermsPage() {
  return (
    <PolicyLayout title="G-Loans Terms" eyebrow="Company">
      <p>
        G-Loans is a collateral-based short loan service offered by{" "}
        {siteConfig.legalName}. Submitting a request does not guarantee approval.
      </p>

      <h2 className="display !mt-8 text-xl text-white">How it works</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>You submit a request with required details and collateral information.</li>
        <li>Our team reviews the request and may contact you on WhatsApp.</li>
        <li>If approved, terms (amount, duration, fees) are confirmed with you before release.</li>
      </ol>

      <h2 className="display !mt-8 text-xl text-white">Your responsibilities</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Provide accurate identity and contact information.</li>
        <li>Only offer collateral you are entitled to pledge.</li>
        <li>Repay according to the agreed schedule.</li>
      </ul>

      <h2 className="display !mt-8 text-xl text-white">Important</h2>
      <p>
        Failure to repay may result in enforcement against the agreed
        collateral, as explained at approval. Ask our team to clarify any fee or
        timeline before you accept a loan offer.
      </p>
    </PolicyLayout>
  );
}
