"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareState {
  productIds: string[];
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addProduct: (productId) => {
        const current = get().productIds;
        if (current.includes(productId) || current.length >= 4) {
          return;
        }
        set({ productIds: [...current, productId] });
      },
      removeProduct: (productId) =>
        set({
          productIds: get().productIds.filter((id) => id !== productId),
        }),
      clear: () => set({ productIds: [] }),
    }),
    {
      name: "phone-shop-compare",
      partialize: (state) => ({ productIds: state.productIds }),
    },
  ),
);
