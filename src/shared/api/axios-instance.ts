"use client";

import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { AuthResponse } from "@/shared/api/api-types";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useCartSessionStore } from "@/features/cart/stores/cart-session-store";
import { API_BASE_URL } from "@/shared/lib/env";

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
});

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<AuthResponse | null> | null = null;

function shouldSkipRefresh(url?: string) {
  return (
    !url ||
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh")
  );
}

async function refreshSession() {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    useAuthStore.getState().clearAuth();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<AuthResponse>("/auth/refresh", { refreshToken })
      .then((response) => {
        useAuthStore.getState().setAuth(response.data);
        return response.data;
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const { accessToken } = useAuthStore.getState();
  const { sessionId } = useCartSessionStore.getState();

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (sessionId) {
    config.headers.set("x-session-id", sessionId);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const sessionId = response.data?.sessionId;
    if (typeof sessionId === "string" && sessionId.trim().length > 0) {
      useCartSessionStore.getState().setSessionId(sessionId);
    }

    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url) ||
      typeof window === "undefined"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshed = await refreshSession();

    if (!refreshed?.accessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.set("Authorization", `Bearer ${refreshed.accessToken}`);
    return api(originalRequest);
  },
);
