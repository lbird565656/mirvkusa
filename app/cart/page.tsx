"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";
import {
  getCart,
  getCartTotal,
  increaseCartItem,
  decreaseCartItem,
  removeFromCart,
} from "@/lib/cart";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

function CartPreview({ item }: { item: CartItem }) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-4">
      <div className="flex gap-4">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
            Фото
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-base font-semibold text-neutral-950">
                {item.name}
              </div>
              <div className="mt-1 text-sm text-neutral-500">
                {item.price} ₽ за штуку
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-neutral-200">
                <button
                  onClick={() => decreaseCartItem(item.id)}
                  className="px-4 py-2 text-sm"
                >
                  −
                </button>

                <div className="px-3 py-2 text-sm font-medium">
                  {item.quantity}
                </div>

                <button
                  onClick={() => increaseCartItem(item.id)}
                  className="px-4 py-2 text-sm"
                >
                  +
                </button>
              </div>

              <div className="min-w-[88px] text-right text-sm font-semibold text-neutral-950">
                {item.price * item.quantity} ₽
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm font-medium text-red-500"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  function refreshCart() {
    setCart(getCart());
    setTotal(getCartTotal());
  }

  useEffect(() => {
    refreshCart();

    window.addEventListener("cart-updated", refreshCart);
    return () => window.removeEventListener("cart-updated", refreshCart);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Корзина
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
              Проверьте заказ
            </h1>
          </div>

          <Link
            href="/menu"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Вернуться в меню
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-neutral-50 p-6 text-neutral-600">
            Корзина пустая
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {cart.map((item) => (
                <CartPreview key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-6 rounded-[24px] bg-neutral-50 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-500">Итого</div>
                <div className="text-2xl font-semibold text-neutral-950">
                  {total} ₽
                </div>
              </div>

              <div className="mt-4">
                <Link href="/order" className="block">
                  <Button className="h-12 w-full rounded-full">
                    Оформить заказ
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}