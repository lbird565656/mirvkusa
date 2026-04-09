
import SectionTitle from "@/components/shared/SectionTitle";
import MenuCatalog from "@/components/store/MenuCatalog";
import { prisma } from "@/lib/prisma";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [
      { category: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionTitle
          eyebrow="Меню"
          title="Каталог блюд"
          description="Товары сгруппированы по категориям."
        />

        <MenuCatalog
          initialCategory={category}
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl,
          }))}
        />
      </main>
    </>
  );
}