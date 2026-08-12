/**
 * Pre-migration: add columns to Customer/Order if missing so `prisma db push`
 * can handle the new required fields. Uses Prisma $executeRawUnsafe for SQLite
 * so no `sqlite3` CLI dependency is needed on Railway/Nixpacks.
 */

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Customer", lastName: "—" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "—" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}

export async function prepareCustomerSchema(): Promise<void> {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    let changed = 0;

    // Check if Customer table exists
    const tables = await prisma.$queryRawUnsafe<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Customer'"
    );
    if (tables.length === 0) {
      console.log("[migrate] no Customer table yet — skip pre-migration");
      return;
    }

    // Get column info
    const cols = await prisma.$queryRawUnsafe<{ name: string }[]>(
      "PRAGMA table_info(Customer)"
    );
    const colNames = new Set(cols.map((c) => c.name));

    if (!colNames.has("firstName")) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE Customer ADD COLUMN firstName TEXT"
      );
      changed += 1;
    }
    if (!colNames.has("lastName")) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE Customer ADD COLUMN lastName TEXT"
      );
      changed += 1;
    }
    if (!colNames.has("defaultLocation")) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE Customer ADD COLUMN defaultLocation TEXT"
      );
      changed += 1;
    }
    if (!colNames.has("locationLabel")) {
      await prisma.$executeRawUnsafe(
        "ALTER TABLE Customer ADD COLUMN locationLabel TEXT"
      );
      changed += 1;
    }

    // Backfill firstName/lastName from name, and email for NULL rows
    const customers = await prisma.$queryRawUnsafe<
      {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
      }[]
    >(
      "SELECT id, name, email, phone, firstName, lastName FROM Customer"
    );

    for (const c of customers) {
      const needsName = !c.firstName?.trim() || !c.lastName?.trim();
      const needsEmail = !c.email?.trim();

      if (!needsName && !needsEmail) continue;

      const parts = needsName
        ? splitName(c.name ?? "Customer")
        : null;
      const firstName = needsName ? parts!.firstName : c.firstName;
      const lastName = needsName ? parts!.lastName : c.lastName;
      const digits =
        (c.phone ?? "").replace(/\D/g, "") || c.id.slice(-8);
      const email = needsEmail
        ? `${digits}@customers.gproducts.store`
        : c.email;

      await prisma.$executeRawUnsafe(
        `UPDATE Customer SET firstName = ?, lastName = ?, email = ? WHERE id = ?`,
        firstName,
        lastName,
        email,
        c.id
      );
      changed += 1;
    }

    // Order table — add customerId if missing
    const orderTables = await prisma.$queryRawUnsafe<{ name: string }[]>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='Order'`
    );
    if (orderTables.length > 0) {
      const orderCols = await prisma.$queryRawUnsafe<{ name: string }[]>(
        `PRAGMA table_info("Order")`
      );
      const orderColNames = new Set(orderCols.map((c) => c.name));
      if (!orderColNames.has("customerId")) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE "Order" ADD COLUMN customerId TEXT`
        );
        changed += 1;
      }
    }

    if (changed > 0) {
      console.log(
        `[migrate] prepared Customer schema (${changed} change(s))`
      );
    } else {
      console.log("[migrate] Customer schema already prepared");
    }
  } finally {
    await prisma.$disconnect();
  }
}

/** Link orders to registered customers by phone after schema is in sync. */
export async function linkOrdersToCustomers(): Promise<void> {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const customers = await prisma.customer.findMany({
      select: { id: true, phone: true }
    });
    const byPhone = new Map<string, string>();
    for (const c of customers) {
      const digits = c.phone.replace(/\D/g, "");
      if (digits) byPhone.set(digits, c.id);
    }

    const unlinked = await prisma.order.findMany({
      where: { customerId: null },
      select: { id: true, customerPhone: true }
    });

    let linked = 0;
    for (const order of unlinked) {
      const digits = order.customerPhone.replace(/\D/g, "");
      const customerId = byPhone.get(digits);
      if (!customerId) continue;
      await prisma.order.update({
        where: { id: order.id },
        data: { customerId }
      });
      linked += 1;
    }

    if (linked > 0) {
      console.log(`[migrate] linked ${linked} order(s) to customer accounts`);
    }
  } finally {
    await prisma.$disconnect();
  }
}
