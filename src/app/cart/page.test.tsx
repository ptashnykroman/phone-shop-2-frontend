import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CartPage from "@/app/cart/page";
import { renderWithClient } from "@/shared/test/test-utils";

const updateMutate = vi.fn();
const removeMutate = vi.fn();
const clearMutate = vi.fn();

vi.mock("@/features/cart/hooks/use-cart", () => ({
  useCartQuery: () => ({
    isLoading: false,
    isError: false,
    data: {
      id: "cart-1",
      userId: null,
      sessionId: "session-1",
      totalQuantity: 1,
      subtotal: 1000,
      createdAt: "",
      updatedAt: "",
      items: [
        {
          id: "item-1",
          quantity: 1,
          lineTotal: "1000.00",
          product: {
            id: "p1",
            name: "Test Phone",
            slug: "test-phone",
            description: "",
            shortDescription: "",
            price: 1000,
            oldPrice: null,
            stock: 5,
            sku: "SKU",
            color: "Black",
            images: [],
            isActive: true,
            deletedAt: null,
            ratingAverage: 0,
            reviewCount: 0,
            brandId: "b1",
            categoryId: "c1",
            createdAt: "",
            updatedAt: "",
            brand: {
              id: "b1",
              name: "Brand",
              slug: "brand",
              description: null,
              logoUrl: null,
              createdAt: "",
              updatedAt: "",
            },
            category: {
              id: "c1",
              name: "Category",
              slug: "category",
              description: null,
              createdAt: "",
              updatedAt: "",
            },
            specifications: [],
            performanceScore: null,
            reviews: [],
          },
        },
      ],
    },
  }),
  useUpdateCartItemMutation: () => ({ mutate: updateMutate }),
  useRemoveCartItemMutation: () => ({ mutate: removeMutate }),
  useClearCartMutation: () => ({ mutate: clearMutate, isPending: false }),
}));

describe("CartPage", () => {
  it("updates item quantity when plus button is clicked", () => {
    renderWithClient(<CartPage />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]);

    expect(updateMutate).toHaveBeenCalledWith({
      itemId: "item-1",
      payload: { quantity: 2 },
    });
  });
});
