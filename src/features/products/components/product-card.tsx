"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Scale, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/cn";
import { formatPrice } from "@/shared/utils/formatters";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const router = useRouter();
  const { user } = useAuthSession();
  const compareStore = useCompareStore();
  const cartMutation = useAddToCartMutation();
  const favoritesQuery = useFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const isFavorite = favoritesQuery.data?.some(
    (favorite) => favorite.productId === product.id,
  );
  const isCompared = compareStore.productIds.includes(product.id);

  const toggleFavorite = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (isFavorite) {
      removeFavoriteMutation.mutate({ productId: product.id });
      return;
    }

    addFavoriteMutation.mutate({ productId: product.id });
  };

  const toggleCompare = () => {
    if (isCompared) {
      compareStore.removeProduct(product.id);
      return;
    }

    if (compareStore.productIds.length >= 4) {
      toast.error("До порівняння можна додати максимум 4 товари.");
      return;
    }

    compareStore.addProduct(product.id);
    toast.success("Товар додано до порівняння.");
  };

  return (
    <Card className={cn("group overflow-hidden", className)}>
      <CardHeader className="p-0">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[3/3] overflow-hidden bg-muted"
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/15">
              <span className="font-display text-lg text-muted-foreground">
                {product.brand.name}
              </span>
            </div>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge>{product.brand.name}</Badge>
            {product.stock > 0 ? (
              <Badge variant="accent">В наявності</Badge>
            ) : (
              <Badge variant="destructive">Немає в наявності</Badge>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-primary"
          >
            <h3 className="line-clamp-2 text-lg font-semibold">
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.color ? (
            <Badge variant="outline">{product.color}</Badge>
          ) : null}
          <Badge variant="secondary">{product.category.name}</Badge>
          {product.performanceScore ? (
            <Badge variant="default">
              Оцінка {product.performanceScore.overallScore}/100
            </Badge>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
            {product.oldPrice ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{product.ratingAverage.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-1">
        <Button
          variant={isFavorite ? "default" : "outline"}
          size="icon"
          onClick={toggleFavorite}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
        <Button
          variant={isCompared ? "default" : "outline"}
          size="icon"
          onClick={toggleCompare}
        >
          <Scale className="h-4 w-4" />
        </Button>
        <Button
          className="col-span-1"
          size="icon"
          onClick={() =>
            cartMutation.mutate({ productId: product.id, quantity: 1 })
          }
          disabled={product.stock <= 0 || cartMutation.isPending}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
