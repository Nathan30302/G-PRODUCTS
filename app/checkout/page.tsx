import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getCustomerSession();
  let prefill: { name: string; phone: string; address: string } | null = null;

  if (session) {
    const record = await prisma.customer.findUnique({
      where: { id: session.id },
      select: {
        name: true,
        phone: true,
        defaultLocation: true
      }
    });
    if (record) {
      prefill = {
        name: record.name,
        phone: record.phone,
        address: record.defaultLocation ?? ""
      };
    }
  }

  return <CheckoutClient prefill={prefill} />;
}
