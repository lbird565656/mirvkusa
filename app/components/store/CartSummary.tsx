"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { getCartTotal, getCartCount } from "@/lib/cart";

export default function CartSummary() {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCart() {
      setTotal(getCartTotal());
      setCount(getCartCount());
    }

    updateCart();
    window.addEventListener("cart-updated", updateCart);

    return () => {
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  return (
    <aside className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
        Корзина
      </div>

      <div className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
        {total} ₽
      </div>

      <div className="mt-1 text-sm text-neutral-500">
        {count} {count === 1 ? "товар" : count >= 2 && count <= 4 ? "товара" : "товаров"}
      </div>

      <div className="mt-4 rounded-2xl bg-neutral-50 px-4 py-4 text-sm leading-6 text-neutral-500">
        Проверяйте состав заказа и переходите к оформлению, когда всё готово.
      </div>

      <div className="mt-5">
        <Link href="/cart" className="block">
          <Button className="h-12 w-full rounded-full">Открыть корзину</Button>
        </Link>
      </div>
    </aside>
  );
}