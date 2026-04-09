"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/shared/Button";
import { getCart, getCartTotal, clearCart } from "@/lib/cart";
import { businessInfo } from "@/lib/business";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const data = getCart();
    setCart(data);
    setTotal(getCartTotal());
  }, []);

  function generateOrderId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async function handleSubmit() {
    if (!name || !phone || !address) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (cart.length === 0) {
      alert("Корзина пустая");
      return;
    }

    const id = generateOrderId();

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNumber: id,
        name,
        phone,
        address,
        comment,
        total,
        items: cart,
      }),
    });

    if (!res.ok) {
      alert("Ошибка при сохранении заказа");
      return;
    }

    setOrderId(id);
    clearCart();
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-semibold">Оформление заказа</h1>

        {orderId ? (
          <div className="mt-8 rounded-3xl border border-orange-200 bg-orange-50 p-6">
            <div className="text-xl font-semibold">Ваш заказ принят</div>

            <div className="mt-3 text-sm">
              Номер заказа: <span className="font-semibold">{orderId}</span>
            </div>

            <div className="mt-3 text-sm">
              Для подтверждения заказа дождитесь звонка оператора или свяжитесь
              с нами по телефону.
            </div>

            <div className="mt-4 text-sm">
              Телефон:{" "}
              <a
                href={businessInfo.phoneHref}
                className="font-semibold text-black underline-offset-2 hover:underline"
              >
                {businessInfo.phoneDisplay}
              </a>
            </div>

            <div className="mt-2 text-sm text-neutral-700">
              Адрес: {businessInfo.address}
            </div>

            <div className="mt-6">
              <Button onClick={() => (window.location.href = "/menu")}>
                Вернуться в меню
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="text-lg font-semibold">Ваш заказ</div>

              {cart.length === 0 ? (
                <div className="text-neutral-500">Корзина пустая</div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between rounded-2xl border border-neutral-200 p-4"
                  >
                    <div>
                      <div>{item.name}</div>
                      <div className="text-sm text-neutral-500">
                        {item.quantity} × {item.price} ₽
                      </div>
                    </div>

                    <div className="font-medium">
                      {item.quantity * item.price} ₽
                    </div>
                  </div>
                ))
              )}

              <div className="flex justify-between border-t pt-4">
                <div>Итого</div>
                <div className="font-semibold">{total} ₽</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-lg font-semibold">Данные клиента</div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Телефон"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
              />

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Адрес"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
              />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
              />

              <div className="rounded-2xl bg-neutral-50 px-4 py-4 text-sm text-neutral-600">
                После оформления заказа мы свяжемся с вами для подтверждения.
              </div>

              <Button className="w-full" onClick={handleSubmit}>
                Подтвердить заказ
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}