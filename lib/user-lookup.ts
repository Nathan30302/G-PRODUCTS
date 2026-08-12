import { prisma } from "@/lib/db";
import { normalizePhone, phoneVariants } from "@/lib/phone";

/** Provider desk login — email or phone (Gift may use either on mobile). */
export async function findDeskUserByIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    const email = trimmed.toLowerCase();
    const byEmail = await prisma.user.findUnique({ where: { email } });
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
      where: { phone: { not: null } },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        passwordHash: true,
        role: true,
        staffTitle: true,
        createdAt: true
      }
    });
    const match = users.find(
      (u) => u.phone && u.phone.replace(/\D/g, "").endsWith(tail)
    );
    if (match) return match;
  }

  return null;
}
