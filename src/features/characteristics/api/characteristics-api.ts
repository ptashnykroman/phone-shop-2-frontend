import { api } from "@/shared/api/axios-instance";
import type {
  ProductSpecification,
  ProductSpecificationInput,
} from "@/shared/api/api-types";

export const characteristicsApi = {
  async list(productId: string) {
    const { data } = await api.get<ProductSpecification[]>(
      `/products/${productId}/specifications`,
    );
    return data;
  },
  async create(productId: string, payload: ProductSpecificationInput) {
    const { data } = await api.post<ProductSpecification>(
      `/products/${productId}/specifications`,
      payload,
    );
    return data;
  },
  async update(
    productId: string,
    characteristicId: string,
    payload: Partial<ProductSpecificationInput>,
  ) {
    const { data } = await api.patch<ProductSpecification>(
      `/products/${productId}/specifications/${characteristicId}`,
      payload,
    );
    return data;
  },
  async remove(productId: string, characteristicId: string) {
    const { data } = await api.delete<{ success: true }>(
      `/products/${productId}/specifications/${characteristicId}`,
    );
    return data;
  },
};
