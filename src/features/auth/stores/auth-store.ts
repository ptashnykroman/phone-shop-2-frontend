"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SafeUser } from "@/shared/api/api-types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: SafeUser | null;
  hydrated: boolean;
  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    user: SafeUser;
  }) => void;
  setUser: (user: SafeUser | null) => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: false,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "phone-shop-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
