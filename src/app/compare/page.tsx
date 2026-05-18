"use client";

import { useState } from "react";
import { useComparisonQuery } from "@/features/comparison/hooks/use-comparison";
import { CompareSummary } from "@/features/comparison/components/compare-summary";
import { useCompareStore } from "@/features/comparison/stores/compare-store";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function ComparePage() {
  const [hideIdentical, setHideIdentical] = useState(false);
  const compareStore = useCompareStore();
  const comparisonQuery = useComparisonQuery(compareStore.productIds);

  if (compareStore.productIds.length < 2) {
    return (
      <div className="page-shell section-space">
        <EmptyState
          title="Для порівняння потрібно 2-4 товари"
          description="Додайте смартфони з каталогу або зі сторінки товару, а backend сам порахує реальні відмінності."
          actionLabel="Перейти в каталог"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="page-shell section-space space-y-8">
      <PageHeader
        eyebrow="Compare"
        title="Чесне порівняння смартфонів"
        description="Backend повертає groupedSpecifications, highlightedDifferences, winnerByCategory і summary, а frontend лише візуалізує ці дані."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setHideIdentical((current) => !current)}
            >
              {hideIdentical ? "Показати все" : "Сховати однакове"}
            </Button>
            <Button variant="outline" onClick={() => compareStore.clear()}>
              Очистити
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Товари в порівнянні</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {compareStore.productIds.map((productId) => (
            <Button
              key={productId}
              variant="outline"
              onClick={() => compareStore.removeProduct(productId)}
            >
              Прибрати {productId.slice(0, 8)}...
            </Button>
          ))}
        </CardContent>
      </Card>

      {comparisonQuery.isError || !comparisonQuery.data ? (
        <ErrorState />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Висновок</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {comparisonQuery.data.summary.conclusion}
              </p>
              <ul className="space-y-2 text-sm">
                {comparisonQuery.data.summary.standoutWinners.map((winner) => (
                  <li key={winner}>• {winner}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <CompareSummary
            comparison={comparisonQuery.data}
            hideIdentical={hideIdentical}
          />
        </>
      )}
    </div>
  );
}
