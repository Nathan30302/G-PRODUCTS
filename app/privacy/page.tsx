import type { Metadata } from "next";
import { PolicyLayout } from "@/components/PolicyLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.legalName} collects and uses personal information.`
};

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" eyebrow="Company">
      <p>
        {siteConfig.legalName} (&quot;we&quot;) respects your privacy. This
        notice explains what we collect when you shop, create an account, or use
        our services (including Upload &amp; Print).
      </p>

      <h2 className="display !mt-8 text-xl">Information we collect</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Contact details you provide (name, phone, email, delivery address).</li>
        <li>Order and payment confirmation details needed to fulfil your purchase.</li>
        <li>Files you upload for printing — used only to complete your job.</li>
        <li>Account login details if you register as a customer.</li>
      </ul>

      <h2 className="display !mt-8 text-xl">How we use it</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>To process orders, print jobs, key cutting and related services.</li>
        <li>To contact you about stock, delivery and support on WhatsApp or phone.</li>
        <li>To improve our storefront and prevent fraud or abuse.</li>
      </ul>

      <h2 className="display !mt-8 text-xl">Sharing</h2>
      <p>
        We do not sell your personal information. We may share limited details
        with payment providers or delivery partners solely to complete your
        order.
      </p>

      <h2 className="display !mt-8 text-xl">Contact</h2>
      <p>
        Questions about privacy:{" "}
        <a
          className="font-semibold text-ink-700 hover:underline"
          href={`mailto:${siteConfig.supportEmail}`}
        >
          {siteConfig.supportEmail}
        </a>{" "}
        or WhatsApp on {siteConfig.phoneDisplay}.
      </p>
    </PolicyLayout>
  );
}
