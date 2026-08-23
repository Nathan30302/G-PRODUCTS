import type { Metadata } from "next";
import { PolicyLayout } from "@/components/PolicyLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Warranty",
  description: `Warranty information for products sold by ${siteConfig.name}.`
};

export default function WarrantyPage() {
  return (
    <PolicyLayout title="Warranty" eyebrow="Help">
      <p>
        Warranty cover depends on the product and brand. Where a manufacturer
        warranty applies, we will help you with the claim process using your
        proof of purchase from G-Products.
      </p>

      <h2 className="display !mt-8 text-xl text-white">What to do</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Keep your receipt or order reference.</li>
        <li>Contact us on WhatsApp or visit a shop location.</li>
        <li>Share clear photos/video of the issue when asked.</li>
      </ol>

      <h2 className="display !mt-8 text-xl text-white">Important notes</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Physical damage, water damage or misuse is typically not covered.</li>
        <li>Accessories and consumables may have limited or no warranty.</li>
        <li>
          Exact terms vary by brand — ask before purchase if warranty is
          important for your item.
        </li>
      </ul>
    </PolicyLayout>
  );
}
