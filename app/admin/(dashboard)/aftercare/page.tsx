import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import {
  DeskPageHeader,
  DeskPanel,
  DeskPanelHeader,
  DeskEmpty
} from "@/components/admin/desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Returns" };

const kindLabel: Record<string, string> = {
  return: "Return",
  exchange: "Exchange",
  warranty: "Warranty",
  gift: "Gift return"
};

export default async function AftercarePage() {
  await requireUser();
  const claims = await prisma.aftercareClaim.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Sales"
        title="Returns"
        description="Returns, exchanges, warranty claims, and gift returns started from a customer profile."
      />
      <DeskPanel>
        <DeskPanelHeader
          title="Open requests"
          subtitle={`${claims.length} shown`}
        />
        {claims.length === 0 ? (
          <DeskEmpty
            title="No returns yet"
            description="When a customer starts a return, exchange, or warranty claim, it will show here."
          />
        ) : (
          <ul className="divide-y divide-gp-border">
            {claims.map((claim) => (
              <li
                key={claim.id}
                className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gp-text">
                    {claim.ref} · {kindLabel[claim.kind] ?? claim.kind}
                  </p>
                  <p className="mt-1 text-sm text-gp-text-muted">
                    Order {claim.orderRef} · {claim.contact}
                  </p>
                  <p className="mt-1 text-xs text-gp-text-subtle">
                    {formatDateTime(claim.createdAt)} · {claim.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DeskPanel>
    </div>
  );
}
