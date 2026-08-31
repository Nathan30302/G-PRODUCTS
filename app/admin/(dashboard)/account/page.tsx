import { requireUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { DeskPageHeader, DeskPanel } from "@/components/admin/desk";
import { DeskThemeSettings } from "@/components/admin/DeskThemeSettings";

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
            Signed in as{" "}
            <span className="font-medium text-gp-text">{user.name}</span> ·{" "}
            {user.email}
          </>
        }
      />

      <DeskThemeSettings />

      <DeskPanel className="max-w-xl p-5 sm:p-7">
        <h2 className="text-lg font-bold text-gp-text">Change password</h2>
        <p className="mt-1 text-sm text-gp-text-muted">
          Use a strong password. After you change it here, sign in with the{" "}
          <strong className="font-semibold text-gp-text">new</strong> password on
          Profile. Deploys will not reset it unless OWNER_SYNC_PASSWORD=1 in
          Railway.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </DeskPanel>
    </div>
  );
}
