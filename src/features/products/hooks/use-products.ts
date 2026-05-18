"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/features/products/api/products-api";
import type {
  AlternativesResponse,
  ExplainedSpecificationGroup,
  PerformanceScore,
  Product,
  ProductListQuery,
  ProductPayload,
} from "@/shared/api/api-types";

export const productQueryKeys = {
  all: ["products"] as const,
  list: (query: ProductListQuery) => ["products", "list", query] as const,
  detail: (productId: string) => ["products", "detail", productId] as const,
  slug: (slug: string) => ["products", "slug", slug] as const,
  explained: (productId: string) => ["products", productId, "explained"] as const,
  performance: (productId: string) =>
    ["products", productId, "performance"] as const,
  alternatives: (productId: string) =>
    ["products", productId, "alternatives"] as const,
};

export function useProductsQuery(query: ProductListQuery) {
  return useQuery({
    queryKey: productQueryKeys.list(query),
    queryFn: () => productsApi.list(query),
  });
}

export function useProductByIdQuery(productId: string, initialData?: Product) {
  return useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productsApi.getById(productId),
    enabled: Boolean(productId),
    initialData,
  });
}

export function useProductBySlugQuery(slug: string, initialData?: Product) {
  return useQuery({
    queryKey: productQueryKeys.slug(slug),
    queryFn: () => productsApi.getBySlug(slug),
    enabled: Boolean(slug),
    initialData,
  });
}

export function useExplainedSpecificationsQuery(
  productId: string,
  initialData?: ExplainedSpecificationGroup[],
) {
  return useQuery({
    queryKey: productQueryKeys.explained(productId),
    queryFn: () => productsApi.getExplainedSpecifications(productId),
    enabled: Boolean(productId),
    initialData,
  });
}

export function usePerformanceScoreQuery(
  productId: string,
  initialData?: PerformanceScore,
) {
  return useQuery({
    queryKey: productQueryKeys.performance(productId),
    queryFn: () => productsApi.getPerformanceScore(productId),
    enabled: Boolean(productId),
    initialData,
  });
}

export function useAlternativesQuery(
  productId: string,
  initialData?: AlternativesResponse,
) {
  return useQuery({
    queryKey: productQueryKeys.alternatives(productId),
    queryFn: () => productsApi.getAlternatives(productId),
    enabled: Boolean(productId),
    initialData,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => productsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}

export function useUpdateProductMutation(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ProductPayload>) =>
      productsApi.update(productId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.detail(productId),
        }),
      ]);
    },
  });
}

export function useDeactivateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => productsApi.deactivate(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}
