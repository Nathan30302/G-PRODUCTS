import { spawnSync } from "node:child_process";
import path from "node:path";

function dbPathFromUrl(url: string): string | null {
  if (!url.startsWith("file:")) return null;
  let filePath = url.slice("file:".length).split("?")[0];
  if (filePath.startsWith("///")) filePath = filePath.slice(2);
  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(path.join(process.cwd(), "prisma"), filePath);
}

function sql(db: string, statement: string) {
  const r = spawnSync("sqlite3", [db, statement], { encoding: "utf8" });
  if (r.status !== 0) {
    throw new Error(r.stderr?.trim() || `sqlite3 failed: ${statement.slice(0, 80)}`);
  }
  return (r.stdout ?? "").trim();
}

function tableExists(db: string, name: string): boolean {
  const row = sql(
    db,
    `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='${name}';`
  );
  return row === "1";
}

function columnNames(db: string, table: string): string[] {
  const out = sql(db, `PRAGMA table_info(${table});`);
  if (!out) return [];
  return out
    .split("\n")
    .map((line) => line.split("|")[1])
    .filter(Boolean);
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Customer", lastName: "—" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "—" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}

function esc(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Prepares legacy Customer / Order tables so `prisma db push` can add
 * required firstName, lastName, email and optional customerId on Order.
 */
export function prepareCustomerSchemaForPush(databaseUrl?: string): void {
  const url = databaseUrl ?? process.env.DATABASE_URL?.trim();
  if (!url) return;

  const db = dbPathFromUrl(url);
  if (!db) {
    console.log("[migrate] non-file DATABASE_URL — skip customer pre-migration");
    return;
  }

  if (!tableExists(db, "Customer")) {
    console.log("[migrate] no Customer table yet — skip pre-migration");
    return;
  }

  const cols = columnNames(db, "Customer");
  let changed = 0;

  if (!cols.includes("firstName")) {
    sql(db, "ALTER TABLE Customer ADD COLUMN firstName TEXT;");
    changed += 1;
  }
  if (!cols.includes("lastName")) {
    sql(db, "ALTER TABLE Customer ADD COLUMN lastName TEXT;");
    changed += 1;
  }
  if (!cols.includes("defaultLocation")) {
    sql(db, "ALTER TABLE Customer ADD COLUMN defaultLocation TEXT;");
    changed += 1;
  }
  if (!cols.includes("locationLabel")) {
    sql(db, "ALTER TABLE Customer ADD COLUMN locationLabel TEXT;");
    changed += 1;
  }

  const rows = sql(
    db,
    "SELECT id, name, email, phone, firstName, lastName FROM Customer;"
  );

  if (rows) {
    for (const line of rows.split("\n")) {
      const [id, name, email, phone, firstName, lastName] = line.split("|");
      if (!id) continue;

      const needsName = !firstName?.trim() || !lastName?.trim();
      const needsEmail = !email?.trim();

      if (!needsName && !needsEmail) continue;

      const parts = needsName ? splitName(name ?? "Customer") : null;
      const nextFirst = needsName ? parts!.firstName : firstName;
      const nextLast = needsName ? parts!.lastName : lastName;
      const digits = (phone ?? "").replace(/\D/g, "") || id.slice(-8);
      const nextEmail = needsEmail
        ? `${digits}@customers.gproducts.store`
        : email;

      sql(
        db,
        `UPDATE Customer SET firstName='${esc(nextFirst)}', lastName='${esc(nextLast)}', email='${esc(nextEmail)}' WHERE id='${esc(id)}';`
      );
      changed += 1;
    }
  }

  if (tableExists(db, "Order")) {
    const orderCols = columnNames(db, "Order");
    if (!orderCols.includes("customerId")) {
      sql(db, "ALTER TABLE \"Order\" ADD COLUMN customerId TEXT;");
      changed += 1;
    }
  }

  if (changed > 0) {
    console.log(`[migrate] prepared Customer schema (${changed} change(s))`);
  } else {
    console.log("[migrate] Customer schema already prepared");
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
