"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/features/cart/api/cart-api";
import type {
  AddCartItemRequest,
  UpdateCartItemRequest,
} from "@/shared/api/api-types";

export const cartQueryKeys = {
  current: ["cart"] as const,
};

export function useCartQuery() {
  return useQuery({
    queryKey: cartQueryKeys.current,
    queryFn: cartApi.getCart,
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddCartItemRequest) => cartApi.addItem(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartQueryKeys.current });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdateCartItemRequest;
    }) => cartApi.updateItem(itemId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartQueryKeys.current });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartQueryKeys.current });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartQueryKeys.current });
    },
  });
}
