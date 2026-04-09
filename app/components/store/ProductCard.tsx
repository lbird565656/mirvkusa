"use client";

import Button from "@/components/shared/Button";
import { formatPrice } from "@/lib/utils";
import { addToCart } from "@/lib/cart";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || null,
    });
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="h-44 bg-neutral-100" />
      )}

      <div className="p-5">
        <div className="mb-2 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
          {product.category}
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
          {product.name}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-neutral-500">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-xl font-semibold text-neutral-950">
            {formatPrice(product.price)}
          </div>

          <Button className="h-11 rounded-full px-5" onClick={handleAddToCart}>
            В корзину
          </Button>
        </div>
      </div>
    </article>
  );
}