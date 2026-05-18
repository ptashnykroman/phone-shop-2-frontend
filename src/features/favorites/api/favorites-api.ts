import { api } from "@/shared/api/axios-instance";
import type { Favorite, ToggleFavoriteRequest } from "@/shared/api/api-types";

export const favoritesApi = {
  async list() {
    const { data } = await api.get<Favorite[]>("/favorites");
    return data;
  },
  async add(payload: ToggleFavoriteRequest) {
    const { data } = await api.post<Favorite>("/favorites", payload);
    return data;
  },
  async remove(payload: ToggleFavoriteRequest) {
    const { data } = await api.delete<{ success: true }>("/favorites", {
      data: payload,
    });
    return data;
  },
};
