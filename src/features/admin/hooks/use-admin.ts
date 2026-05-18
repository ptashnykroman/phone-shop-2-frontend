"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/admin-api";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import type { UserListQuery } from "@/shared/api/api-types";

export const adminQueryKeys = {
  overview: ["admin", "overview"] as const,
  users: (query: UserListQuery) => ["admin", "users", query] as const,
};

export function useAdminOverviewQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.user?.role);
  return useQuery({
    queryKey: adminQueryKeys.overview,
    queryFn: adminApi.overview,
    enabled: Boolean(accessToken && role === "ADMIN"),
  });
}

export function useAdminUsersQuery(query: UserListQuery = {}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.user?.role);
  return useQuery({
    queryKey: adminQueryKeys.users(query),
    queryFn: () => adminApi.users(query),
    enabled: Boolean(accessToken && role === "ADMIN"),
  });
}
