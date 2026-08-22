import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/db";

export async function getAdminAnalytics() {
  const [
    customerCount,
    staffCount,
    orderCount,
    ownerCount,
    customers,
    staff,
    orderItems,
    recentOrders
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "OWNER" } }),
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        phone: true,
        defaultLocation: true,
        locationLabel: true,
        createdAt: true,
        _count: { select: { orders: true } }
      }
    }),
    prisma.user.findMany({
      where: { role: "STAFF" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        staffTitle: true,
        createdAt: true
      }
    }),
    prisma.orderItem.findMany({
      where: { order: { status: { not: "CANCELLED" } } },
      select: {
        productId: true,
        name: true,
        qty: true,
        price: true
      }
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { items: true }
    })
  ]);

  const productStats = new Map<
    string,
    { id: string | null; name: string; qty: number; revenue: number }
  >();
  for (const item of orderItems) {
    const key = item.productId ?? item.name;
    const row = productStats.get(key) ?? {
      id: item.productId,
      name: item.name,
      qty: 0,
      revenue: 0
    };
    row.qty += item.qty;
    row.revenue += item.qty * item.price;
    if (!row.id && item.productId) row.id = item.productId;
    productStats.set(key, row);
  }

  const topProducts = [...productStats.values()]
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);

  const buyerStats = new Map<
    string,
    {
      name: string;
      phone: string;
      location: string;
      orders: number;
      spent: number;
      lastOrder: Date | null;
    }
  >();

  for (const order of recentOrders) {
    const key = order.customerPhone.replace(/\D/g, "") || order.customerName;
    const row = buyerStats.get(key) ?? {
      name: order.customerName,
      phone: order.customerPhone,
      location: order.address?.trim() || "—",
      orders: 0,
      spent: 0,
      lastOrder: null
    };
    row.orders += 1;
    row.spent += order.total;
    if (!row.lastOrder || order.createdAt > row.lastOrder) {
      row.lastOrder = order.createdAt;
      if (order.address?.trim()) row.location = order.address.trim();
    }
    buyerStats.set(key, row);
  }

  // All orders for top buyers (not just recent 20)
  const allOrders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    select: {
      customerName: true,
      customerPhone: true,
      address: true,
      total: true,
      createdAt: true
    }
  });

  const allBuyers = new Map<
    string,
    {
      name: string;
      phone: string;
      location: string;
      orders: number;
      spent: number;
      lastOrder: Date | null;
    }
  >();

  for (const order of allOrders) {
    const key = order.customerPhone.replace(/\D/g, "") || order.customerName;
    const row = allBuyers.get(key) ?? {
      name: order.customerName,
      phone: order.customerPhone,
      location: order.address?.trim() || "—",
      orders: 0,
      spent: 0,
      lastOrder: null
    };
    row.orders += 1;
    row.spent += order.total;
    if (!row.lastOrder || order.createdAt > row.lastOrder) {
      row.lastOrder = order.createdAt;
      if (order.address?.trim()) row.location = order.address.trim();
    }
    allBuyers.set(key, row);
  }

  const topCustomers = [...allBuyers.values()]
    .sort((a, b) => b.orders - a.orders || b.spent - a.spent)
    .slice(0, 8);

  const registeredWithOrders = customers.filter((c) =>
    allBuyers.has(c.phone.replace(/\D/g, ""))
  ).length;

  // Enrich order counts from phone-matched guest orders when customerId isn't set
  const customersWithOrders = customers.map((c) => {
    const key = c.phone.replace(/\D/g, "");
    const guest = allBuyers.get(key);
    const linked = c._count.orders;
    const totalOrders = Math.max(linked, guest?.orders ?? 0);
    return { ...c, totalOrders };
  });

  return {
    customerCount,
    staffCount,
    ownerCount,
    deskUserCount: staffCount + ownerCount,
    orderCount,
    registeredWithOrders,
    topProducts,
    topCustomers,
    customers: customersWithOrders,
    staff,
    recentOrders,
    formatPrice
  };
}

export type AdminAnalytics = Awaited<ReturnType<typeof getAdminAnalytics>>;
