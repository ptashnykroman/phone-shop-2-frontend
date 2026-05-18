"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/features/categories/api/categories-api";
import type { CategoryPayload } from "@/shared/api/api-types";

export const categoryQueryKeys = {
  all: ["categories"] as const,
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoryQueryKeys.all,
    queryFn: categoriesApi.list,
    staleTime: 5 * 60_000,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => categoriesApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
}
