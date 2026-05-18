"use client";

import Link from "next/link";
import { useMyOrdersQuery } from "@/features/orders/hooks/use-orders";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatDate, formatOrderStatus, formatPaymentStatus, formatPrice } from "@/shared/utils/formatters";

export default function OrdersPage() {
  const ordersQuery = useMyOrdersQuery();

  return (
    <ProtectedRoute>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Orders"
          title="Мої замовлення"
          description="Тут відображаються статуси доставки, оплати та склад усіх замовлень поточного користувача."
        />

        {ordersQuery.isError ? (
          <ErrorState />
        ) : !ordersQuery.data || ordersQuery.data.length === 0 ? (
          <EmptyState
            title="Замовлень поки немає"
            description="Оформіть перше замовлення, щоб тут з'явилась історія покупок."
            actionLabel="До каталогу"
            actionHref="/products"
          />
        ) : (
          <div className="space-y-4">
            {ordersQuery.data.map((order) => (
              <Card key={order.id}>
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">Замовлення #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatOrderStatus(order.status)} • {formatPaymentStatus(order.paymentStatus)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-2xl font-bold">{formatPrice(order.totalPrice)}</p>
                    <Button asChild>
                      <Link href={`/orders/${order.id}`}>Деталі</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
