

const schedule = [
  { label: "Будни", value: "11:00–21:00" },
  { label: "Пятница", value: "11:00–22:00" },
  { label: "Суббота", value: "12:00–22:00" },
  { label: "Воскресенье", value: "12:00–21:00" },
];

export default function ContactsPage() {
  return (
    <>

      <main className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Контакты
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
              Связаться с нами
            </h1>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-400">Телефон</div>
                <a
                  href="tel:89041161222"
                  className="mt-1 block text-base font-semibold text-neutral-950 hover:text-orange-600"
                >
                  8-904-116-12-22
                </a>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-400">Адрес</div>
                <div className="mt-1 text-base font-semibold text-neutral-950">
                  ул. Артёма Сергеева, 82 «А»
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-400">Формат</div>
                <div className="mt-1 text-base font-semibold text-neutral-950">
                  Доставка и самовывоз
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Время работы
            </div>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
              Когда можно заказать
            </h2>

            <div className="mt-6 space-y-2">
              {schedule.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3"
                >
                  <span className="text-sm text-neutral-500">{item.label}</span>
                  <span className="text-sm font-semibold text-neutral-950">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

    </>
  );
}