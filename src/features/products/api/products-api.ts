import { api } from "@/shared/api/axios-instance";
import type {
  AlternativesResponse,
  ExplainedSpecificationGroup,
  PaginatedResponse,
  PerformanceScore,
  Product,
  ProductListQuery,
  ProductPayload,
} from "@/shared/api/api-types";
import { normalizeProduct, normalizeProductList } from "@/shared/api/product-normalizers";
import { compactParams } from "@/shared/utils/request-params";

export const productsApi = {
  async list(query: ProductListQuery = {}) {
    const { data } = await api.get<PaginatedResponse<Product>>("/products", {
      params: compactParams(query),
    });
    return normalizeProductList(data);
  },
  async getById(productId: string) {
    const { data } = await api.get<Product>(`/products/${productId}`);
    return normalizeProduct(data);
  },
  async getBySlug(slug: string) {
    const { data } = await api.get<Product>(`/products/slug/${slug}`);
    return normalizeProduct(data);
  },
  async getExplainedSpecifications(productId: string) {
    const { data } = await api.get<ExplainedSpecificationGroup[]>(
      `/products/${productId}/specifications/explained`,
    );
    return data;
  },
  async getPerformanceScore(productId: string) {
    const { data } = await api.get<PerformanceScore>(
      `/products/${productId}/performance-score`,
    );
    return data;
  },
  async getAlternatives(productId: string) {
    const { data } = await api.get<AlternativesResponse>(
      `/products/${productId}/alternatives`,
    );
    return data;
  },
  async create(payload: ProductPayload) {
    const { data } = await api.post<Product>("/products", payload);
    return normalizeProduct(data);
  },
  async update(productId: string, payload: Partial<ProductPayload>) {
    const { data } = await api.patch<Product>(`/products/${productId}`, payload);
    return normalizeProduct(data);
  },
  async deactivate(productId: string) {
    const { data } = await api.delete<{ success: true }>(`/products/${productId}`);
    return data;
  },
};
