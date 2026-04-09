"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@prisma/client";

type OrderStatusSelectProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "NEW", label: "Новый" },
  { value: "CONFIRMED", label: "Подтверждён" },
  { value: "PREPARING", label: "Готовится" },
  { value: "DELIVERING", label: "В пути" },
  { value: "COMPLETED", label: "Завершён" },
  { value: "CANCELLED", label: "Отменён" },
];

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "NEW":
      return "border-orange-200 bg-orange-50 text-orange-700 focus:border-orange-500";
    case "CONFIRMED":
      return "border-sky-200 bg-sky-50 text-sky-700 focus:border-sky-500";
    case "PREPARING":
      return "border-amber-200 bg-amber-50 text-amber-700 focus:border-amber-500";
    case "DELIVERING":
      return "border-violet-200 bg-violet-50 text-violet-700 focus:border-violet-500";
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 focus:border-emerald-500";
    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700 focus:border-rose-500";
    default:
      return "border-neutral-300 bg-white text-black focus:border-orange-500";
  }
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const selectClassName = useMemo(() => {
    return getStatusClasses(status);
  }, [status]);

  async function handleChange(nextStatus: OrderStatus) {
    const previousStatus = status;

    setStatus(nextStatus);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      if (!response.ok) {
        setStatus(previousStatus);
        setError("Не удалось обновить статус");
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setStatus(previousStatus);
      setError("Не удалось обновить статус");
    }
  }

  return (
    <div className="space-y-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={isPending}
        className={`w-full rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition ${selectClassName} ${isPending ? "opacity-70" : ""}`}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="text-black">
            {option.label}
          </option>
        ))}
      </select>

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}