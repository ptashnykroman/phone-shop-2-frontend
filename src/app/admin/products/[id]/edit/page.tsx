'use client'

import { useParams } from 'next/navigation'
import { ProductForm } from '@/features/admin/forms/product-form'
import { useProductByIdQuery } from '@/features/products/hooks/use-products'
import { ErrorState } from '@/shared/components/ui/error-state'
import { PageHeader } from '@/shared/components/ui/page-header'
import { ProtectedRoute } from '@/shared/components/ui/protected-route'
import { Skeleton } from '@/shared/components/ui/skeleton'

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>()
  const productQuery = useProductByIdQuery(params.id)

  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader eyebrow="Admin products" title="Редагування товару" />
        {productQuery.isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : productQuery.isError || !productQuery.data ? (
          <ErrorState />
        ) : (
          <ProductForm product={productQuery.data} />
        )}
      </div>
    </ProtectedRoute>
  )
}
