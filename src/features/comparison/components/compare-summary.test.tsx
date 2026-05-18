import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompareSummary } from "@/features/comparison/components/compare-summary";
import type { ComparisonResponse } from "@/shared/api/api-types";

describe("CompareSummary", () => {
  it("shows winner badges with model names for each category", () => {
    const comparison = {
      products: [
        { id: "p1", name: "Phone A" },
        { id: "p2", name: "Phone B" },
        { id: "p3", name: "Phone C" },
      ] as never,
      comparableSpecifications: [],
      groupedSpecifications: [],
      highlightedDifferences: [],
      winnerByCategory: [
        {
          category: "camera",
          winnerProductIds: ["p1"],
          score: 91,
        },
        {
          category: "battery",
          winnerProductIds: ["p2", "p3"],
          score: 88,
        },
      ],
      summary: {
        significantDifferencesCount: 0,
        standoutWinners: [],
        conclusion: "",
      },
    } satisfies ComparisonResponse;

    render(
      <CompareSummary
        hideIdentical={false}
        comparison={comparison}
      />,
    );

    expect(screen.getByText("Phone A")).toBeInTheDocument();
    expect(screen.getByText("Phone B")).toBeInTheDocument();
    expect(screen.getByText("Phone C")).toBeInTheDocument();
    expect(screen.getByText("Нічия")).toBeInTheDocument();
  });
});
