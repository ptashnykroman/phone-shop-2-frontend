"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartSessionState {
  sessionId: string | null;
  hydrated: boolean;
  setSessionId: (sessionId: string | null) => void;
  clearSessionId: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useCartSessionStore = create<CartSessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      hydrated: false,
      setSessionId: (sessionId) => set({ sessionId }),
      clearSessionId: () => set({ sessionId: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "phone-shop-cart-session",
      partialize: (state) => ({
        sessionId: state.sessionId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
