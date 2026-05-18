import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ComparePage from "@/app/compare/page";
import { renderWithClient } from "@/shared/test/test-utils";

const clear = vi.fn();
const removeProduct = vi.fn();

const comparisonQueryState = {
  isError: false,
  isLoading: false,
  isPending: false,
  data: {
    products: [
      { id: "p1", name: "Phone A" },
      { id: "p2", name: "Phone B" },
    ],
    comparableSpecifications: [],
    groupedSpecifications: [],
    highlightedDifferences: [
      {
        groupName: "Camera",
        key: "camera_main_mp",
        label: "Main camera",
        type: "numeric" as const,
        values: [
          { productId: "p1", value: 50, unit: "MP", isBest: true },
          { productId: "p2", value: 12, unit: "MP", isBest: false },
        ],
        explanation: "ignored",
        importance: 10,
      },
    ],
    winnerByCategory: [
      {
        category: "camera",
        winnerProductIds: ["p1"],
        score: 92,
      },
    ],
    summary: {
      significantDifferencesCount: 1,
      standoutWinners: ["Phone A wins in camera"],
      conclusion: "Detected 1 meaningful difference.",
    },
  },
};

vi.mock("@/features/comparison/stores/compare-store", () => ({
  useCompareStore: () => ({
    productIds: ["p1", "p2"],
    productNames: {
      p1: "Phone A",
      p2: "Phone B",
    },
    clear,
    removeProduct,
  }),
}));

vi.mock("@/features/comparison/hooks/use-comparison", () => ({
  useComparisonQuery: () => comparisonQueryState,
}));

describe("ComparePage", () => {
  beforeEach(() => {
    clear.mockReset();
    removeProduct.mockReset();
    comparisonQueryState.isError = false;
    comparisonQueryState.isLoading = false;
    comparisonQueryState.isPending = false;
    comparisonQueryState.data = {
      products: [
        { id: "p1", name: "Phone A" },
        { id: "p2", name: "Phone B" },
      ],
      comparableSpecifications: [],
      groupedSpecifications: [],
      highlightedDifferences: [
        {
          groupName: "Camera",
          key: "camera_main_mp",
          label: "Main camera",
          type: "numeric",
          values: [
            { productId: "p1", value: 50, unit: "MP", isBest: true },
            { productId: "p2", value: 12, unit: "MP", isBest: false },
          ],
          explanation: "ignored",
          importance: 10,
        },
      ],
      winnerByCategory: [
        {
          category: "camera",
          winnerProductIds: ["p1"],
          score: 92,
        },
      ],
      summary: {
        significantDifferencesCount: 1,
        standoutWinners: ["Phone A wins in camera"],
        conclusion: "Detected 1 meaningful difference.",
      },
    };
  });

  it("shows a loading spinner while the comparison is still loading", () => {
    comparisonQueryState.isLoading = true;
    comparisonQueryState.isPending = true;
    comparisonQueryState.data = undefined as never;

    renderWithClient(<ComparePage />);

    expect(
      screen.getByText("Завантажуємо результати порівняння..."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Висновок")).not.toBeInTheDocument();
  });

  it("shows product model names in compare buttons and allows clearing selection", () => {
    renderWithClient(<ComparePage />);

    expect(
      screen.getByRole("button", { name: "Прибрати Phone A" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Прибрати Phone B" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Виявлено 1 суттєву відмінність/u),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Phone A лідирує в категорії «Камера».'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Очистити" }));
    expect(clear).toHaveBeenCalled();
  });
});
