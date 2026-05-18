import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminProductsPage from "@/app/admin/products/page";
import { renderWithClient } from "@/shared/test/test-utils";

const mocks = vi.hoisted(() => ({
  deactivateMutate: vi.fn(),
  productsQueryState: {} as {
    isError: boolean;
    isLoading?: boolean;
    isPending?: boolean;
    data?: {
      items: Array<{
        id: string;
        name: string;
        price: number;
        stock: number;
        brand: { name: string };
        category: { name: string };
      }>;
    };
  },
}));

vi.mock("@/features/products/hooks/use-products", () => ({
  useProductsQuery: () => mocks.productsQueryState,
  useDeactivateProductMutation: () => ({ mutate: mocks.deactivateMutate }),
}));

vi.mock("@/shared/components/ui/protected-route", () => ({
  ProtectedRoute: ({ children }: { children: unknown }) => <>{children}</>,
}));

describe("AdminProductsPage", () => {
  beforeEach(() => {
    mocks.deactivateMutate.mockReset();
  });

  it("shows a loading state instead of an error while products are pending", () => {
    mocks.productsQueryState = {
      isPending: true,
      isLoading: true,
      isError: false,
    };

    renderWithClient(<AdminProductsPage />);

    expect(screen.getByText("Завантажуємо товари...")).toBeInTheDocument();
    expect(screen.queryByText("Не вдалося завантажити дані")).not.toBeInTheDocument();
  });

  it("shows an empty state when the request succeeds but the list is empty", () => {
    mocks.productsQueryState = {
      isPending: false,
      isLoading: false,
      isError: false,
      data: { items: [] },
    };

    renderWithClient(<AdminProductsPage />);

    expect(screen.getByText("Товарів поки немає")).toBeInTheDocument();
  });

  it("shows an error state when the request fails", () => {
    mocks.productsQueryState = {
      isPending: false,
      isLoading: false,
      isError: true,
    };

    renderWithClient(<AdminProductsPage />);

    expect(screen.getByText("Не вдалося завантажити дані")).toBeInTheDocument();
  });
});
