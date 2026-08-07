import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { CustomerAppHome } from "@/components/profile/ProfileViews";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Customer app",
  description: "Your G-Products customer account."
};

function phoneVariants(phone: string): string[] {
  const digits = phone.replace(/\D/g, "");
  const variants = new Set<string>([phone, digits]);
  if (digits.startsWith("260") && digits.length >= 12) {
    variants.add(`0${digits.slice(3)}`);
    variants.add(`+${digits}`);
  } else if (digits.startsWith("0") && digits.length >= 10) {
    variants.add(`260${digits.slice(1)}`);
    variants.add(`+260${digits.slice(1)}`);
  }
  return [...variants];
}

export default async function CustomerAppPage() {
  const customer = await getCustomerSession();
  if (!customer) redirect(siteConfig.apps.customer.login);

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let services: Awaited<ReturnType<typeof prisma.serviceRequest.findMany>> = [];

  if (customer.phone) {
    const phones = phoneVariants(customer.phone);
    [orders, services] = await Promise.all([
      prisma.order.findMany({
        where: { customerPhone: { in: phones } },
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

  return (
    <CustomerAppHome customer={customer} orders={orders} services={services} />
  );
}
