import Link from "next/link";

const footerLinks = [
  { href: "/menu", label: "Меню" },
  { href: "/cart", label: "Корзина" },
  { href: "/contacts", label: "Контакты" },
  { href: "/admin", label: "Админ" },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="text-lg font-semibold tracking-tight text-neutral-950">
              Мир Вкуса
            </div>
            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Доставка роллов, закусок, салатов, горячих блюд и напитков в
              Бодайбо.
            </p>

            <div className="mt-4 space-y-1 text-sm text-neutral-600">
              <div>
                Телефон:{" "}
                <a
                  href="tel:89041161222"
                  className="font-medium text-neutral-950 hover:text-orange-600"
                >
                  8-904-116-12-22
                </a>
              </div>
              <div>Адрес: ул. Артёма Сергеева, 82 «А»</div>
              <div>Формат: доставка и самовывоз</div>
            </div>
          </div>

          <div className="grid gap-2">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-700 hover:text-orange-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-4 text-xs text-neutral-400">
          © Мир Вкуса
        </div>
      </div>
    </footer>
  );
}