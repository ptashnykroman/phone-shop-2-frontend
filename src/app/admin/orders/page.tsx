"use client";

import { useState } from "react";
import { useAdminOrdersQuery, useUpdateOrderStatusMutation } from "@/features/orders/hooks/use-orders";
import type { OrderStatus } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";
import { Select } from "@/shared/components/ui/select";
import { formatOrderStatus, formatPaymentStatus, formatPrice } from "@/shared/utils/formatters";

function OrderStatusRow({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const mutation = useUpdateOrderStatusMutation(orderId);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={status}
        onChange={(event) => setStatus(event.target.value as OrderStatus)}
        options={[
          { label: "PENDING", value: "PENDING" },
          { label: "AWAITING_PAYMENT", value: "AWAITING_PAYMENT" },
          { label: "PROCESSING", value: "PROCESSING" },
          { label: "SHIPPED", value: "SHIPPED" },
          { label: "DELIVERED", value: "DELIVERED" },
          { label: "CANCELLED", value: "CANCELLED" },
        ]}
      />
      <Button onClick={() => mutation.mutate({ status })}>Оновити</Button>
    </div>
  );
}

export default function AdminOrdersPage() {
  const ordersQuery = useAdminOrdersQuery(1, 30);

  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Admin orders"
          title="Керування замовленнями"
          description="Список замовлень та зміна статусів через наявний `PATCH /api/orders/:id/status`."
        />

        {ordersQuery.isError || !ordersQuery.data ? (
          <ErrorState />
        ) : (
          <div className="space-y-4">
            {ordersQuery.data.items.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{order.user.email}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Статус: {formatOrderStatus(order.status)}</p>
                    <p>Оплата: {formatPaymentStatus(order.paymentStatus)}</p>
                    <p>Сума: {formatPrice(order.totalPrice)}</p>
                  </div>
                  <OrderStatusRow orderId={order.id} currentStatus={order.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
