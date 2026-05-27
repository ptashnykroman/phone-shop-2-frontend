'use client'

import Link from 'next/link'
import { useAdminOverviewQuery } from '@/features/admin/hooks/use-admin'
import { useAdminOrdersQuery } from '@/features/orders/hooks/use-orders'
import { useProductsQuery } from '@/features/products/hooks/use-products'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ErrorState } from '@/shared/components/ui/error-state'
import { PageHeader } from '@/shared/components/ui/page-header'
import { ProtectedRoute } from '@/shared/components/ui/protected-route'
import { formatDate, formatOrderStatus, formatPrice } from '@/shared/utils/formatters'

export default function AdminDashboardPage() {
  const overviewQuery = useAdminOverviewQuery()
  const ordersQuery = useAdminOrdersQuery(1, 5)
  const productsQuery = useProductsQuery({ page: 1, limit: 5 })

  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader eyebrow="Admin" title="Адмін-панель магазину" />

        {overviewQuery.isError ? (
          <ErrorState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {overviewQuery.data
              ? Object.entries(overviewQuery.data).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-6">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{key}</p>
                      <p className="mt-3 text-4xl font-bold">{value}</p>
                    </CardContent>
                  </Card>
                ))
              : null}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Останні замовлення</CardTitle>
              <Button asChild variant="outline">
                <Link href="/admin/orders">Усі замовлення</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {(ordersQuery.data?.items ?? []).map((order) => (
                <div key={order.id} className="rounded-2xl border border-border/70 p-4">
                  <p className="font-semibold">{order.user.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatOrderStatus(order.status)} • {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-2 text-lg font-bold">{formatPrice(order.totalPrice)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Останні товари</CardTitle>
              <Button asChild variant="outline">
                <Link href="/admin/products">Керувати товарами</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {(productsQuery.data?.items ?? []).map((product) => (
                <div key={product.id} className="rounded-2xl border border-border/70 p-4">
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.brand.name} • {product.category.name}
                  </p>
                  <p className="mt-2 text-lg font-bold">{formatPrice(product.price)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
