import { describe, expect, it, vi } from "vitest";
import { productsApi } from "@/features/products/api/products-api";
import { api } from "@/shared/api/axios-instance";

vi.mock("@/shared/api/axios-instance", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("productsApi", () => {
  it("serializes list filters to backend-compatible query params", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: { items: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } },
    });

    await productsApi.list({
      search: "pixel",
      brandIds: ["a", "b"],
      colors: ["black", "green"],
      inStock: true,
    });

    expect(api.get).toHaveBeenCalledWith("/products", {
      params: {
        search: "pixel",
        brandIds: "a,b",
        colors: "black,green",
        inStock: true,
      },
    });
  });

  it("normalizes numeric rating fields from API responses", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        id: "product-1",
        name: "Pixel 9",
        slug: "pixel-9",
        description: "desc",
        shortDescription: "short",
        price: 1000,
        oldPrice: null,
        stock: 5,
        sku: "PX-9",
        color: "Black",
        images: [],
        isActive: true,
        deletedAt: null,
        ratingAverage: "4.75",
        reviewCount: "12",
        brandId: "brand-1",
        categoryId: "cat-1",
        createdAt: "2026-05-18T00:00:00.000Z",
        updatedAt: "2026-05-18T00:00:00.000Z",
        brand: {
          id: "brand-1",
          name: "Google",
          slug: "google",
          description: null,
          logoUrl: null,
          createdAt: "2026-05-18T00:00:00.000Z",
          updatedAt: "2026-05-18T00:00:00.000Z",
        },
        category: {
          id: "cat-1",
          name: "Phones",
          slug: "phones",
          description: null,
          createdAt: "2026-05-18T00:00:00.000Z",
          updatedAt: "2026-05-18T00:00:00.000Z",
        },
        specifications: [],
        performanceScore: null,
        reviews: [],
      },
    });

    const product = await productsApi.getBySlug("pixel-9");

    expect(product.ratingAverage).toBe(4.75);
    expect(product.reviewCount).toBe(12);
  });
});
