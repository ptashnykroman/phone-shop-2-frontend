'use client'

import { useFavoritesQuery } from '@/features/favorites/hooks/use-favorites'
import { ProductCard } from '@/features/products/components/product-card'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { ErrorState } from '@/shared/components/ui/error-state'
import { PageHeader } from '@/shared/components/ui/page-header'
import { ProtectedRoute } from '@/shared/components/ui/protected-route'
import { Skeleton } from '@/shared/components/ui/skeleton'

export default function FavoritesPage() {
  const favoritesQuery = useFavoritesQuery()
  const isFavoritesLoading = favoritesQuery.isPending || favoritesQuery.isLoading

  return (
    <ProtectedRoute>
      <div className="page-shell section-space space-y-8">
        <PageHeader eyebrow="Favorites" title="Обрані товари" />

        {isFavoritesLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[2rem] border border-border/70 bg-card">
                <Skeleton className="aspect-[4/3] rounded-none" />
                <div className="space-y-4 p-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : favoritesQuery.isError ? (
          <ErrorState />
        ) : !favoritesQuery.data || favoritesQuery.data.length === 0 ? (
          <EmptyState
            title="Список обраного порожній"
            description="Додавайте моделі з каталогу або сторінки товару, щоб швидко повернутися до них пізніше."
            actionLabel="До каталогу"
            actionHref="/products"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {favoritesQuery.data.map((favorite) => (
              <ProductCard key={favorite.id} product={favorite.product} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
