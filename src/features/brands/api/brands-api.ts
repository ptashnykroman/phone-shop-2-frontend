import { api } from "@/shared/api/axios-instance";
import type { Brand, BrandPayload } from "@/shared/api/api-types";

export const brandsApi = {
  async list() {
    const { data } = await api.get<Brand[]>("/brands");
    return data;
  },
  async getById(brandId: string) {
    const { data } = await api.get<Brand>(`/brands/${brandId}`);
    return data;
  },
  async create(payload: BrandPayload) {
    const { data } = await api.post<Brand>("/brands", payload);
    return data;
  },
  async update(brandId: string, payload: Partial<BrandPayload>) {
    const { data } = await api.patch<Brand>(`/brands/${brandId}`, payload);
    return data;
  },
  async remove(brandId: string) {
    const { data } = await api.delete<{ success: true }>(`/brands/${brandId}`);
    return data;
  },
};
