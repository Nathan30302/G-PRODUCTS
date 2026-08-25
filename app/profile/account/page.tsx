import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { AccountHome } from "@/components/profile/ProfileViews";
import { phoneVariants } from "@/lib/phone";
import { ensureReferralCode } from "@/lib/rewards";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Account",
  description: "Your G-Products account."
};

export default async function AccountPage() {
  const customer = await getCustomerSession();
  if (!customer) redirect("/profile");

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let services: Awaited<ReturnType<typeof prisma.serviceRequest.findMany>> = [];

  if (customer.phone) {
    const phones = phoneVariants(customer.phone);
    [orders, services] = await Promise.all([
      prisma.order.findMany({
        where: {
          OR: [
            { customerId: customer.id },
            { customerId: null, customerPhone: { in: phones } }
          ]
        },
        orderBy: { createdAt: "desc" },
        take: 12
      }),
      prisma.serviceRequest.findMany({
        where: { customerPhone: { in: phones } },
        orderBy: { createdAt: "desc" },
        take: 12
      })
    ]);
  }

  const referralCode = await ensureReferralCode(customer.id).catch(() => "");

  const record = await prisma.customer.findUnique({
    where: { id: customer.id },
    select: {
      defaultLocation: true,
      locationLabel: true,
      rewardPoints: true,
      referralCode: true
    }
  });

  const code = record?.referralCode ?? referralCode;
  const referralLink = code
    ? `${siteUrl()}/profile?mode=signup&ref=${encodeURIComponent(code)}`
    : "";

  return (
    <AccountHome
      customer={customer}
      orders={orders}
      services={services}
      defaultLocation={record?.defaultLocation ?? ""}
      locationLabel={record?.locationLabel ?? ""}
      rewardPoints={record?.rewardPoints ?? 0}
      referralCode={code}
      referralLink={referralLink}
    />
  );
}
