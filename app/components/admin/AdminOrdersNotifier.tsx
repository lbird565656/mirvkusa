"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type LatestOrder = {
  id: string;
  orderNumber: string | number;
  createdAt: string;
  status: string;
} | null;

type LatestOrderResponse = {
  latestOrder: LatestOrder;
};

const POLL_INTERVAL_MS = 10000;

function isNewerOrder(
  nextOrder: NonNullable<LatestOrder>,
  prevOrder: NonNullable<LatestOrder>
) {
  const nextTime = new Date(nextOrder.createdAt).getTime();
  const prevTime = new Date(prevOrder.createdAt).getTime();

  if (nextTime !== prevTime) {
    return nextTime > prevTime;
  }

  return nextOrder.id > prevOrder.id;
}

function playNotificationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.35
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.35);

    void audioContext.close().catch(() => {});
  } catch {
    // ignore audio failures
  }
}

async function fetchLatestOrder(): Promise<LatestOrder> {
  const response = await fetch("/api/admin/orders/latest", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch latest order");
  }

  const data: LatestOrderResponse = await response.json();
  return data.latestOrder;
}

export default function AdminOrdersNotifier() {
  const router = useRouter();

  const [latestKnownOrder, setLatestKnownOrder] = useState<LatestOrder>(null);
  const [unseenCount, setUnseenCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPollingError, setIsPollingError] = useState(false);

  const initializedRef = useRef(false);
  const pollingRef = useRef(false);

  const badgeText = useMemo(() => {
    if (unseenCount <= 0) return null;
    return unseenCount > 99 ? "99+" : String(unseenCount);
  }, [unseenCount]);

  useEffect(() => {
    let isMounted = true;

    const runPoll = async () => {
      if (pollingRef.current) return;
      pollingRef.current = true;

      try {
        const latestOrder = await fetchLatestOrder();

        if (!isMounted) return;

        setIsPollingError(false);

        if (!initializedRef.current) {
          initializedRef.current = true;
          setLatestKnownOrder(latestOrder);
          return;
        }

        if (!latestOrder) return;

        const prevOrder = latestKnownOrder;

        if (!prevOrder) {
          setLatestKnownOrder(latestOrder);
          setUnseenCount((count) => count + 1);

          if (soundEnabled) {
            playNotificationSound();
          }

          router.refresh();
          return;
        }

        if (isNewerOrder(latestOrder, prevOrder)) {
          setLatestKnownOrder(latestOrder);
          setUnseenCount((count) => count + 1);

          if (soundEnabled) {
            playNotificationSound();
          }

          router.refresh();
        }
      } catch (error) {
        console.error("Admin orders polling error:", error);

        if (isMounted) {
          setIsPollingError(true);
        }
      } finally {
        pollingRef.current = false;
      }
    };

    void runPoll();

    const interval = window.setInterval(() => {
      void runPoll();
    }, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [latestKnownOrder, router, soundEnabled]);

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-medium text-black">Мониторинг заказов</p>
          <p className="text-sm text-black/60">
            Проверка новых заказов каждые 10 секунд
          </p>
        </div>

        {badgeText ? (
          <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
            Новые: {badgeText}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-sm text-black/70">
            Новых нет
          </span>
        )}

        {isPollingError ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm text-red-600">
            Ошибка обновления
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setUnseenCount(0)}
          className="rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-black transition hover:bg-black/5"
        >
          Сбросить бейдж
        </button>

        <button
          type="button"
          onClick={() => setSoundEnabled((prev) => !prev)}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            soundEnabled
              ? "bg-orange-500 text-white hover:opacity-90"
              : "border border-black/10 text-black hover:bg-black/5"
          }`}
        >
          {soundEnabled ? "Звук: вкл" : "Звук: выкл"}
        </button>
      </div>
    </div>
  );
}