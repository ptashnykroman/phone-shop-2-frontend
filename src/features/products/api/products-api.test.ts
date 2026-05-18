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
});
