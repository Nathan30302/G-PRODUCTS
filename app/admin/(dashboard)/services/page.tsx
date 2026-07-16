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
    <div>
      <h1 className="text-2xl font-black text-white">Service requests</h1>
      <p className="mt-1 text-sm text-white/50">
        {requests.length} request{requests.length === 1 ? "" : "s"} — key
        cutting, loans & printing
      </p>

      <div className="mt-6 overflow-hidden rounded-card border border-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Ref</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Delivery</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-white/40">
                  No service requests yet.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-t border-ink-800 bg-ink-850">
                  <td className="px-4 py-3 font-mono text-white/80">{r.ref}</td>
                  <td className="px-4 py-3 text-white/80">
                    {typeLabel[r.serviceType] ?? r.serviceType}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {r.customerName}
                    <span className="block text-xs text-white/40">
                      {r.customerPhone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {r.deliveryMethod === "YANGO" ? "Yango" : "Pickup"}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {typeof r.amount === "number" ? formatPrice(r.amount) : "—"}
                  </td>
                  <td className="px-4 py-3 text-white/60">{r.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/services/${r.id}`}
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
