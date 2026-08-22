import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth";
import { AddStaffForm } from "@/components/admin/AddStaffForm";
import { StaffRoleCell } from "@/components/admin/StaffRoleCell";
import { deleteStaff } from "@/app/admin/(dashboard)/staff/actions";
import {
  DeskPageHeader,
  DeskPanel,
  DeskPanelHeader
} from "@/components/admin/desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const owner = await requireOwner();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Team access"
        title="Staff"
        description="Add teammates with an email + password, then share those details. They sign in on Profile — they can't create desk accounts themselves."
      />

      <DeskPanel>
        <DeskPanelHeader
          title="Team members"
          subtitle={`${users.length} login${users.length === 1 ? "" : "s"}`}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Email</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3.5 font-semibold text-white">
                    {u.name}
                  </td>
                  <td className="px-5 py-3.5 text-white/60">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <StaffRoleCell
                      userId={u.id}
                      role={u.role}
                      staffTitle={u.staffTitle}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {u.id === owner.id ? (
                      <span className="text-xs text-white/30">You</span>
                    ) : (
                      <form action={deleteStaff}>
                        <input type="hidden" name="id" value={u.id} />
                        <button
                          type="submit"
                          className="text-sm text-white/50 transition-colors hover:text-red-400"
                        >
                          Remove
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DeskPanel>

      <DeskPanel className="max-w-2xl p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Invite
        </p>
        <h2 className="mt-1 text-xl font-black text-white">Add a user</h2>
        <p className="mt-2 text-sm text-white/50">
          Write each person&apos;s role when you add them. Staff can manage
          products and orders; owners can also manage staff and delete products.
        </p>
        <div className="mt-5">
          <AddStaffForm />
        </div>
      </DeskPanel>
    </div>
  );
}
