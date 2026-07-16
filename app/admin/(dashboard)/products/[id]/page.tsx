import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product" };

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, session] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        variants: { orderBy: { sortOrder: "asc" } }
      }
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true }
    }),
    getSession()
  ]);

  if (!product) notFound();

  let specs: string[] = [];
  try {
    specs = JSON.parse(product.shortSpecs);
    if (!Array.isArray(specs)) specs = [];
  } catch {
    specs = [];
  }

  return (
    <ProductForm
      categories={categories}
      canDelete={session?.role === "OWNER"}
      product={{
        id: product.id,
        name: product.name,
        brand: product.brand ?? "",
        categorySlug: product.category.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        description: product.description,
        shortSpecs: specs,
        featured: product.featured,
        hotDeal: product.hotDeal,
        imageUrls: product.images.map((i) => i.url),
        variants: product.variants.map((v) => ({
          name: v.name,
          colorHex: v.colorHex ?? "",
          quantity: v.quantity
        }))
      }}
    />
  );
}
