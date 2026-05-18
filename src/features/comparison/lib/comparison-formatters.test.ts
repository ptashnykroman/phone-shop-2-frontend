import { describe, expect, it } from "vitest";
import {
  buildComparisonConclusion,
  buildComparisonDifferenceExplanation,
  buildComparisonStandoutWinners,
  formatComparisonGroupName,
  formatComparisonSpecificationLabel,
  formatComparisonValue,
} from "@/features/comparison/lib/comparison-formatters";

describe("comparison-formatters", () => {
  it("formats comparison groups, labels, and values in Ukrainian", () => {
    expect(formatComparisonGroupName("Battery")).toBe("Акумулятор");
    expect(
      formatComparisonSpecificationLabel("battery_mah", "Battery capacity"),
    ).toBe("Ємність акумулятора");
    expect(formatComparisonValue("true")).toBe("Так");
    expect(formatComparisonValue("7", "years")).toBe("7 років");
    expect(formatComparisonValue("120", "Hz")).toBe("120 Гц");
  });

  it("builds Ukrainian comparison conclusions and standout winners", () => {
    expect(buildComparisonConclusion(0)).toMatch(/Загалом моделі дуже близькі/u);
    expect(buildComparisonConclusion(3)).toMatch(
      /Виявлено 3 суттєві відмінності/u,
    );

    expect(
      buildComparisonStandoutWinners({
        products: [{ id: "p1", name: "Phone A" }] as never,
        winnerByCategory: [
          { category: "camera", winnerProductIds: ["p1"], score: 90 },
        ],
      }),
    ).toEqual(['Phone A лідирує в категорії «Камера».']);
  });

  it("builds Ukrainian explanations for highlighted differences", () => {
    const explanation = buildComparisonDifferenceExplanation(
      {
        groupName: "Battery",
        key: "battery_mah",
        label: "Battery capacity",
        type: "numeric",
        values: [
          { productId: "p1", value: 5000, unit: "mAh", isBest: true },
          { productId: "p2", value: 4300, unit: "mAh", isBest: false },
        ],
        explanation: "ignored",
        importance: 10,
      },
      [
        { id: "p1", name: "Phone A" },
        { id: "p2", name: "Phone B" },
      ] as never,
    );

    expect(explanation).toMatch(/Phone A/u);
    expect(explanation).toMatch(/Ємність акумулятора/u);
    expect(explanation).toMatch(/довшу автономність/u);
  });
});
