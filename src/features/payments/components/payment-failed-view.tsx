"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function PaymentFailedView({ orderId }: { orderId?: string }) {
  return (
    <div className="page-shell section-space">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-6 w-6" />
            Оплату не завершено
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Backend не має окремого `mock-fail` endpoint-а, тому цей сценарій не змінює статус замовлення. Ви можете повернутися до mock payment або відкрити саме замовлення.
          </p>
          <div className="flex gap-3">
            {orderId ? (
              <>
                <Button asChild>
                  <Link href={`/payment/mock?orderId=${orderId}`}>Спробувати ще раз</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/orders/${orderId}`}>Переглянути замовлення</Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/orders">До замовлень</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
