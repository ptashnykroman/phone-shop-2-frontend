'use client'

import { MockPaymentCard } from '@/features/payments/components/mock-payment-card'
import { useOrderDetailQuery } from '@/features/orders/hooks/use-orders'
import { ErrorState } from '@/shared/components/ui/error-state'
import { PageHeader } from '@/shared/components/ui/page-header'
import { ProtectedRoute } from '@/shared/components/ui/protected-route'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function MockPaymentPageView({ orderId }: { orderId: string }) {
  const orderQuery = useOrderDetailQuery(orderId)
  const isOrderLoading = orderQuery.isPending || orderQuery.isLoading

  return (
    <ProtectedRoute>
      <div className="page-shell section-space space-y-8">
        <PageHeader eyebrow="Payment" title="Демо-оплата замовлення" />

        {isOrderLoading ? (
          <Skeleton className="h-60 w-full" />
        ) : orderQuery.isError || !orderQuery.data ? (
          <ErrorState />
        ) : (
          <MockPaymentCard order={orderQuery.data} />
        )}
      </div>
    </ProtectedRoute>
  )
}
