"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  featuredOrder: number;
};

type Props = {
  initialProducts: Product[];
};

const PRODUCT_CATEGORIES = [
  "Роллы",
  "Сеты",
  "Суши",
  "Закуски",
  "Салаты",
  "Горячие блюда",
  "Напитки",
  "Другое",
];

export default function ProductManager({ initialProducts }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Роллы");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState("0");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("Роллы");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editFeaturedOrder, setEditFeaturedOrder] = useState("0");

  async function handleCreate() {
    if (!name.trim() || !description.trim() || !price.trim()) {
      alert("Заполните название, описание и цену");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          category,
          imageUrl: imageUrl.trim(),
          isFeatured,
          featuredOrder: Number(featuredOrder || 0),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Ошибка при создании товара: ${text}`);
        return;
      }

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Роллы");
      setImageUrl("");
      setIsFeatured(false);
      setFeaturedOrder("0");
      router.refresh();
    } catch (error) {
      alert(`Ошибка при создании товара: ${String(error)}`);
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditPrice(String(product.price));
    setEditCategory(
      PRODUCT_CATEGORIES.includes(product.category) ? product.category : "Другое"
    );
    setEditImageUrl(product.imageUrl || "");
    setEditIsAvailable(product.isAvailable);
    setEditIsFeatured(product.isFeatured);
    setEditFeaturedOrder(String(product.featuredOrder ?? 0));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditCategory("Роллы");
    setEditImageUrl("");
    setEditIsAvailable(true);
    setEditIsFeatured(false);
    setEditFeaturedOrder("0");
  }

  async function handleUpdate(id: string) {
    if (!editName.trim() || !editDescription.trim() || !editPrice.trim()) {
      alert("Заполните название, описание и цену");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
          price: Number(editPrice),
          category: editCategory,
          imageUrl: editImageUrl.trim(),
          isAvailable: editIsAvailable,
          isFeatured: editIsFeatured,
          featuredOrder: Number(editFeaturedOrder || 0),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Ошибка при обновлении товара: ${text}`);
        return;
      }

      cancelEdit();
      router.refresh();
    } catch (error) {
      alert(`Ошибка при обновлении товара: ${String(error)}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setIsDeleting(id);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Ошибка при удалении товара: ${text}`);
        return;
      }

      router.refresh();
    } catch (error) {
      alert(`Ошибка при удалении товара: ${String(error)}`);
    } finally {
      setIsDeleting(null);
    }
  }

  async function toggleAvailability(product: Product) {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl || "",
          isAvailable: !product.isAvailable,
          isFeatured: product.isFeatured,
          featuredOrder: product.featuredOrder ?? 0,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Ошибка при обновлении доступности: ${text}`);
        return;
      }

      router.refresh();
    } catch (error) {
      alert(`Ошибка при обновлении доступности: ${String(error)}`);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <div className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-400">
            Новый товар
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
            Добавить позицию в меню
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
          >
            {PRODUCT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
            type="number"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Ссылка на изображение (URL)"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 sm:col-span-2"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Показывать в популярных
          </label>

          <input
            value={featuredOrder}
            onChange={(e) => setFeaturedOrder(e.target.value)}
            placeholder="Порядок в популярных (0,1,2...)"
            type="number"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={isSaving}
          className="mt-4 h-12 rounded-full bg-orange-500 px-6 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSaving ? "Сохранение..." : "Добавить товар"}
        </button>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4 sm:px-6">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Товары в меню
          </h2>
        </div>

        {initialProducts.length === 0 ? (
          <div className="px-5 py-8 text-neutral-600 sm:px-6">
            Товаров пока нет
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {initialProducts.map((product) => {
              const isEditing = editingId === product.id;

              return (
                <div key={product.id} className="px-5 py-5 sm:px-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Название"
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
                        />

                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
                        >
                          {PRODUCT_CATEGORIES.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>

                        <input
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          placeholder="Цена"
                          type="number"
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
                        />

                        <input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Описание"
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
                        />

                        <input
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          placeholder="Ссылка на изображение (URL)"
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 sm:col-span-2"
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex items-center gap-2 text-sm text-neutral-700">
                          <input
                            type="checkbox"
                            checked={editIsAvailable}
                            onChange={(e) => setEditIsAvailable(e.target.checked)}
                          />
                          Показывать в меню
                        </label>

                        <label className="flex items-center gap-2 text-sm text-neutral-700">
                          <input
                            type="checkbox"
                            checked={editIsFeatured}
                            onChange={(e) => setEditIsFeatured(e.target.checked)}
                          />
                          Показывать в популярных
                        </label>

                        <input
                          value={editFeaturedOrder}
                          onChange={(e) => setEditFeaturedOrder(e.target.value)}
                          placeholder="Порядок в популярных"
                          type="number"
                          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 sm:col-span-2"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdate(product.id)}
                          disabled={isSaving}
                          className="h-11 rounded-full bg-orange-500 px-5 text-sm font-medium text-white disabled:opacity-50"
                        >
                          Сохранить
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="h-11 rounded-full border border-neutral-300 px-5 text-sm font-medium"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-neutral-950">
                            {product.name}
                          </h3>
                          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                            {product.category}
                          </span>
                          <button
                            onClick={() => toggleAvailability(product)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              product.isAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-neutral-200 text-neutral-700"
                            }`}
                          >
                            {product.isAvailable ? "Доступен" : "Скрыт"}
                          </button>
                          {product.isFeatured ? (
                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                              Популярное #{product.featuredOrder}
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                          {product.description}
                        </p>

                        <div className="mt-3 text-sm font-semibold text-neutral-950">
                          {product.price} ₽
                        </div>

                        {product.imageUrl ? (
                          <div className="mt-2 truncate text-xs text-neutral-400">
                            {product.imageUrl}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                        <button
                          onClick={() => startEdit(product)}
                          className="h-11 rounded-full border border-neutral-300 px-5 text-sm font-medium"
                        >
                          Изменить
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting === product.id}
                          className="h-11 rounded-full bg-black px-5 text-sm font-medium text-white disabled:opacity-50"
                        >
                          {isDeleting === product.id ? "Удаление..." : "Удалить"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}