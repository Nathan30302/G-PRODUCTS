import { requireUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Your login
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
          Account
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Signed in as <span className="text-white/80">{user.name}</span> ·{" "}
          {user.email}
        </p>
      </div>

      <div className="rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-5 shadow-card sm:p-7">
        <h2 className="text-lg font-bold text-white">Change password</h2>
        <p className="mt-1 text-sm text-white/45">
          Use a strong password. After you change it here, sign in with the{" "}
          <strong className="text-white/70">new</strong> password on Profile.
          Deploys will not reset it unless OWNER_SYNC_PASSWORD=1 in Railway.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
