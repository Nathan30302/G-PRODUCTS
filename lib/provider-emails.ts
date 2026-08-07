import { siteConfig } from "@/config/site";

/**
 * Emails allowed to create a Provider (desk) account via public signup.
 * Staff cannot self-register — the owner adds them in the desk.
 */
export function providerSignupEmails(): string[] {
  const fromEnv = (process.env.PROVIDER_SIGNUP_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const owner = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();

  return [
    ...new Set([
      ...siteConfig.providerSignupEmails.map((e) => e.toLowerCase()),
      ...(owner ? [owner] : []),
      ...fromEnv
    ])
  ];
}

export function isProviderSignupEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  if (providerSignupEmails().includes(normalized)) return true;

  // Company domain — only the listed owner emails may self-signup;
  // other @gproducts.zm addresses must be added as staff by the owner.
  return false;
}
