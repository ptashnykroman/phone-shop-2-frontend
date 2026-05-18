"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { brandsApi } from "@/features/brands/api/brands-api";
import type { BrandPayload } from "@/shared/api/api-types";

export const brandQueryKeys = {
  all: ["brands"] as const,
};

export function useBrandsQuery() {
  return useQuery({
    queryKey: brandQueryKeys.all,
    queryFn: brandsApi.list,
    staleTime: 5 * 60_000,
  });
}

export function useCreateBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BrandPayload) => brandsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: brandQueryKeys.all });
    },
  });
}
