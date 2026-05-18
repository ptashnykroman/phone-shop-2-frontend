import type { Favorite, PaginatedResponse, Product } from "@/shared/api/api-types";

export function toFiniteNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    ratingAverage: toFiniteNumber(product.ratingAverage),
    reviewCount: Math.max(0, Math.trunc(toFiniteNumber(product.reviewCount))),
  };
}

export function normalizeProductList(
  response: PaginatedResponse<Product>,
): PaginatedResponse<Product> {
  return {
    ...response,
    items: response.items.map(normalizeProduct),
  };
}

export function normalizeFavorite(favorite: Favorite): Favorite {
  return {
    ...favorite,
    product: normalizeProduct(favorite.product),
  };
}

export function normalizeFavorites(favorites: Favorite[]) {
  return favorites.map(normalizeFavorite);
}
