import { prisma } from "@/lib/db";
import { normalizePhone, phoneVariants } from "@/lib/phone";

/** Find a storefront customer by email or phone (flexible formats). */
export async function findCustomerByIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    const email = trimmed.toLowerCase();
    const exact = await prisma.customer.findUnique({ where: { email } });
    if (exact) return exact;

    const fuzzy = await prisma.customer.findMany({
      where: { email: { contains: email } }
    });
    const match = fuzzy.find(
      (c) => c.email.trim().toLowerCase() === email
    );
    if (match) return match;
  }

  const phone = normalizePhone(trimmed);
  if (phone) {
    const variants = phoneVariants(phone);
    const byPhone = await prisma.customer.findFirst({
      where: { phone: { in: variants } }
    });
    if (byPhone) return byPhone;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 9) {
    const tail = digits.slice(-9);
    const candidates = await prisma.customer.findMany();
    const match = candidates.find((c) =>
      c.phone.replace(/\D/g, "").endsWith(tail)
    );
    if (match) return match;
  }

  return null;
}

/** Store every customer phone in one canonical format (+260…). */
export async function canonicalizeCustomerPhones(): Promise<number> {
  const customers = await prisma.customer.findMany({
    select: { id: true, phone: true }
  });

  let fixed = 0;
  for (const c of customers) {
    const canon = normalizePhone(c.phone);
    if (!canon || c.phone === canon) continue;

    const conflict = await prisma.customer.findFirst({
      where: { phone: canon, NOT: { id: c.id } }
    });
    if (conflict) continue;

    await prisma.customer.update({
      where: { id: c.id },
      data: { phone: canon }
    });
    fixed += 1;
  }

  return fixed;
}
