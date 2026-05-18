import { api } from "@/shared/api/axios-instance";
import type {
  AddCartItemRequest,
  Cart,
  MergeCartRequest,
  UpdateCartItemRequest,
} from "@/shared/api/api-types";

export const cartApi = {
  async getCart() {
    const { data } = await api.get<Cart>("/cart");
    return data;
  },
  async addItem(payload: AddCartItemRequest) {
    const { data } = await api.post<Cart>("/cart/items", payload);
    return data;
  },
  async updateItem(itemId: string, payload: UpdateCartItemRequest) {
    const { data } = await api.patch<Cart>(`/cart/items/${itemId}`, payload);
    return data;
  },
  async removeItem(itemId: string) {
    const { data } = await api.delete<Cart>(`/cart/items/${itemId}`);
    return data;
  },
  async clear() {
    const { data } = await api.delete<Cart>("/cart/clear");
    return data;
  },
  async merge(payload: MergeCartRequest) {
    const { data } = await api.post<Cart>("/cart/merge", payload);
    return data;
  },
};
