"use client";

import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">) => void;

  removeItem: (id: string) => void;

  clearCart: () => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                }
              : i
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity: 1,
          },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clearCart: () =>
    set({
      items: [],
    }),

  increaseQuantity: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      ),
    })),

  decreaseQuantity: (id) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),
}));