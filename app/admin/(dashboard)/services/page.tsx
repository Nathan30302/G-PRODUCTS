import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service requests" };

const typeLabel: Record<string, string> = {
  KEY_CUTTING: "Key Cutting",
  G_LOANS: "G-Loans",
  PRINTING: "Printing"
};

export default async function AdminServicesPage() {
  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Services desk
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
          Service requests
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {requests.length} request{requests.length === 1 ? "" : "s"} — key
          cutting, loans & printing
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Ref</th>
                <th className="px-5 py-3.5 font-semibold">Service</th>
                <th className="px-5 py-3.5 font-semibold">Customer</th>
                <th className="px-5 py-3.5 font-semibold">Delivery</th>
                <th className="px-5 py-3.5 font-semibold">Amount</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-white/40"
                  >
                    No service requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3.5 font-mono text-white/80">
                      {r.ref}
                    </td>
                    <td className="px-5 py-3.5 text-white/80">
                      {typeLabel[r.serviceType] ?? r.serviceType}
                    </td>
                    <td className="px-5 py-3.5 text-white/80">
                      {r.customerName}
                      <span className="block text-xs text-white/40">
                        {r.customerPhone}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/60">
                      {r.deliveryMethod === "YANGO" ? "Yango" : "Pickup"}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {typeof r.amount === "number"
                        ? formatPrice(r.amount)
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-white/60">{r.status}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/services/${r.id}`}
                        className="text-sm font-semibold text-brand hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
