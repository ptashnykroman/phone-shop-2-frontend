import { api } from "@/shared/api/axios-instance";
import type { Order } from "@/shared/api/api-types";

export const paymentsApi = {
  async mockSuccess(orderId: string) {
    const { data } = await api.post<Order>(`/payments/orders/${orderId}/mock-success`);
    return data;
  },
};
