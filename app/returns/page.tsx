import type { Metadata } from "next";
import { PolicyLayout } from "@/components/PolicyLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: `Returns and refunds policy for ${siteConfig.name}.`
};

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Returns & Refunds" eyebrow="Help">
      <p>
        We want you to be satisfied with every purchase. If something is wrong
        with an order, contact us promptly on WhatsApp or at the shop where you
        collected.
      </p>

      <h2 className="display !mt-8 text-xl text-white">Eligible returns</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Faulty or damaged items reported on receipt or within a reasonable window.</li>
        <li>Wrong item supplied versus what you ordered.</li>
        <li>Unopened items may be considered case-by-case for exchange.</li>
      </ul>

      <h2 className="display !mt-8 text-xl text-white">Not usually returnable</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Opened consumables (e.g. stationery used, hygiene-sensitive items).</li>
        <li>Custom or made-to-order work (including completed print jobs).</li>
        <li>Items damaged after delivery due to misuse.</li>
      </ul>

      <h2 className="display !mt-8 text-xl text-white">Refunds</h2>
      <p>
        Approved refunds are typically returned via the same Mobile Money method
        used for payment, or as store credit / exchange when agreed. Processing
        time depends on the payment provider.
      </p>
      <p>
        Message us on WhatsApp with your order reference, photos if relevant,
        and we will guide you through the next step.
      </p>
    </PolicyLayout>
  );
}
