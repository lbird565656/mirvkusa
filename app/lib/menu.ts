export type MenuProduct = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string | null;
  };
  
  export type MenuSection = {
    id: string;
    label: string;
    categoryValues: string[];
  };
  
  export const MENU_SECTIONS: MenuSection[] = [
    {
      id: "rolls",
      label: "Роллы",
      categoryValues: ["Холодные", "Темпура", "Запеченные"],
    },
    {
      id: "snacks",
      label: "Закуски",
      categoryValues: ["Закуски"],
    },
    {
      id: "salads",
      label: "Салаты",
      categoryValues: ["Салаты"],
    },
    {
      id: "hot",
      label: "Горячие блюда",
      categoryValues: ["Горячие блюда"],
    },
  ];
  
  export function normalizeText(value: string) {
    return value.trim().toLowerCase();
  }
  
  export function matchesCategory(productCategory: string, expected: string) {
    return normalizeText(productCategory) === normalizeText(expected);
  }