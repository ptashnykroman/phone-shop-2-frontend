import { api } from "@/shared/api/axios-instance";
import type { Favorite, ToggleFavoriteRequest } from "@/shared/api/api-types";
import { normalizeFavorite, normalizeFavorites } from "@/shared/api/product-normalizers";

export const favoritesApi = {
  async list() {
    const { data } = await api.get<Favorite[]>("/favorites");
    return normalizeFavorites(data);
  },
  async add(payload: ToggleFavoriteRequest) {
    const { data } = await api.post<Favorite>("/favorites", payload);
    return normalizeFavorite(data);
  },
  async remove(payload: ToggleFavoriteRequest) {
    const { data } = await api.delete<{ success: true }>("/favorites", {
      data: payload,
    });
    return data;
  },
};
