"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  productIds: string[];
  productNames: Record<string, string>;
  addProduct: (productId: string, productName?: string) => void;
  removeProduct: (productId: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],
      productNames: {},
      addProduct: (productId, productName) => {
        const current = get().productIds;
        const currentNames = get().productNames;

        if (current.includes(productId)) {
          if (
            productName &&
            currentNames[productId] !== productName
          ) {
            set({
              productNames: {
                ...currentNames,
                [productId]: productName,
              },
            });
          }
          return;
        }

        if (current.length >= 4) {
          return;
        }

        set({
          productIds: [...current, productId],
          productNames: productName
            ? {
                ...currentNames,
                [productId]: productName,
              }
            : currentNames,
        });
      },
      removeProduct: (productId) =>
        set({
          productIds: get().productIds.filter((id) => id !== productId),
          productNames: Object.fromEntries(
            Object.entries(get().productNames).filter(([id]) => id !== productId),
          ),
        }),
      clear: () => set({ productIds: [], productNames: {} }),
    }),
    {
      name: "phone-shop-compare",
      partialize: (state) => ({
        productIds: state.productIds,
        productNames: state.productNames,
      }),
    },
  ),
);
