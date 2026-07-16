import { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  return (
    <AdminShell user={{ name: user.name, role: user.role }}>
      {children}
    </AdminShell>
  );
}
