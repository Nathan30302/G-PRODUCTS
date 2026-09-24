import { redirect } from "next/navigation";

/** Old name for the provider desk. There is no third login. */
export default function LegacyAdminGuardPage() {
  redirect("/guard/provider");
}
