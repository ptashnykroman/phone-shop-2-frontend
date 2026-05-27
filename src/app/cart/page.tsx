'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import {
  useCartQuery,
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/features/cart/hooks/use-cart'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { ErrorState } from '@/shared/components/ui/error-state'
import { PageHeader } from '@/shared/components/ui/page-header'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatPrice } from '@/shared/utils/formatters'

export default function CartPage() {
  const cartQuery = useCartQuery()
  const updateMutation = useUpdateCartItemMutation()
  const removeMutation = useRemoveCartItemMutation()
  const clearMutation = useClearCartMutation()

  if (cartQuery.isLoading) {
    return (
      <div className="page-shell section-space space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (cartQuery.isError || !cartQuery.data) {
    return (
      <div className="page-shell section-space">
        <ErrorState />
      </div>
    )
  }

  if (cartQuery.data.items.length === 0) {
    return (
      <div className="page-shell section-space">
        <EmptyState
          title="Кошик порожній"
          description="Додайте кілька смартфонів у кошик, щоб перейти до оформлення."
          actionLabel="До каталогу"
          actionHref="/products"
        />
      </div>
    )
  }

  return (
    <div className="page-shell section-space space-y-8">
      <PageHeader
        eyebrow="Cart"
        title="Ваш кошик"
        actions={
          <Button variant="outline" onClick={() => clearMutation.mutate()} disabled={clearMutation.isPending}>
            Очистити кошик
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {cartQuery.data.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.product.brand.name} • {formatPrice(item.product.price)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateMutation.mutate({
                        itemId: item.id,
                        payload: { quantity: Math.max(1, item.quantity - 1) },
                      })
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateMutation.mutate({
                        itemId: item.id,
                        payload: { quantity: item.quantity + 1 },
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <p className="min-w-28 text-right text-lg font-bold">{item.lineTotal} грн</p>
                  <Button variant="ghost" size="icon" onClick={() => removeMutation.mutate(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-5 p-6">
            <div>
              <p className="text-sm text-muted-foreground">Товарів у кошику</p>
              <p className="mt-1 text-3xl font-bold">{cartQuery.data.totalQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Разом</p>
              <p className="mt-1 text-4xl font-bold">{formatPrice(cartQuery.data.subtotal)}</p>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Перейти до оформлення</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
