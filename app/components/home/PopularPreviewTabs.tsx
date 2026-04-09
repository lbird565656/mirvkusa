"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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
};

const FIXED_CATEGORIES = [
  "Роллы",
  "Сеты",
  "Суши",
  "Закуски",
  "Салаты",
  "Горячие блюда",
  "Напитки",
  "Другое",
] as const;

const PLACEHOLDER_BY_CATEGORY: Record<string, { name: string; text: string }[]> = {
  "Роллы": [
    { name: "Популярный ролл 1", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный ролл 2", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный ролл 3", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный ролл 4", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный ролл 5", text: "Будет заменён на реальную популярную позицию" },
  ],
  "Сеты": [
    { name: "Популярный сет 1", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный сет 2", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный сет 3", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный сет 4", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный сет 5", text: "Будет заменён на реальную популярную позицию" },
  ],
  "Суши": [
    { name: "Популярные суши 1", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярные суши 2", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярные суши 3", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярные суши 4", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярные суши 5", text: "Будет заменён на реальную популярную позицию" },
  ],
  "Закуски": [
    { name: "Популярная закуска 1", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная закуска 2", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная закуска 3", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная закуска 4", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная закуска 5", text: "Будет заменена на реальную популярную позицию" },
  ],
  "Салаты": [
    { name: "Популярный салат 1", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный салат 2", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный салат 3", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный салат 4", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный салат 5", text: "Будет заменён на реальную популярную позицию" },
  ],
  "Горячие блюда": [
    { name: "Популярное горячее 1", text: "Будет заменено на реальную популярную позицию" },
    { name: "Популярное горячее 2", text: "Будет заменено на реальную популярную позицию" },
    { name: "Популярное горячее 3", text: "Будет заменено на реальную популярную позицию" },
    { name: "Популярное горячее 4", text: "Будет заменено на реальную популярную позицию" },
    { name: "Популярное горячее 5", text: "Будет заменено на реальную популярную позицию" },
  ],
  "Напитки": [
    { name: "Популярный напиток 1", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный напиток 2", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный напиток 3", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный напиток 4", text: "Будет заменён на реальную популярную позицию" },
    { name: "Популярный напиток 5", text: "Будет заменён на реальную популярную позицию" },
  ],
  "Другое": [
    { name: "Популярная позиция 1", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная позиция 2", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная позиция 3", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная позиция 4", text: "Будет заменена на реальную популярную позицию" },
    { name: "Популярная позиция 5", text: "Будет заменена на реальную популярную позицию" },
  ],
};

export default function PopularPreviewTabs({ products }: Props) {
  const availableCategories = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    return FIXED_CATEGORIES.filter(
      (category) => present.has(category) || PLACEHOLDER_BY_CATEGORY[category]
    );
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string>(
    availableCategories[0] || "Роллы"
  );

  const cards = useMemo(() => {
    const realItems = products
      .filter((product) => product.category === activeCategory)
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        name: product.name,
        text: product.description,
        imageUrl: product.imageUrl || null,
        isPlaceholder: false,
      }));

    const missingCount = Math.max(0, 5 - realItems.length);
    const placeholders = (PLACEHOLDER_BY_CATEGORY[activeCategory] || [])
      .slice(0, missingCount)
      .map((item, index) => ({
        id: `placeholder-${activeCategory}-${index}`,
        name: item.name,
        text: item.text,
        imageUrl: null,
        isPlaceholder: true,
      }));

    return [...realItems, ...placeholders];
  }, [activeCategory, products]);

  return (
    <section className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
            Разделы
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Основные разделы меню
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Здесь показываются популярные позиции по категориям. Нажмите на карточку,
            чтобы открыть меню с уже выбранной категорией.
          </p>
        </div>

        <Link
          href="/menu"
          className="text-sm font-medium text-orange-600 transition hover:text-orange-700"
        >
          Смотреть всё меню
        </Link>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((item) => (
          <Link
            key={item.id}
            href={`/menu?category=${encodeURIComponent(activeCategory)}`}
            className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-28 w-full object-cover"
              />
            ) : (
              <div className="flex h-28 items-center justify-center bg-neutral-100 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                Фото
              </div>
            )}

            <div className="p-4">
              <div className="text-sm font-semibold tracking-tight text-neutral-950">
                {item.name}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {item.text}
              </p>
              {item.isPlaceholder ? (
                <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Заглушка
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}