
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("ru-RU");
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "Новый";
    case "CONFIRMED":
      return "Подтверждён";
    case "PREPARING":
      return "Готовится";
    case "DELIVERING":
      return "В пути";
    case "COMPLETED":
      return "Завершён";
    case "CANCELLED":
      return "Отменён";
    default:
      return status;
  }
}

export default async function AdminAnalyticsPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      status: true,
      customerName: true,
      phone: true,
      createdAt: true,
    },
  });

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const todayOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= todayStart && createdAt <= todayEnd;
  });

  const todayCompletedOrders = todayOrders.filter(
    (order) => order.status === "COMPLETED"
  );

  const todayNonCancelledOrders = todayOrders.filter(
    (order) => order.status !== "CANCELLED"
  );

  const todayRevenueCompleted = todayCompletedOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const todayRevenueNonCancelled = todayNonCancelledOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const completedOrdersCount = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  const cancelledOrdersCount = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const activeOrdersCount = orders.filter((order) =>
    ["NEW", "CONFIRMED", "PREPARING", "DELIVERING"].includes(order.status)
  ).length;

  const averageCheck =
    todayNonCancelledOrders.length > 0
      ? Math.round(todayRevenueNonCancelled / todayNonCancelledOrders.length)
      : 0;

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return startOfDay(date);
  });

  const dailyStats = last7Days.map((date) => {
    const ordersForDay = orders.filter((order) =>
      isSameDay(new Date(order.createdAt), date)
    );

    const completedForDay = ordersForDay.filter(
      (order) => order.status === "COMPLETED"
    );

    const nonCancelledForDay = ordersForDay.filter(
      (order) => order.status !== "CANCELLED"
    );

    return {
      key: formatDateKey(date),
      label: formatDate(date),
      ordersCount: ordersForDay.length,
      completedCount: completedForDay.length,
      revenueCompleted: completedForDay.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      ),
      revenueNonCancelled: nonCancelledForDay.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      ),
    };
  });

  const statusSummary = [
    { key: "NEW", count: orders.filter((order) => order.status === "NEW").length },
    {
      key: "CONFIRMED",
      count: orders.filter((order) => order.status === "CONFIRMED").length,
    },
    {
      key: "PREPARING",
      count: orders.filter((order) => order.status === "PREPARING").length,
    },
    {
      key: "DELIVERING",
      count: orders.filter((order) => order.status === "DELIVERING").length,
    },
    {
      key: "COMPLETED",
      count: orders.filter((order) => order.status === "COMPLETED").length,
    },
    {
      key: "CANCELLED",
      count: orders.filter((order) => order.status === "CANCELLED").length,
    },
  ];

  const recentOrders = orders.slice(0, 10);

  return (
    <>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
            Админ-панель
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">Аналитика</h1>
          <p className="text-sm text-neutral-500">
            Простая сводка по заказам и выручке
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-neutral-400">
              Заказов сегодня
            </div>
            <div className="mt-2 text-3xl font-semibold text-black">
              {todayOrders.length}
            </div>
            <div className="mt-2 text-sm text-neutral-500">
              Все статусы за сегодня
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-emerald-600">
              Выручка сегодня
            </div>
            <div className="mt-2 text-3xl font-semibold text-emerald-700">
              {formatPrice(todayRevenueCompleted)}
            </div>
            <div className="mt-2 text-sm text-emerald-700/80">
              Только завершённые заказы
            </div>
          </div>

          <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-sky-600">
              Средний чек сегодня
            </div>
            <div className="mt-2 text-3xl font-semibold text-sky-700">
              {formatPrice(averageCheck)}
            </div>
            <div className="mt-2 text-sm text-sky-700/80">
              По неотменённым заказам
            </div>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-orange-600">
              Активные заказы
            </div>
            <div className="mt-2 text-3xl font-semibold text-orange-700">
              {activeOrdersCount}
            </div>
            <div className="mt-2 text-sm text-orange-700/80">
              NEW, CONFIRMED, PREPARING, DELIVERING
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-black">
                  Последние 7 дней
                </h2>
                <p className="text-sm text-neutral-500">
                  Дневные показатели по заказам и выручке
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="px-3 py-3 font-medium">Дата</th>
                    <th className="px-3 py-3 font-medium">Заказов</th>
                    <th className="px-3 py-3 font-medium">Завершено</th>
                    <th className="px-3 py-3 font-medium">Выручка</th>
                    <th className="px-3 py-3 font-medium">Оборот</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((day) => (
                    <tr key={day.key} className="border-b border-neutral-100">
                      <td className="px-3 py-3 font-medium text-black">
                        {day.label}
                      </td>
                      <td className="px-3 py-3 text-neutral-700">
                        {day.ordersCount}
                      </td>
                      <td className="px-3 py-3 text-neutral-700">
                        {day.completedCount}
                      </td>
                      <td className="px-3 py-3 font-medium text-emerald-700">
                        {formatPrice(day.revenueCompleted)}
                      </td>
                      <td className="px-3 py-3 font-medium text-sky-700">
                        {formatPrice(day.revenueNonCancelled)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-black">
                Сводка по статусам
              </h2>

              <div className="space-y-3">
                {statusSummary.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-neutral-700">
                      {getStatusLabel(item.key)}
                    </span>
                    <span className="text-base font-semibold text-black">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-black">
                Общие показатели
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                  <span className="text-neutral-600">Всего заказов</span>
                  <span className="font-semibold text-black">{orders.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                  <span className="text-neutral-600">Завершённые</span>
                  <span className="font-semibold text-black">
                    {completedOrdersCount}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                  <span className="text-neutral-600">Отменённые</span>
                  <span className="font-semibold text-black">
                    {cancelledOrdersCount}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                  <span className="text-neutral-600">Оборот сегодня</span>
                  <span className="font-semibold text-black">
                    {formatPrice(todayRevenueNonCancelled)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-black">Последние заказы</h2>
            <p className="text-sm text-neutral-500">
              Быстрый обзор последних 10 заказов
            </p>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-2xl bg-neutral-50 px-4 py-4 text-sm text-neutral-500">
              Заказов пока нет
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-neutral-500">
                    <th className="px-3 py-3 font-medium">Номер</th>
                    <th className="px-3 py-3 font-medium">Клиент</th>
                    <th className="px-3 py-3 font-medium">Телефон</th>
                    <th className="px-3 py-3 font-medium">Статус</th>
                    <th className="px-3 py-3 font-medium">Сумма</th>
                    <th className="px-3 py-3 font-medium">Создан</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-100">
                      <td className="px-3 py-3 font-medium text-black">
                        #{order.orderNumber}
                      </td>
                      <td className="px-3 py-3 text-neutral-700">
                        {order.customerName}
                      </td>
                      <td className="px-3 py-3 text-neutral-700">{order.phone}</td>
                      <td className="px-3 py-3 text-neutral-700">
                        {getStatusLabel(order.status)}
                      </td>
                      <td className="px-3 py-3 font-medium text-black">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-3 py-3 text-neutral-700">
                        {new Date(order.createdAt).toLocaleString("ru-RU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}