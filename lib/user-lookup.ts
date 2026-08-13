import { prisma } from "@/lib/db";
import { normalizePhone, phoneVariants } from "@/lib/phone";

/** Case-insensitive email match for SQLite. */
export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const exact = await prisma.user.findUnique({ where: { email: normalized } });
  if (exact) return exact;

  const all = await prisma.user.findMany({
    where: { email: { contains: normalized } }
  });
  return (
    all.find((u) => u.email.trim().toLowerCase() === normalized) ?? null
  );
}

/** Provider desk login — email or phone. */
export async function findDeskUserByIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    const byEmail = await findUserByEmail(trimmed);
    if (byEmail) return byEmail;
  }

  const phone = normalizePhone(trimmed);
  if (phone) {
    const variants = phoneVariants(phone);
    const byPhone = await prisma.user.findFirst({
      where: { phone: { in: variants } }
    });
    if (byPhone) return byPhone;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 9) {
    const tail = digits.slice(-9);
    const users = await prisma.user.findMany({
      where: { phone: { not: null } }
    });
    const match = users.find(
      (u) => u.phone && u.phone.replace(/\D/g, "").endsWith(tail)
    );
    if (match) return match;
  }

  return null;
}
