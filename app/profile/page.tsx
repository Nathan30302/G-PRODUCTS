import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

/** Shop account entry. Never follows a provider or admin session. */
export default async function ProfilePage({
  searchParams
}: {
  searchParams?: Promise<{ mode?: string; ref?: string }>;
}) {
  const customer = await getCustomerSession().catch(() => null);
  if (customer) redirect(siteConfig.apps.customer.home);

  const params = searchParams ? await searchParams : {};
  const q = new URLSearchParams();
  if (params.mode === "signup" || params.ref) q.set("mode", "signup");
  if (params.ref) q.set("ref", params.ref);
  const suffix = q.toString() ? `?${q.toString()}` : "";
  redirect(`${siteConfig.apps.customer.login}${suffix}`);
}
