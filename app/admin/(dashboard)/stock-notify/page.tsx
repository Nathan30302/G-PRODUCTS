import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  DeskPageHeader,
  DeskStat,
  DeskStatGrid,
  DeskPanel,
  DeskEmpty
} from "@/components/admin/desk";
import { customerWhatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stock alerts" };

function contactHref(contact: string, productName: string, option?: string) {
  if (contact.includes("@")) return `mailto:${contact}`;
  const which = option ? `${productName} (${option})` : productName;
  return customerWhatsAppLink(
    contact,
    `Hello, this is G-Products. ${which} is back in stock. You asked us to let you know.`
  );
}

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

  const uniqueProducts = new Set(rows.map((r) => r.product.id)).size;

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Waitlist"
        title="Stock alerts"
        description='Customers who tapped "Notify me" — call or WhatsApp when stock is back.'
      />

      <DeskStatGrid>
        <DeskStat label="Requests" value={rows.length} tone="warn" />
        <DeskStat label="Products" value={uniqueProducts} />
        <DeskStat
          label="Catalogue"
          value="Open"
          href="/admin/products"
          hint="Restock from Products"
        />
        <DeskStat
          label="Overview"
          value="Pulse"
          href="/admin"
          hint="Back to desk"
        />
      </DeskStatGrid>

      <DeskPanel>
        {rows.length === 0 ? (
          <DeskEmpty
            title="No notify requests yet"
            description="When a sold-out item gets a waitlist tap, it lands here."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-gp-muted/50 text-[11px] uppercase tracking-[0.14em] text-gp-text-subtle">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">When</th>
                    <th className="px-5 py-3.5 font-semibold">Product</th>
                    <th className="px-5 py-3.5 font-semibold">Option</th>
                    <th className="px-5 py-3.5 font-semibold">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-gp-border/70 transition-colors hover:bg-gp-muted/50"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 text-gp-text-muted">
                        {r.createdAt.toLocaleString("en-ZM", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/products/${r.product.id}`}
                          className="font-medium text-gp-text hover:text-accent-ink"
                        >
                          {r.product.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gp-text-muted">
                        {r.variantId
                          ? (variantName.get(r.variantId) ?? "—")
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={contactHref(
                            r.contact,
                            r.product.name,
                            r.variantId
                              ? variantName.get(r.variantId)
                              : undefined
                          )}
                          className="font-mono text-accent-ink hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {r.contact}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gp-border/70 bg-gp-muted/50 p-4"
                >
                  <Link
                    href={`/admin/products/${r.product.id}`}
                    className="font-bold text-gp-text hover:text-accent-ink"
                  >
                    {r.product.name}
                  </Link>
                  <p className="mt-1 text-xs text-gp-text-subtle">
                    {r.variantId
                      ? (variantName.get(r.variantId) ?? "Standard")
                      : "Standard"}{" "}
                    ·{" "}
                    {r.createdAt.toLocaleString("en-ZM", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </p>
                  <p className="mt-3 font-mono text-sm text-gp-text">{r.contact}</p>
                  <a
                    href={contactHref(
                      r.contact,
                      r.product.name,
                      r.variantId ? variantName.get(r.variantId) : undefined
                    )}
                    className={`mt-2 inline-flex min-h-10 items-center rounded-pill px-3.5 py-2 text-sm font-bold text-white ${
                      r.contact.includes("@")
                        ? "bg-ink-850"
                        : "bg-[#25D366]"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {r.contact.includes("@") ? "Email" : "Tell them it's back"}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </DeskPanel>
    </div>
  );
}
