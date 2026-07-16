import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories } from "../lib/categories";
import { products } from "../lib/products";

const prisma = new PrismaClient();

async function main() {
  // --- Owner account ---
  const ownerEmail = process.env.OWNER_EMAIL ?? "gift@gproducts.zm";
  const ownerName = process.env.OWNER_NAME ?? "Gift Mbumwae";
  const ownerPassword = process.env.OWNER_PASSWORD ?? "changeme123";

  const passwordHash = await bcrypt.hash(ownerPassword, 10);
  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { name: ownerName, role: "OWNER" },
    create: {
      email: ownerEmail,
      name: ownerName,
      passwordHash,
      role: "OWNER"
    }
  });
  console.log(`Owner account ready: ${ownerEmail}`);

  // --- Categories ---
  const categoryIdBySlug = new Map<string, string>();
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, tagline: c.tagline, icon: c.icon, sortOrder: i },
      create: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        icon: c.icon,
        sortOrder: i
      }
    });
    categoryIdBySlug.set(c.slug, cat.id);
  }
  console.log(`Seeded ${categories.length} categories`);

  // --- Products ---
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`Skipping ${p.slug}: unknown category ${p.categorySlug}`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        brand: p.brand,
        categoryId,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        description: p.description,
        shortSpecs: JSON.stringify(p.shortSpecs),
        stock: p.stock,
        featured: p.featured ?? false,
        hotDeal: p.hotDeal ?? false
      },
      create: {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        categoryId,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        description: p.description,
        shortSpecs: JSON.stringify(p.shortSpecs),
        stock: p.stock,
        featured: p.featured ?? false,
        hotDeal: p.hotDeal ?? false
      }
    });

    // reset images to match seed data
    await prisma.productImage.deleteMany({
      where: { product: { slug: p.slug } }
    });
    const created = await prisma.product.findUnique({
      where: { slug: p.slug }
    });
    if (created) {
      await prisma.productImage.createMany({
        data: p.images.map((img, idx) => ({
          productId: created.id,
          url: img.url,
          alt: img.alt,
          sortOrder: idx
        }))
      });
    }
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
