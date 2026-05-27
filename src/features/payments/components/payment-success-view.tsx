"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useOrderDetailQuery } from "@/features/orders/hooks/use-orders";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ErrorState } from "@/shared/components/ui/error-state";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatPrice } from "@/shared/utils/formatters";

export function PaymentSuccessView({ orderId }: { orderId: string }) {
  const orderQuery = useOrderDetailQuery(orderId);
  const isOrderLoading = orderQuery.isPending || orderQuery.isLoading;

  return (
    <ProtectedRoute>
      <div className="page-shell section-space">
        {isOrderLoading ? (
          <Skeleton className="h-60 w-full" />
        ) : orderQuery.isError || !orderQuery.data ? (
          <ErrorState />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-6 w-6" />
                Оплату підтверджено
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Замовлення #{orderQuery.data.id} успішно оплачено.
              </p>
              <p className="text-3xl font-bold">
                {formatPrice(orderQuery.data.totalPrice)}
              </p>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href={`/orders/${orderQuery.data.id}`}>До замовлення</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/products">Продовжити покупки</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
