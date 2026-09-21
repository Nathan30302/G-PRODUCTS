import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";

/** Legacy URL — desk sign-in lives at /desk/login */
export default function LegacyAdminLoginPage() {
  redirect(siteConfig.apps.provider.login);
}
