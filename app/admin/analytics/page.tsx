import { prisma } from "@/lib/prisma";

type AnalyticsOrder = {
  id: string;
  createdAt: Date;
  totalAmount: number;
  status: string;
};

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export default async function AdminAnalyticsPage() {
  const orders: AnalyticsOrder[] = await prisma.order.findMany({
    select: {
      id: true,
      createdAt: true,
      totalAmount: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const todayOrders = orders.filter((order: AnalyticsOrder) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= todayStart && createdAt <= todayEnd;
  });

  const todayRevenue = todayOrders.reduce(
    (sum: number, order: AnalyticsOrder) => sum + order.totalAmount,
    0
  );

  const completedToday = todayOrders.filter(
    (order: AnalyticsOrder) => order.status === "COMPLETED"
  ).length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
          Аналитика
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
          Краткая сводка
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 p-4">
            <div className="text-sm text-neutral-500">Заказов сегодня</div>
            <div className="mt-2 text-2xl font-semibold text-neutral-950">
              {todayOrders.length}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-4">
            <div className="text-sm text-neutral-500">Выручка сегодня</div>
            <div className="mt-2 text-2xl font-semibold text-neutral-950">
              {todayRevenue} ₽
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-4">
            <div className="text-sm text-neutral-500">Завершено сегодня</div>
            <div className="mt-2 text-2xl font-semibold text-neutral-950">
              {completedToday}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}