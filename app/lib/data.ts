export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
  };
  
  export const categories = ["Все", "Роллы", "Сеты", "Суши", "Напитки"];
  
  export const products: Product[] = [
    {
      id: 1,
      name: "Филадельфия",
      description: "Лосось, сливочный сыр, рис",
      price: 590,
      category: "Роллы",
    },
    {
      id: 2,
      name: "Калифорния",
      description: "Краб, огурец, икра масаго",
      price: 490,
      category: "Роллы",
    },
    {
      id: 3,
      name: "Сет Премиум",
      description: "Большой набор на компанию",
      price: 1690,
      category: "Сеты",
    },
    {
      id: 4,
      name: "Нигири с лососем",
      description: "2 шт.",
      price: 250,
      category: "Суши",
    },
  ];