import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "./mock-data";

export const STORAGE_KEYS = {
  PRODUCTS: "skilled_forge_products",
  CATEGORIES: "skilled_forge_categories",
  ORDERS: "skilled_forge_orders",
  USER: "skilled_forge_user",
  USERS: "skilled_forge_registered_users",
  CART: "skilled-forge-cart", // Keeping current cart key
};

export const initStorage = () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MOCK_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    // Initial admin user for testing
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id: "u-1", name: "Admin", email: "admin@example.com", password: "password", role: "ADMIN" }
    ]));
  }
};

export const getStorageData = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

export const setStorageData = <T>(key: string, data: T) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};
