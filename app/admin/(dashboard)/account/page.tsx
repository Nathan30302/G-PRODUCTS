import { requireUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { DeskPageHeader, DeskPanel } from "@/components/admin/desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Your login"
        title="Account"
        description={
          <>
            Signed in as <span className="text-white/80">{user.name}</span> ·{" "}
            {user.email}
          </>
        }
      />

      <DeskPanel className="max-w-xl p-5 sm:p-7">
        <h2 className="text-lg font-bold text-white">Change password</h2>
        <p className="mt-1 text-sm text-white/45">
          Use a strong password. After you change it here, sign in with the{" "}
          <strong className="text-white/70">new</strong> password on Profile.
          Deploys will not reset it unless OWNER_SYNC_PASSWORD=1 in Railway.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </DeskPanel>
    </div>
  );
}
