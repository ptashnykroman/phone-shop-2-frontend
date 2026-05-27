"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrderDetailQuery } from "@/features/orders/hooks/use-orders";
import { Button } from "@/shared/components/ui/button";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  formatDate,
  formatDeliveryType,
  formatOrderStatus,
  formatPaymentMethod,
  formatPaymentStatus,
  formatPrice,
} from "@/shared/utils/formatters";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderQuery = useOrderDetailQuery(params.id);
  const isOrderLoading = orderQuery.isPending || orderQuery.isLoading;

  return (
    <ProtectedRoute>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Order details"
          title="Деталі замовлення"
        />

        {isOrderLoading ? (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : orderQuery.isError || !orderQuery.data ? (
          <ErrorState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>Статус і доставка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>Статус: {formatOrderStatus(orderQuery.data.status)}</p>
                <p>Оплата: {formatPaymentStatus(orderQuery.data.paymentStatus)}</p>
                <p>Метод оплати: {formatPaymentMethod(orderQuery.data.paymentMethod)}</p>
                <p>Тип доставки: {formatDeliveryType(orderQuery.data.deliveryType)}</p>
                <p>Адреса: {orderQuery.data.deliveryAddress}</p>
                <p>Створено: {formatDate(orderQuery.data.createdAt)}</p>
                <p className="pt-2 text-3xl font-bold">
                  {formatPrice(orderQuery.data.totalPrice)}
                </p>
                {orderQuery.data.status === "AWAITING_PAYMENT" &&
                orderQuery.data.paymentMethod === "MOCK" ? (
                  <Button asChild className="mt-3">
                    <Link href={`/payment/mock?orderId=${orderQuery.data.id}`}>
                      Повернутися до оплати
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Склад замовлення</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderQuery.data.items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
