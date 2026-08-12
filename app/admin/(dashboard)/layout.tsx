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
  const profile = await prisma.user.findUnique({
    where: { id: session.id },
    select: { staffTitle: true }
  });

  return (
    <AdminShell
      user={{
        name: session.name,
        role: session.role,
        staffTitle: profile?.staffTitle ?? null
      }}
    >
      {children}
    </AdminShell>
  );
}
