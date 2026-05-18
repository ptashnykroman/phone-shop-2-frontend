"use client";

import Link from "next/link";
import { useDeactivateProductMutation, useProductsQuery } from "@/features/products/hooks/use-products";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";
import { formatPrice } from "@/shared/utils/formatters";

export default function AdminProductsPage() {
  const productsQuery = useProductsQuery({ page: 1, limit: 50 });
  const deactivateMutation = useDeactivateProductMutation();

  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Admin products"
          title="Керування товарами"
          description="Створення, редагування та деактивація товарів без зміни backend API."
          actions={
            <Button asChild>
              <Link href="/admin/products/new">Новий товар</Link>
            </Button>
          }
        />

        {productsQuery.isError || !productsQuery.data ? (
          <ErrorState />
        ) : (
          <div className="space-y-4">
            {productsQuery.data.items.map((product) => (
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
                    <Button
                      variant="destructive"
                      onClick={() => deactivateMutation.mutate(product.id)}
                    >
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
  );
}
