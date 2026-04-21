import type { CartItemViewModel } from "../models/CartItemViewModel";

const CART_STORAGE_KEY = "music-commerce-cart-items";
const CART_UPDATED_EVENT = "music-commerce-cart-updated";

export const getCartItems = (): CartItemViewModel[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawItems = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!rawItems) {
    return [];
  }

  try {
    const parsedItems = JSON.parse(rawItems) as CartItemViewModel[];
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
};

export const setCartItems = (items: CartItemViewModel[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const upsertCartItem = (item: CartItemViewModel) => {
  const currentItems = getCartItems();
  const existingIndex = currentItems.findIndex(
    (currentItem) =>
      currentItem.audioId === item.audioId &&
      currentItem.licenseId === item.licenseId,
  );

  if (existingIndex >= 0) {
    currentItems[existingIndex] = {
      ...currentItems[existingIndex],
      ...item,
    };
  } else {
    currentItems.unshift(item);
  }

  setCartItems(currentItems);
  return currentItems;
};

export const removeCartItem = (cartItemId: number) => {
  const nextItems = getCartItems().filter(
    (item) => item.cartItemId !== cartItemId,
  );

  setCartItems(nextItems);
  return nextItems;
};

export const clearCartItems = () => {
  setCartItems([]);
};

export const getCartItemsCount = () => getCartItems().length;

export const CART_ITEMS_UPDATED_EVENT = CART_UPDATED_EVENT;