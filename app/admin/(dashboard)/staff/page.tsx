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
    <div>
      <h1 className="text-2xl font-black text-white">Staff</h1>
      <p className="mt-1 text-sm text-white/50">
        Give your team their own logins.
      </p>

      <div className="mt-6 overflow-hidden rounded-card border border-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900 text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-ink-800 bg-ink-850">
                <td className="px-4 py-3 text-white">{u.name}</td>
                <td className="px-4 py-3 text-white/60">{u.email}</td>
                <td className="px-4 py-3 text-white/60">
                  {u.role === "OWNER" ? "Owner" : "Staff"}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id === owner.id ? (
                    <span className="text-xs text-white/30">You</span>
                  ) : (
                    <form action={deleteStaff}>
                      <input type="hidden" name="id" value={u.id} />
                      <button
                        type="submit"
                        className="text-sm text-white/50 hover:text-red-400"
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

      <div className="mt-8 max-w-2xl rounded-card border border-ink-800 bg-ink-850 p-6">
        <h2 className="text-lg font-bold text-white">Add a user</h2>
        <p className="mt-1 text-sm text-white/50">
          Staff can manage products and orders. Owners can also manage staff and
          delete products.
        </p>
        <div className="mt-4">
          <AddStaffForm />
        </div>
      </div>
    </div>
  );
}
