import "server-only";
import { getSession } from "@/lib/auth";
import { getCustomerSession } from "@/lib/customer-auth";
import { siteConfig } from "@/config/site";

export type PublicAuth = {
  kind: "provider" | "customer";
  name: string;
  home: string;
} | null;

export async function getPublicAuth(): Promise<PublicAuth> {
  try {
    const [provider, customer] = await Promise.all([
      getSession(),
      getCustomerSession()
    ]);
    if (provider) {
      return {
        kind: "provider",
        name: provider.name,
        home: siteConfig.apps.provider.home
      };
    }
    if (customer) {
      return {
        kind: "customer",
        name: customer.name,
        home: siteConfig.apps.customer.home
      };
    }
  } catch (err) {
    console.error("[auth] session read failed:", err);
  }
  return null;
}
