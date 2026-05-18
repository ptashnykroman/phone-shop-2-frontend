"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { characteristicsApi } from "@/features/characteristics/api/characteristics-api";
import type { ProductSpecificationInput } from "@/shared/api/api-types";

export const characteristicQueryKeys = {
  list: (productId: string) => ["characteristics", productId] as const,
};

export function useProductCharacteristicsQuery(productId: string) {
  return useQuery({
    queryKey: characteristicQueryKeys.list(productId),
    queryFn: () => characteristicsApi.list(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateCharacteristicMutation(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductSpecificationInput) =>
      characteristicsApi.create(productId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: characteristicQueryKeys.list(productId),
      });
    },
  });
}

export function useUpdateCharacteristicMutation(
  productId: string,
  characteristicId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ProductSpecificationInput>) =>
      characteristicsApi.update(productId, characteristicId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: characteristicQueryKeys.list(productId),
      });
    },
  });
}

export function useDeleteCharacteristicMutation(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (characteristicId: string) =>
      characteristicsApi.remove(productId, characteristicId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: characteristicQueryKeys.list(productId),
      });
    },
  });
}
