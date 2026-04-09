"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/shared/Button";
import { getCart, getCartTotal, clearCart } from "@/lib/cart";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

type FieldErrors = {
  name?: string;
  phone?: string;
  address?: string;
};

type FulfillmentType = "DELIVERY" | "PICKUP";

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    return `7${digits.slice(1, 11)}`;
  }

  if (digits.startsWith("7")) {
    return digits.slice(0, 11);
  }

  if (digits.length === 10) {
    return `7${digits}`;
  }

  return digits.slice(0, 11);
}

function formatPhone(raw: string) {
  const normalized = normalizePhone(raw);

  if (!normalized) return "";

  const d = normalized;
  let result = "+7";

  if (d.length > 1) result += ` (${d.slice(1, 4)}`;
  if (d.length >= 4) result += ")";
  if (d.length > 4) result += ` ${d.slice(4, 7)}`;
  if (d.length > 7) result += `-${d.slice(7, 9)}`;
  if (d.length > 9) result += `-${d.slice(9, 11)}`;

  return result;
}

function validateName(name: string) {
  const value = name.trim();

  if (!value) return "Введите имя";
  if (value.length < 2) return "Имя слишком короткое";
  if (value.length > 60) return "Имя слишком длинное";
  if (!/^[A-Za-zА-Яа-яЁё\s'-]+$/.test(value)) {
    return "Имя должно содержать только буквы";
  }

  return "";
}

function validatePhone(phone: string) {
  const normalized = normalizePhone(phone);

  if (!normalized) return "Введите номер телефона";
  if (!/^7\d{10}$/.test(normalized)) {
    return "Введите корректный номер телефона";
  }

  return "";
}

function validateAddress(address: string, fulfillmentType: FulfillmentType) {
  if (fulfillmentType === "PICKUP") return "";

  const value = address.trim();

  if (!value) return "Введите адрес";
  if (value.length < 8) return "Адрес слишком короткий";
  if (value.length > 160) return "Адрес слишком длинный";

  return "";
}

function ProductPreview({ item }: { item: CartItem }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-4">
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold text-neutral-950">{item.name}</div>
              <div className="mt-1 text-sm text-neutral-500">
                {item.quantity} × {item.price} ₽
              </div>
            </div>

            <div className="shrink-0 text-sm font-semibold text-neutral-950">
              {item.quantity * item.price} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("DELIVERY");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setCart(getCart());
    setTotal(getCartTotal());
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  function generateOrderId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function validateForm() {
    const nextErrors: FieldErrors = {
      name: validateName(name),
      phone: validatePhone(phone),
      address: validateAddress(address, fulfillmentType),
    };

    Object.keys(nextErrors).forEach((key) => {
      const typedKey = key as keyof FieldErrors;
      if (!nextErrors[typedKey]) {
        delete nextErrors[typedKey];
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (cart.length === 0) {
      alert("Корзина пустая");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const id = generateOrderId();

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: id,
          name: name.trim(),
          phone: normalizePhone(phone),
          fulfillmentType,
          address: fulfillmentType === "DELIVERY" ? address.trim() : null,
          comment: comment.trim(),
          total,
          items: cart,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Ошибка при сохранении заказа: ${text}`);
        return;
      }

      setOrderId(id);
      clearCart();
    } catch (error) {
      alert(`Ошибка при сохранении заказа: ${String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function inputClass(hasError?: string) {
    return `w-full rounded-2xl border px-4 py-3 outline-none transition ${
      hasError
        ? "border-red-400 bg-red-50"
        : "border-neutral-200 bg-white focus:border-orange-400"
    }`;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
            Оформление заказа
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
            Подтверждение заказа
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Проверьте состав заказа и заполните контактные данные. После
            подтверждения вы получите номер заказа, затем с вами свяжется оператор.
          </p>
        </div>

        {orderId ? (
          <div className="mt-8 rounded-[28px] border border-orange-200 bg-orange-50 p-6">
            <div className="text-xl font-semibold text-neutral-950">
              Ваш заказ принят
            </div>

            <div className="mt-3 text-sm text-neutral-700">
              Номер заказа: <span className="font-semibold">{orderId}</span>
            </div>

            <div className="mt-3 text-sm text-neutral-700">
              {fulfillmentType === "PICKUP"
                ? "Заказ оформлен на самовывоз. Пожалуйста, дождитесь звонка оператора."
                : "Пожалуйста, свяжитесь с оператором для подтверждения заказа."}
            </div>

            <div className="mt-3 text-sm text-neutral-700">
              Телефон: +7 (000) 000-00-00
            </div>

            <div className="mt-6">
              <Button
                className="h-12 rounded-full px-6"
                onClick={() => (window.location.href = "/menu")}
              >
                Вернуться в меню
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <section className="rounded-[28px] bg-neutral-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-lg font-semibold text-neutral-950">
                  Ваш заказ
                </div>
                <div className="text-sm text-neutral-500">
                  {cartCount}{" "}
                  {cartCount === 1
                    ? "позиция"
                    : cartCount >= 2 && cartCount <= 4
                    ? "позиции"
                    : "позиций"}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="mt-4 text-neutral-500">Корзина пустая</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {cart.map((item) => (
                    <ProductPreview key={item.id} item={item} />
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
                <div className="text-sm text-neutral-500">Итого</div>
                <div className="text-xl font-semibold text-neutral-950">
                  {total} ₽
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-neutral-200 bg-white p-5">
              <div className="text-lg font-semibold text-neutral-950">
                Контактные данные
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Укажите данные для подтверждения заказа.
              </p>

              <div className="mt-4">
                <div className="mb-2 block text-sm font-medium text-neutral-700">
                  Способ получения
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType("DELIVERY")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      fulfillmentType === "DELIVERY"
                        ? "border-orange-300 bg-orange-50 text-orange-700"
                        : "border-neutral-200 bg-white text-neutral-700"
                    }`}
                  >
                    Доставка
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType("PICKUP")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      fulfillmentType === "PICKUP"
                        ? "border-orange-300 bg-orange-50 text-orange-700"
                        : "border-neutral-200 bg-white text-neutral-700"
                    }`}
                  >
                    Самовывоз
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Имя
                  </label>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors((prev) => ({
                          ...prev,
                          name: validateName(e.target.value) || undefined,
                        }));
                      }
                    }}
                    placeholder="Например: Анна"
                    autoComplete="name"
                    className={inputClass(errors.name)}
                  />
                  {errors.name ? (
                    <div className="mt-2 text-sm text-red-500">{errors.name}</div>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Телефон
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setPhone(formatted);
                      if (errors.phone) {
                        setErrors((prev) => ({
                          ...prev,
                          phone: validatePhone(formatted) || undefined,
                        }));
                      }
                    }}
                    placeholder="+7 (900) 000-00-00"
                    autoComplete="tel"
                    inputMode="tel"
                    className={inputClass(errors.phone)}
                  />
                  {errors.phone ? (
                    <div className="mt-2 text-sm text-red-500">{errors.phone}</div>
                  ) : null}
                </div>

                {fulfillmentType === "DELIVERY" ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Адрес доставки
                    </label>
                    <input
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) {
                          setErrors((prev) => ({
                            ...prev,
                            address:
                              validateAddress(e.target.value, fulfillmentType) ||
                              undefined,
                          }));
                        }
                      }}
                      placeholder="Улица, дом, квартира"
                      autoComplete="street-address"
                      className={inputClass(errors.address)}
                    />
                    {errors.address ? (
                      <div className="mt-2 text-sm text-red-500">
                        {errors.address}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-500">
                    Вы выбрали самовывоз. Адрес доставки не требуется.
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Комментарий
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Например: без васаби, домофон не работает"
                    className="min-h-[120px] w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-orange-400"
                  />
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-500">
                  Нажимая кнопку подтверждения, вы отправляете заказ оператору для
                  дальнейшего подтверждения по телефону.
                </div>

                <Button
                  className="h-12 w-full rounded-full"
                  onClick={handleSubmit}
                  type="button"
                >
                  {isSubmitting ? "Сохраняем заказ..." : "Подтвердить заказ"}
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}