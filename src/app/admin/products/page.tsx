'use client'

import Link from 'next/link'
import { useDeactivateProductMutation, useProductsQuery } from '@/features/products/hooks/use-products'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { ErrorState } from '@/shared/components/ui/error-state'
import { PageHeader } from '@/shared/components/ui/page-header'
import { ProtectedRoute } from '@/shared/components/ui/protected-route'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatPrice } from '@/shared/utils/formatters'

const loadingCards = Array.from({ length: 3 })

function AdminProductsLoadingState() {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
      <p className="text-sm text-muted-foreground">Завантажуємо товари...</p>
      {loadingCards.map((_, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-7 w-28" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AdminProductsPage() {
  const productsQuery = useProductsQuery({ page: 1, limit: 50 })
  const deactivateMutation = useDeactivateProductMutation()
  const products = productsQuery.data?.items ?? []

  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Admin products"
          title="Керування товарами"
          actions={
            <Button asChild>
              <Link href="/admin/products/new">Новий товар</Link>
            </Button>
          }
        />

        {productsQuery.isPending ? (
          <AdminProductsLoadingState />
        ) : productsQuery.isError ? (
          <ErrorState />
        ) : products.length === 0 ? (
          <EmptyState
            title="Товарів поки немає"
            description="Створіть перший товар, щоб він з'явився у списку керування."
            actionLabel="Новий товар"
            actionHref="/admin/products/new"
          />
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.brand.name} • {product.category.name} • {product.stock} шт
                    </p>
                    <p className="text-xl font-bold">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                      <Link href={`/admin/products/${product.id}/edit`}>Редагувати</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => deactivateMutation.mutate(product.id)}>
                      Деактивувати
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
