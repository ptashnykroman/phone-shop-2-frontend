"use client";

import { useCartQuery } from "@/features/cart/hooks/use-cart";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function CheckoutPage() {
  const cartQuery = useCartQuery();

  return (
    <ProtectedRoute>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Checkout"
          title="Оформлення замовлення"
           />

        {cartQuery.isLoading ? (
          <Skeleton className="h-60 w-full" />
        ) : cartQuery.isError || !cartQuery.data ? (
          <ErrorState />
        ) : cartQuery.data.items.length === 0 ? (
          <EmptyState
            title="Немає товарів для оформлення"
            description="Поверніться до каталогу та додайте хоча б один смартфон."
            actionLabel="До каталогу"
            actionHref="/products"
          />
        ) : (
          <CheckoutForm cart={cartQuery.data} />
        )}
      </div>
    </ProtectedRoute>
  );
}
