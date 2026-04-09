import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/store/ProductCard";
import CartSummary from "@/components/store/CartSummary";
import SectionTitle from "@/components/shared/SectionTitle";
import { prisma } from "@/lib/prisma";

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = ["Все", ...new Set(products.map((p) => p.category))];

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionTitle
          eyebrow="Меню"
          title="Каталог блюд"
          description="Теперь товары загружаются из базы данных."
        />

        <div className="mb-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                category === "Все"
                  ? "bg-black text-white"
                  : "border border-neutral-200 bg-white text-neutral-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  category: product.category,
                  imageUrl: product.imageUrl,
                }}
              />
            ))}
          </div>

          <div>
            <CartSummary />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}