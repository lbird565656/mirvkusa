export type BusinessScheduleItem = {
  label: string;
  hours: string;
};

export type BusinessInfo = {
  name: string;
  phoneRaw: string;
  phoneDisplay: string;
  phoneHref: string;
  city: string;
  country: string;
  address: string;
  schedule: BusinessScheduleItem[];
};

export const businessInfo: BusinessInfo = {
  name: "Мир Вкуса",
  phoneRaw: "8904116122",
  phoneDisplay: "8 904 116 12 22",
  phoneHref: "tel:+79041161222",
  city: "Бодайбо",
  country: "Россия",
  address: "ул. Артема Сергеева, 82А, Бодайбо",
  schedule: [
    { label: "Будни", hours: "11:00–21:00" },
    { label: "Пятница", hours: "11:00–22:00" },
    { label: "Суббота", hours: "12:00–22:00" },
    { label: "Воскресенье", hours: "12:00–21:00" },
  ],
};