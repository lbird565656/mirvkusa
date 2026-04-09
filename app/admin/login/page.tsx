"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!password) {
      alert("Введите пароль");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Ошибка входа: ${text}`);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      alert(`Ошибка входа: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Вход в админ-панель</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Введите пароль администратора
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3"
          />

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </div>
      </div>
    </main>
  );
}