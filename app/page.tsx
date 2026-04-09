import Link from "next/link";
import PopularPreviewTabs from "@/components/home/PopularPreviewTabs";
import { prisma } from "@/lib/prisma";

const contacts = [
  { label: "Телефон", value: "8-904-116-12-22", href: "tel:89041161222" },
  { label: "Адрес", value: "ул. Артёма Сергеева, 82 «А»" },
  { label: "Формат", value: "Доставка и самовывоз" },
];

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      isAvailable: true,
      isFeatured: true,
    },
    orderBy: [
      { category: "asc" },
      { featuredOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6">
      <section className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-orange-700">
          Мир Вкуса
        </div>

        <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
          Быстрый заказ суши и горячих блюд без лишних шагов
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
          Откройте меню, соберите корзину, подтвердите заказ и дождитесь звонка
          оператора.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/menu"
            className="flex h-12 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-medium text-white"
          >
            Открыть меню
          </Link>

          <Link
            href="/cart"
            className="flex h-12 items-center justify-center rounded-full border border-neutral-300 px-6 text-sm font-medium text-neutral-950"
          >
            Перейти в корзину
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {contacts.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-neutral-50 px-4 py-4"
            >
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                {item.label}
              </div>

              {item.href ? (
                <a
                  href={item.href}
                  className="mt-1 block text-sm font-semibold text-neutral-950 hover:text-orange-600"
                >
                  {item.value}
                </a>
              ) : (
                <div className="mt-1 text-sm font-semibold text-neutral-950">
                  {item.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <PopularPreviewTabs
        products={featuredProducts.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
        }))}
      />

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
            Как заказать
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Всё максимально просто
          </h2>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-neutral-50 px-4 py-4">
              <div className="text-sm font-semibold text-neutral-950">
                1. Выберите блюда
              </div>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Перейдите в меню и добавьте нужные позиции в корзину.
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 px-4 py-4">
              <div className="text-sm font-semibold text-neutral-950">
                2. Проверьте заказ
              </div>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                На странице оформления укажите имя, телефон и адрес.
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 px-4 py-4">
              <div className="text-sm font-semibold text-neutral-950">
                3. Дождитесь подтверждения
              </div>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                После оформления вы получите номер заказа, затем позвонит оператор.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-neutral-200 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] p-5 shadow-sm sm:p-7">
          <div className="rounded-[28px] border border-dashed border-orange-200 bg-white/70 p-6">
            <div className="text-sm font-semibold text-orange-700">
              Блок под баннер или сет дня
            </div>
            <p className="mt-2 max-w-sm text-sm leading-6 text-orange-900/70">
              Пока можно оставить чистый визуальный блок. Позже сюда можно
              поставить акционный сет, новинку или качественное фото блюда.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
              <div className="text-xs text-neutral-400">Быстрый путь</div>
              <div className="mt-1 text-sm font-semibold text-neutral-950">
                Меню → Корзина → Заказ
              </div>
            </div>

            <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
              <div className="text-xs text-neutral-400">Подтверждение</div>
              <div className="mt-1 text-sm font-semibold text-neutral-950">
                По звонку оператора
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Link
              href="/menu"
              className="flex h-12 w-full items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-medium text-white sm:w-auto"
            >
              Перейти к заказу
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}