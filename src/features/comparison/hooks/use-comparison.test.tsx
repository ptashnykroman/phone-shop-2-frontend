import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useComparisonQuery } from "@/features/comparison/hooks/use-comparison";
import { comparisonApi } from "@/features/comparison/api/comparison-api";
import { renderHookWithClient } from "@/shared/test/test-utils";

vi.mock("@/features/comparison/api/comparison-api", () => ({
  comparisonApi: {
    compare: vi.fn(),
  },
}));

describe("useComparisonQuery", () => {
  it("fetches backend comparison for 2-4 selected products", async () => {
    vi.mocked(comparisonApi.compare).mockResolvedValueOnce({
      products: [],
      comparableSpecifications: [],
      groupedSpecifications: [],
      highlightedDifferences: [],
      winnerByCategory: [],
      summary: {
        significantDifferencesCount: 0,
        standoutWinners: [],
        conclusion: "ok",
      },
    });

    const { result } = renderHookWithClient(() =>
      useComparisonQuery(["1", "2"]),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(comparisonApi.compare).toHaveBeenCalledWith({ productIds: ["1", "2"] });
  });
});
