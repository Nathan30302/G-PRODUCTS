import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stock alerts" };

export default async function StockNotifyAdminPage() {
  const rows = await prisma.stockNotify.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, name: true, slug: true } }
    },
    take: 100
  });

  const variantIds = [
    ...new Set(rows.map((r) => r.variantId).filter(Boolean) as string[])
  ];
  const variants =
    variantIds.length > 0
      ? await prisma.productVariant.findMany({
          where: { id: { in: variantIds } },
          select: { id: true, name: true }
        })
      : [];
  const variantName = new Map(variants.map((v) => [v.id, v.name]));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Waitlist
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
          Stock alerts
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Customers who tapped &quot;Notify me&quot; — call or WhatsApp when
          stock is back.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
              <tr>
                <th className="px-5 py-3.5 font-semibold">When</th>
                <th className="px-5 py-3.5 font-semibold">Product</th>
                <th className="px-5 py-3.5 font-semibold">Colour</th>
                <th className="px-5 py-3.5 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-white/40"
                  >
                    No notify requests yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-white/50">
                      {r.createdAt.toLocaleString("en-ZM", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/products/${r.product.id}`}
                        className="font-medium text-white hover:text-brand"
                      >
                        {r.product.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-white/60">
                      {r.variantId
                        ? (variantName.get(r.variantId) ?? "—")
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={
                          r.contact.includes("@")
                            ? `mailto:${r.contact}`
                            : `https://wa.me/${r.contact.replace(/[^0-9]/g, "")}`
                        }
                        className="font-mono text-brand hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {r.contact}
                      </a>
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
