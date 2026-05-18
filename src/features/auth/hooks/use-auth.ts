"use client";

import { useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { authApi } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { cartApi } from "@/features/cart/api/cart-api";
import { useCartSessionStore } from "@/features/cart/stores/cart-session-store";
import type { LoginRequest, RegisterRequest } from "@/shared/api/api-types";

export const authQueryKeys = {
  me: ["auth", "me"] as const,
};

export function useAuthSession() {
  return useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      user: state.user,
      hydrated: state.hydrated,
    })),
  );
}

export function useCurrentUserQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const query = useQuery({
    queryKey: authQueryKeys.me,
    queryFn: authApi.me,
    enabled: hydrated && Boolean(accessToken),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.error) {
      clearAuth();
    }
  }, [clearAuth, query.error]);

  return query;
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearSessionId = useCartSessionStore((state) => state.clearSessionId);

  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: async (data) => {
      setAuth(data);
      clearSessionId();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.me }),
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.invalidateQueries({ queryKey: ["favorites"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const sessionId = useCartSessionStore((state) => state.sessionId);
  const clearSessionId = useCartSessionStore((state) => state.clearSessionId);

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: async (data) => {
      setAuth(data);
      if (sessionId) {
        await cartApi.merge({ sessionId }).catch(() => undefined);
        clearSessionId();
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.me }),
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
      ]);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearSessionId = useCartSessionStore((state) => state.clearSessionId);

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      clearAuth();
      clearSessionId();
      await Promise.all([
        queryClient.removeQueries({ queryKey: authQueryKeys.me }),
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.removeQueries({ queryKey: ["favorites"] }),
        queryClient.removeQueries({ queryKey: ["orders"] }),
      ]);
    },
  });
}
