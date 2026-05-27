'use client'

import { useRouter } from 'next/navigation'
import { useMockPaymentSuccessMutation } from '@/features/payments/hooks/use-payments'
import type { Order } from '@/shared/api/api-types'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { formatPrice } from '@/shared/utils/formatters'

export function MockPaymentCard({ order }: { order: Order }) {
  const router = useRouter()
  const mockSuccessMutation = useMockPaymentSuccessMutation(order.id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock payment flow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Сума замовлення</p>
          <p className="mt-2 text-3xl font-bold">{formatPrice(order.totalPrice)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              mockSuccessMutation.mutate(undefined, {
                onSuccess: () => router.push(`/payment/success?orderId=${order.id}`),
              })
            }
            disabled={mockSuccessMutation.isPending}
          >
            Оплатити успішно
          </Button>
          <Button variant="outline" onClick={() => router.push(`/payment/failed?orderId=${order.id}`)}>
            Показати сценарій помилки
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
