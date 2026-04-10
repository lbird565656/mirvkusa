export const dynamic = "force-dynamic";
import SectionTitle from "@/components/shared/SectionTitle";
import MenuCatalog from "@/components/store/MenuCatalog";
import { prisma } from "@/lib/prisma";

type MenuProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const products: MenuProduct[] = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      imageUrl: true,
    },
  });

  const categories = ["Все", ...new Set(products.map((p: MenuProduct) => p.category))];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <SectionTitle
        eyebrow="Меню"
        title="Каталог блюд"
        description="Товары сгруппированы по категориям."
      />

      <MenuCatalog
        initialCategory={category}
        products={products.map((product: MenuProduct) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
        }))}
      />
    </main>
  );
}