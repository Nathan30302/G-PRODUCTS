import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth";
import { AddStaffForm } from "@/components/admin/AddStaffForm";
import { deleteStaff } from "@/app/admin/(dashboard)/staff/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const owner = await requireOwner();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Team access
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
          Staff
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Give your team their own logins to help run the desk.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Email</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold"></th>
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
                    <span
                      className={`rounded-pill border px-2.5 py-1 text-xs font-semibold ${
                        u.role === "OWNER"
                          ? "border-brand/30 bg-brand/10 text-brand"
                          : "border-white/15 text-white/65"
                      }`}
                    >
                      {u.role === "OWNER" ? "Owner" : "Staff"}
                    </span>
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
      </div>

      <div className="max-w-2xl rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-6 shadow-card sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Invite
        </p>
        <h2 className="mt-1 text-xl font-black text-white">Add a user</h2>
        <p className="mt-2 text-sm text-white/50">
          Staff can manage products and orders. Owners can also manage staff and
          delete products.
        </p>
        <div className="mt-5">
          <AddStaffForm />
        </div>
      </div>
    </div>
  );
}
