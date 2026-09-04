import type { Metadata } from "next";
import { PolicyLayout } from "@/components/PolicyLayout";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Delivery & Pickup",
  description:
    "Free campus delivery where applicable, pickup at UNZA, Kalingalinga and Balastone, plus Lusaka and nationwide options."
};

export default function DeliveryPage() {
  return (
    <PolicyLayout title="Delivery & Pickup" eyebrow="Help">
      <p>{siteConfig.deliveryNote}</p>

      <h2 className="display !mt-8 text-xl">Free campus delivery</h2>
      <p>
        Where campus / school delivery applies, we aim to deliver quickly at no
        extra charge within the agreed area. Ask on WhatsApp if you are unsure
        whether your location qualifies.
      </p>

      <h2 className="display !mt-8 text-xl">Pickup</h2>
      <p>Collect from any of our shop locations:</p>
      <ul className="list-disc space-y-1 pl-5">
        {siteConfig.locations.map((l) => (
          <li key={l.id}>
            <strong className="font-semibold text-gp-text">{l.name}</strong> — {l.address}
          </li>
        ))}
      </ul>

      <h2 className="display !mt-8 text-xl">Lusaka &amp; nationwide</h2>
      <p>
        For addresses outside free campus zones, we can arrange Yango / courier
        delivery within Lusaka and discuss nationwide options. Delivery fees,
        if any, are confirmed before dispatch.
      </p>

      <h2 className="display !mt-8 text-xl">Typical timing</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>In-stock shop items: same day or next opportunity within hours.</li>
        <li>Printing jobs: after payment confirmation and queue time.</li>
        <li>Key cutting: usually while you wait or same-day pickup.</li>
      </ul>
      <p className="text-gp-text-subtle">
        Exact times depend on stock, payment confirmation and location. We keep
        you updated on WhatsApp.
      </p>
    </PolicyLayout>
  );
}
