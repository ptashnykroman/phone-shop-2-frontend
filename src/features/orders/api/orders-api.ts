import { api } from "@/shared/api/axios-instance";
import type {
  CreateOrderRequest,
  Order,
  PaginatedResponse,
  UpdateOrderStatusRequest,
} from "@/shared/api/api-types";

export const ordersApi = {
  async create(payload: CreateOrderRequest) {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
  },
  async myOrders() {
    const { data } = await api.get<Order[]>("/orders/my");
    return data;
  },
  async getById(orderId: string) {
    const { data } = await api.get<Order>(`/orders/${orderId}`);
    return data;
  },
  async adminList(page = 1, limit = 20) {
    const { data } = await api.get<PaginatedResponse<Order>>("/orders", {
      params: { page, limit },
    });
    return data;
  },
  async updateStatus(orderId: string, payload: UpdateOrderStatusRequest) {
    const { data } = await api.patch<Order>(`/orders/${orderId}/status`, payload);
    return data;
  },
};
