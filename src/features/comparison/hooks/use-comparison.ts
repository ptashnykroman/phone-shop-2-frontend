"use client";

import { useQuery } from "@tanstack/react-query";
import { comparisonApi } from "@/features/comparison/api/comparison-api";

export const comparisonQueryKeys = {
  compare: (productIds: string[]) => ["compare", [...productIds].sort()] as const,
};

export function useComparisonQuery(productIds: string[]) {
  return useQuery({
    queryKey: comparisonQueryKeys.compare(productIds),
    queryFn: () => comparisonApi.compare({ productIds }),
    enabled: productIds.length >= 2 && productIds.length <= 4,
  });
}
