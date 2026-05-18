import { api } from "@/shared/api/axios-instance";
import type { Category, CategoryPayload } from "@/shared/api/api-types";

export const categoriesApi = {
  async list() {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },
  async getById(categoryId: string) {
    const { data } = await api.get<Category>(`/categories/${categoryId}`);
    return data;
  },
  async create(payload: CategoryPayload) {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },
  async update(categoryId: string, payload: Partial<CategoryPayload>) {
    const { data } = await api.patch<Category>(`/categories/${categoryId}`, payload);
    return data;
  },
  async remove(categoryId: string) {
    const { data } = await api.delete<{ success: true }>(`/categories/${categoryId}`);
    return data;
  },
};
