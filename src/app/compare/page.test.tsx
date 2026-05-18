import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ComparePage from "@/app/compare/page";
import { renderWithClient } from "@/shared/test/test-utils";

const clear = vi.fn();
const removeProduct = vi.fn();

vi.mock("@/features/comparison/stores/compare-store", () => ({
  useCompareStore: () => ({
    productIds: ["p1", "p2"],
    clear,
    removeProduct,
  }),
}));

vi.mock("@/features/comparison/hooks/use-comparison", () => ({
  useComparisonQuery: () => ({
    isError: false,
    data: {
      products: [],
      comparableSpecifications: [],
      groupedSpecifications: [],
      highlightedDifferences: [],
      winnerByCategory: [],
      summary: {
        significantDifferencesCount: 1,
        standoutWinners: ["Phone A wins in camera"],
        conclusion: "Detected 1 meaningful difference.",
      },
    },
  }),
}));

describe("ComparePage", () => {
  it("shows comparison summary and allows clearing selection", () => {
    renderWithClient(<ComparePage />);

    expect(screen.getByText("Detected 1 meaningful difference.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Очистити" }));
    expect(clear).toHaveBeenCalled();
  });
});
