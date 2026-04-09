"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCartCount } from "@/lib/cart";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/menu", label: "Меню" },
  { href: "/cart", label: "Корзина" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function refreshCart() {
      setCartCount(getCartCount());
    }

    refreshCart();
    window.addEventListener("cart-updated", refreshCart);

    return () => {
      window.removeEventListener("cart-updated", refreshCart);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0">
          <div className="text-base font-semibold tracking-tight text-neutral-950 sm:text-lg">
            Мир Вкуса
          </div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">
            Бодайбо
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-50 text-orange-700"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contacts"
            className="hidden h-11 items-center justify-center rounded-full border border-neutral-300 px-4 text-sm font-medium text-neutral-950 sm:inline-flex"
          >
            Связаться с нами
          </Link>

          <Link
            href="/cart"
            className="inline-flex h-11 items-center justify-center rounded-full bg-orange-500 px-4 text-sm font-medium text-white"
          >
            Корзина{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
        </div>
      </div>

      <div className="border-t border-neutral-200 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-50 text-orange-700"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}