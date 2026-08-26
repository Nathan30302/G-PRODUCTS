import "server-only";
import { getCustomerSession } from "@/lib/customer-auth";
import { siteConfig } from "@/config/site";

/** Shop chrome only — never expose provider desk links on the storefront. */
export type PublicAuth = {
  kind: "customer";
  name: string;
  home: string;
} | null;

export async function getPublicAuth(): Promise<PublicAuth> {
  try {
    const customer = await getCustomerSession();
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
