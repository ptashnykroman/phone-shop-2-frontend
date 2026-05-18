import type { Product, ProductListQuery, AlternativesResponse, ExplainedSpecificationGroup, PerformanceScore, Brand, Category, ProductPublicReview, PaginatedResponse } from "@/shared/api/api-types";
import { API_BASE_URL } from "@/shared/lib/env";
import { compactParams } from "@/shared/utils/request-params";

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed for ${path}`);
  }

  return (await response.json()) as T;
}

export const serverApi = {
  products: (query: ProductListQuery = {}) =>
    request<PaginatedResponse<Product>>(
      `/products?${new URLSearchParams(compactParams(query) as Record<string, string>).toString()}`,
    ),
  productBySlug: (slug: string) => request<Product>(`/products/slug/${slug}`),
  explainedSpecifications: (productId: string) =>
    request<ExplainedSpecificationGroup[]>(
      `/products/${productId}/specifications/explained`,
    ),
  performance: (productId: string) =>
    request<PerformanceScore>(`/products/${productId}/performance-score`),
  alternatives: (productId: string) =>
    request<AlternativesResponse>(`/products/${productId}/alternatives`),
  brands: () => request<Brand[]>("/brands"),
  categories: () => request<Category[]>("/categories"),
  reviews: (productId: string) =>
    request<ProductPublicReview[]>(`/products/${productId}/reviews`),
};
