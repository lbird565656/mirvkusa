import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export default async function AdminPage() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const productsCount = await prisma.product.count();
  const availableProductsCount = await prisma.product.count({
    where: {
      isAvailable: true,
    },
  });

  const totalOrders = orders.length;
  const newOrdersCount = orders.filter((order) => order.status === "NEW").length;
  const activeOrdersCount = orders.filter((order) =>
    ["CONFIRMED", "PREPARING", "DELIVERING"].includes(order.status)
  ).length;
  const completedOrdersCount = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  const today = new Date();
  const todayOrders = orders.filter((order) => {
    const date = new Date(order.createdAt);

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });

  const todayRevenue = todayOrders
    .filter((order) => order.status === "COMPLETED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-neutral-400">
            Админ-панель
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Управление сайтом</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Товары, заказы и аналитика в одном месте
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-neutral-400">
              Всего товаров
            </div>
            <div className="mt-2 text-3xl font-semibold text-black">
              {productsCount}
            </div>
            <div className="mt-2 text-sm text-neutral-500">
              Доступно: {availableProductsCount}
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-orange-600">
              Новые заказы
            </div>
            <div className="mt-2 text-3xl font-semibold text-orange-700">
              {newOrdersCount}
            </div>
            <div className="mt-2 text-sm text-orange-700/80">
              Требуют внимания
            </div>
          </div>

          <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-sky-600">
              В работе
            </div>
            <div className="mt-2 text-3xl font-semibold text-sky-700">
              {activeOrdersCount}
            </div>
            <div className="mt-2 text-sm text-sky-700/80">
              CONFIRMED / PREPARING / DELIVERING
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-emerald-600">
              Выручка сегодня
            </div>
            <div className="mt-2 text-3xl font-semibold text-emerald-700">
              {formatPrice(todayRevenue)}
            </div>
            <div className="mt-2 text-sm text-emerald-700/80">
              По завершённым заказам
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          <Link
            href="/admin/products"
            className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
          >
            <div className="mb-3 inline-flex rounded-2xl bg-black px-3 py-1 text-sm font-medium text-white">
              Товары
            </div>
            <h2 className="text-xl font-semibold text-black">Управление меню</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Добавление, редактирование, удаление и доступность товаров.
            </p>
            <div className="mt-5 text-sm font-medium text-orange-600">
              Открыть раздел →
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
          >
            <div className="mb-3 inline-flex rounded-2xl bg-orange-500 px-3 py-1 text-sm font-medium text-white">
              Заказы
            </div>
            <h2 className="text-xl font-semibold text-black">
              Контроль заказов
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Статусы, новые заказы, история клиентов и рабочий список оператору.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm">
              <span className="rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-orange-700 ring-1 ring-orange-200">
                Новые: {newOrdersCount}
              </span>
              <span className="rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700 ring-1 ring-sky-200">
                В работе: {activeOrdersCount}
              </span>
            </div>
            <div className="mt-4 text-sm font-medium text-orange-600">
              Открыть раздел →
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
          >
            <div className="mb-3 inline-flex rounded-2xl bg-emerald-600 px-3 py-1 text-sm font-medium text-white">
              Аналитика
            </div>
            <h2 className="text-xl font-semibold text-black">
              Показатели и выручка
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Ежедневные итоги, последние заказы, статусы и базовая сводка по продажам.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
                Сегодня: {formatPrice(todayRevenue)}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-semibold text-neutral-700 ring-1 ring-neutral-200">
                Завершено: {completedOrdersCount}
              </span>
            </div>
            <div className="mt-4 text-sm font-medium text-orange-600">
              Открыть раздел →
            </div>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-black">
              Быстрая сводка
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                <span className="text-neutral-600">Всего заказов</span>
                <span className="font-semibold text-black">{totalOrders}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                <span className="text-neutral-600">Новых заказов</span>
                <span className="font-semibold text-black">{newOrdersCount}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                <span className="text-neutral-600">Активных заказов</span>
                <span className="font-semibold text-black">
                  {activeOrdersCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                <span className="text-neutral-600">Завершённых заказов</span>
                <span className="font-semibold text-black">
                  {completedOrdersCount}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-black">
              Что уже готово
            </h2>

            <div className="space-y-3 text-sm text-neutral-700">
              <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                Меню работает из базы данных Prisma + SQLite.
              </div>
              <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                Заказы сохраняются, статусы обновляются, новые заказы отслеживаются.
              </div>
              <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                Доступна история клиентов по номеру телефона и базовая аналитика.
              </div>
              <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                Админ-раздел уже пригоден для повседневой работы.
              </div>
            </div>
          </div>
        </div>
      </main>

    </>
  );
}