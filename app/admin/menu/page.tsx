export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

type AdminMenuProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  isAvailable: boolean;
};

export default async function AdminMenuPage() {
  const products: AdminMenuProduct[] = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      category: true,
      imageUrl: true,
      isAvailable: true,
    },
  });

  const categories = [
    "Все",
    ...new Set(products.map((p: AdminMenuProduct) => p.category)),
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
          Админ
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
          Просмотр меню
        </h1>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category: string) => (
            <span
              key={category}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {products.map((product: AdminMenuProduct) => (
            <div
              key={product.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-base font-semibold text-neutral-950">
                      {product.name}
                    </div>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                      {product.category}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {product.isAvailable ? "Доступен" : "Скрыт"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-neutral-500">
                    {product.description}
                  </div>
                </div>

                <div className="text-sm font-semibold text-neutral-950">
                  {product.price} ₽
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}