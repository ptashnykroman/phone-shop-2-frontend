"use client";

import { useFavoritesQuery } from "@/features/favorites/hooks/use-favorites";
import { ProductCard } from "@/features/products/components/product-card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";

export default function FavoritesPage() {
  const favoritesQuery = useFavoritesQuery();

  return (
    <ProtectedRoute>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Favorites"
          title="Обрані товари"
          description="Тут зібрані смартфони, які ви відклали для подальшого вибору або порівняння."
        />

        {favoritesQuery.isError ? (
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
  );
}
