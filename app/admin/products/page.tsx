import ProductManager from "@/components/admin/ProductManager";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [
      { category: "asc" },
      { featuredOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-neutral-950">
        Товары
      </h1>
      <ProductManager initialProducts={products} />
    </main>
  );
}