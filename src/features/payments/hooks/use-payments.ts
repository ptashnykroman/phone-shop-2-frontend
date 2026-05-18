"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/features/payments/api/payments-api";
import { orderQueryKeys } from "@/features/orders/hooks/use-orders";

export function useMockPaymentSuccessMutation(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => paymentsApi.mockSuccess(orderId),
    onSuccess: async (order) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
        queryClient.setQueryData(orderQueryKeys.detail(orderId), order),
      ]);
    },
  });
}
