import { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await requireUser();
  const [profile, pendingOrders, serviceQueue, stockAlerts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
      select: { staffTitle: true }
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.serviceRequest.count({
      where: { status: { in: ["NEW", "CONFIRMED"] } }
    }),
    prisma.stockNotify.count()
  ]);

  return (
    <AdminShell
      user={{
        name: session.name,
        role: session.role,
        staffTitle: profile?.staffTitle ?? null
      }}
      badges={{
        orders: pendingOrders,
        services: serviceQueue,
        stock: stockAlerts
      }}
    >
      {children}
    </AdminShell>
  );
}
