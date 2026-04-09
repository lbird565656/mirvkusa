import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: true;
  };
}>;

export default async function AdminOrdersPage() {
  const orders: OrderWithItems[] = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-neutral-950">
        Заказы
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
          Заказов пока нет
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="grid gap-4 bg-neutral-50 px-4 py-4 text-sm md:grid-cols-6">
                <div>
                  <div className="text-xs text-neutral-500">Номер</div>
                  <div className="font-medium">{order.orderNumber}</div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500">Клиент</div>
                  <div className="font-medium">{order.customerName}</div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500">Телефон</div>
                  <div className="font-medium">{order.phone}</div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500">Сумма</div>
                  <div className="font-medium">{order.totalAmount} ₽</div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500">Способ</div>
                  <div className="font-medium">
                    {order.fulfillmentType === "PICKUP" ? "Самовывоз" : "Доставка"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500">Статус</div>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>
              </div>

              <div className="border-t border-neutral-200 px-4 py-4">
                <div className="mb-3 text-sm font-semibold">Состав заказа</div>

                {order.items.length === 0 ? (
                  <div className="text-sm text-neutral-500">Нет позиций</div>
                ) : (
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3 text-sm"
                      >
                        <div>
                          <div className="font-medium">{item.nameSnapshot}</div>
                          <div className="text-neutral-500">
                            {item.quantity} × {item.priceSnapshot} ₽
                          </div>
                        </div>

                        <div className="font-medium">
                          {item.quantity * item.priceSnapshot} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid gap-2 text-sm text-neutral-700 md:grid-cols-2">
                  <div>
                    <span className="text-neutral-500">Адрес:</span>{" "}
                    {order.fulfillmentType === "PICKUP"
                      ? "Самовывоз"
                      : order.address || "—"}
                  </div>

                  <div>
                    <span className="text-neutral-500">Комментарий:</span>{" "}
                    {order.comment || "—"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}