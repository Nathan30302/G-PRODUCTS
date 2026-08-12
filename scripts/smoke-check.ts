import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const p = new PrismaClient();
async function main() {
  const product = await p.product.findFirst({
    where: { slug: "exercise-book-192" }
  });
  const user = await p.user.findUnique({ where: { email: "gift@gproducts.zm" } });
  const passwordOk = user
    ? await bcrypt.compare("changeme123", user.passwordHash)
    : false;
  console.log(
    JSON.stringify({
      productId: product?.id ?? null,
      passwordOk,
      role: user?.role ?? null,
      products: await p.product.count()
    })
  );
}
main().finally(() => p.$disconnect());
