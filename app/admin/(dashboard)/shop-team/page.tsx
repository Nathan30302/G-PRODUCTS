import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  DeskPageHeader,
  DeskPanel,
  DeskPanelHeader,
  DeskEmpty
} from "@/components/admin/desk";
import { ShopTeamMemberForm } from "@/components/admin/ShopTeamMemberForm";
import { ShopTeamMemberRow } from "@/components/admin/ShopTeamMemberRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop team" };

export default async function AdminShopTeamPage() {
  await requireUser();

  const members = await prisma.shopTeamMember.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Storefront"
        title="Shop team"
        description="Names and roles shown on the About page. Desk login accounts are managed under Staff."
      />

      <DeskPanel>
        <DeskPanelHeader
          title="Team on the website"
          subtitle={`${members.length} profile${members.length === 1 ? "" : "s"}`}
        />
        {members.length === 0 ? (
          <DeskEmpty
            title="No public profiles yet"
            description="Add people who should appear on About — name and role only."
          />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {members.map((m) => (
              <ShopTeamMemberRow
                key={m.id}
                member={{
                  id: m.id,
                  name: m.name,
                  title: m.title,
                  sortOrder: m.sortOrder,
                  published: m.published
                }}
              />
            ))}
          </ul>
        )}
      </DeskPanel>

      <DeskPanel className="max-w-2xl p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Add
        </p>
        <h2 className="mt-1 text-xl font-black text-white">New team member</h2>
        <p className="mt-1.5 text-sm text-white/45">
          Name, title, and publish — no photo upload needed.
        </p>
        <div className="mt-5">
          <ShopTeamMemberForm />
        </div>
      </DeskPanel>
    </div>
  );
}
