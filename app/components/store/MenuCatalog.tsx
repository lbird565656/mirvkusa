"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import CartSummary from "@/components/store/CartSummary";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
};

type Props = {
  products: Product[];
  initialCategory?: string;
};

const FIXED_CATEGORIES = [
  "Все",
  "Роллы",
  "Сеты",
  "Суши",
  "Закуски",
  "Салаты",
  "Горячие блюда",
  "Напитки",
  "Другое",
];

export default function MenuCatalog({ products, initialCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const normalizedInitialCategory =
    initialCategory && FIXED_CATEGORIES.includes(initialCategory)
      ? initialCategory
      : "Все";

  const [activeCategory, setActiveCategory] = useState(normalizedInitialCategory);

  useEffect(() => {
    setActiveCategory(normalizedInitialCategory);
  }, [normalizedInitialCategory]);

  const visibleCategories = useMemo(() => {
    const present = new Set(products.map((product) => product.category));
    return FIXED_CATEGORIES.filter(
      (category) => category === "Все" || present.has(category)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Все") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  function handleCategoryChange(category: string) {
    setActiveCategory(category);

    const params = new URLSearchParams(searchParams.toString());

    if (category === "Все") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {visibleCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 text-neutral-600 shadow-sm">
            В этой категории пока нет товаров
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="xl:sticky xl:top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}