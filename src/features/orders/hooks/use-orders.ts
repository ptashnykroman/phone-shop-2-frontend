"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/features/orders/api/orders-api";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import type {
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from "@/shared/api/api-types";

export const orderQueryKeys = {
  all: ["orders"] as const,
  my: ["orders", "my"] as const,
  detail: (orderId: string) => ["orders", "detail", orderId] as const,
  adminList: (page: number, limit: number) =>
    ["orders", "admin", page, limit] as const,
};

export function useMyOrdersQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: orderQueryKeys.my,
    queryFn: ordersApi.myOrders,
    enabled: Boolean(accessToken),
  });
}

export function useOrderDetailQuery(orderId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => ordersApi.getById(orderId),
    enabled: Boolean(orderId && accessToken),
  });
}

export function useAdminOrdersQuery(page = 1, limit = 20) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.user?.role);
  return useQuery({
    queryKey: orderQueryKeys.adminList(page, limit),
    queryFn: () => ordersApi.adminList(page, limit),
    enabled: Boolean(accessToken && role === "ADMIN"),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => ordersApi.create(payload),
    onSuccess: async (order) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
        queryClient.setQueryData(orderQueryKeys.detail(order.id), order),
      ]);
    },
  });
}

export function useUpdateOrderStatusMutation(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOrderStatusRequest) =>
      ordersApi.updateStatus(orderId, payload),
    onSuccess: async (order) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
        queryClient.setQueryData(orderQueryKeys.detail(orderId), order),
      ]);
    },
  });
}
