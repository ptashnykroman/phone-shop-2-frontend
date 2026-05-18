"use client";

import { Heart, Minus, Plus, Scale, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthSession } from "@/features/auth/hooks/use-auth";
import { useAddToCartMutation } from "@/features/cart/hooks/use-cart";
import { useCompareStore } from "@/features/comparison/stores/compare-store";
import {
  useAddFavoriteMutation,
  useFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/features/favorites/hooks/use-favorites";
import type { Product } from "@/shared/api/api-types";
import { toFiniteNumber } from "@/shared/api/product-normalizers";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatPrice } from "@/shared/utils/formatters";

export function ProductDetailAside({ product }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuthSession();
  const cartMutation = useAddToCartMutation();
  const compareStore = useCompareStore();
  const favoritesQuery = useFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();
  const ratingAverage = toFiniteNumber(product.ratingAverage).toFixed(1);
  const reviewCount = Math.max(0, Math.trunc(toFiniteNumber(product.reviewCount)));

  const isFavorite = favoritesQuery.data?.some(
    (favorite) => favorite.productId === product.id,
  );
  const isCompared = compareStore.productIds.includes(product.id);

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge>{product.brand.name}</Badge>
            <Badge variant="secondary">{product.category.name}</Badge>
            {product.stock > 0 ? (
              <Badge variant="accent">В наявності: {product.stock}</Badge>
            ) : (
              <Badge variant="destructive">Тимчасово недоступно</Badge>
            )}
          </div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-muted-foreground">{product.shortDescription}</p>
        </div>

        <div>
          <p className="text-4xl font-bold">{formatPrice(product.price)}</p>
          {product.oldPrice ? (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="min-w-12 text-center text-lg font-semibold">{quantity}</div>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setQuantity((current) => Math.min(product.stock || 1, current + 1))
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-3">
          <Button
            size="lg"
            onClick={() =>
              cartMutation.mutate({ productId: product.id, quantity })
            }
            disabled={product.stock <= 0 || cartMutation.isPending}
          >
            <ShoppingCart className="h-4 w-4" />
            Додати в кошик
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={() => {
                if (!user) {
                  router.push("/auth/login");
                  return;
                }

                if (isFavorite) {
                  removeFavoriteMutation.mutate({ productId: product.id });
                  return;
                }

                addFavoriteMutation.mutate({ productId: product.id });
              }}
            >
              <Heart className="h-4 w-4" />
              Обране
            </Button>
            <Button
              variant={isCompared ? "default" : "outline"}
              onClick={() => {
                if (isCompared) {
                  compareStore.removeProduct(product.id);
                  return;
                }
                if (compareStore.productIds.length >= 4) {
                  toast.error("До порівняння можна додати до 4 товарів.");
                  return;
                }
                compareStore.addProduct(product.id, product.name);
              }}
            >
              <Scale className="h-4 w-4" />
              Порівняти
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">SKU: {product.sku}</p>
          {product.color ? <p className="mt-2">Колір: {product.color}</p> : null}
          <p className="mt-2">
            Рейтинг: {ratingAverage} з {reviewCount} відгуків
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
