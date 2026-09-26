import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { AccountHome } from "@/components/profile/ProfileViews";
import { phoneVariants } from "@/lib/phone";
import { ensureReferralCode } from "@/lib/rewards";
import { siteUrl } from "@/lib/site-url";
import { REFERRAL_PERCENT } from "@/lib/referral-terms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Account",
  description: "Your G-Products account."
};

export default async function AccountPage() {
  const customer = await getCustomerSession();
  if (!customer) redirect("/profile");

  const record = await prisma.customer.findUnique({
    where: { id: customer.id },
    select: {
      firstName: true,
      lastName: true,
      name: true,
      createdAt: true,
      defaultLocation: true,
      locationLabel: true,
      offersOptIn: true,
      pendingDiscountPercent: true,
      referralCode: true
    }
  });
  if (!record) redirect("/profile");

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let services: Awaited<ReturnType<typeof prisma.serviceRequest.findMany>> = [];

  const phones = customer.phone ? phoneVariants(customer.phone) : [];
  const orderWhere = {
    OR: [
      { customerId: customer.id },
      ...(phones.length ? [{ customerId: null, customerPhone: { in: phones } }] : [])
    ]
  };

  if (customer.phone || customer.id) {
    [orders, services] = await Promise.all([
      prisma.order.findMany({
        where: orderWhere,
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      phones.length
        ? prisma.serviceRequest.findMany({
            where: { customerPhone: { in: phones } },
            orderBy: { createdAt: "desc" },
            take: 8
          })
        : Promise.resolve([])
    ]);
  }

  const favoriteItems = await prisma.orderItem.findMany({
    where: {
      productId: { not: null },
      order: orderWhere
    },
    select: { productId: true, qty: true }
  });
  const counts = new Map<string, number>();
  for (const item of favoriteItems) {
    if (!item.productId) continue;
    counts.set(item.productId, (counts.get(item.productId) ?? 0) + item.qty);
  }
  const topIds = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => id);
  const favoriteProducts = topIds.length
    ? await prisma.product.findMany({
        where: { id: { in: topIds } },
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { url: true }
          }
        }
      })
    : [];
  const favoriteById = new Map(favoriteProducts.map((product) => [product.id, product]));
  const favorites = topIds.flatMap((id) => {
    const product = favoriteById.get(id);
    if (!product) return [];
    return [
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url ?? null,
        ordered: counts.get(id) ?? 0
      }
    ];
  });

  const referralCode = record.referralCode || (await ensureReferralCode(customer.id).catch(() => ""));
  const referralLink = referralCode
    ? `${siteUrl()}/profile?mode=signup&ref=${encodeURIComponent(referralCode)}`
    : "";

  return (
    <AccountHome
      customer={customer}
      firstName={record.firstName}
      lastName={record.lastName}
      createdAt={record.createdAt}
      offersOptIn={record.offersOptIn}
      orders={orders}
      services={services.map((service) => ({
        id: service.id,
        ref: service.ref,
        serviceType: service.serviceType,
        status: service.status,
        createdAt: service.createdAt
      }))}
      favorites={favorites}
      defaultLocation={record.defaultLocation ?? ""}
      locationLabel={record.locationLabel ?? ""}
      referralLink={referralLink}
      rewardReady={record.pendingDiscountPercent >= REFERRAL_PERCENT}
    />
  );
}
