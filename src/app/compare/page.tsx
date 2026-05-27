'use client'

import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { CompareSummary } from '@/features/comparison/components/compare-summary'
import {
  buildComparisonConclusion,
  buildComparisonStandoutWinners,
} from '@/features/comparison/lib/comparison-formatters'
import { useComparisonQuery } from '@/features/comparison/hooks/use-comparison'
import { useCompareStore } from '@/features/comparison/stores/compare-store'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { ErrorState } from '@/shared/components/ui/error-state'
import { PageHeader } from '@/shared/components/ui/page-header'

function ComparePageLoadingState() {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/70 bg-card/30 px-6 py-10 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Завантажуємо результати порівняння...</p>
    </div>
  )
}

export default function ComparePage() {
  const [hideIdentical, setHideIdentical] = useState(false)
  const compareStore = useCompareStore()
  const comparisonQuery = useComparisonQuery(compareStore.productIds)

  if (compareStore.productIds.length < 2) {
    return (
      <div className="page-shell section-space">
        <EmptyState
          title="Для порівняння потрібно 2-4 товари"
          description="Додайте смартфони до порівняння і система покаже вам реальні відмінності."
          actionLabel="Перейти в каталог"
          actionHref="/products"
        />
      </div>
    )
  }

  const isComparisonLoading = comparisonQuery.isPending || comparisonQuery.isLoading
  const comparison = comparisonQuery.data
  const standoutWinners = comparison ? buildComparisonStandoutWinners(comparison) : []
  const comparisonProductNameMap = new Map(comparison?.products.map((product) => [product.id, product.name]) ?? [])

  return (
    <div className="page-shell section-space space-y-8">
      <PageHeader
        eyebrow="Порівняння"
        title="Порівняння смартфонів"
        actions={
          <>
            <Button variant="outline" onClick={() => setHideIdentical((current) => !current)}>
              {hideIdentical ? 'Показати все' : 'Сховати однакове'}
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
            <Button key={productId} variant="outline" onClick={() => compareStore.removeProduct(productId)}>
              Прибрати {comparisonProductNameMap.get(productId) ?? compareStore.productNames[productId] ?? 'Смартфон'}
            </Button>
          ))}
        </CardContent>
      </Card>

      {isComparisonLoading ? (
        <ComparePageLoadingState />
      ) : comparisonQuery.isError || !comparison ? (
        <ErrorState />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Висновок</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {buildComparisonConclusion(comparison.highlightedDifferences.length)}
              </p>
              {standoutWinners.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {standoutWinners.map((winner) => (
                    <li key={winner}>{winner}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Одноосібного лідера немає: моделі дуже близькі в ключових категоріях.
                </p>
              )}
            </CardContent>
          </Card>

          <CompareSummary comparison={comparison} hideIdentical={hideIdentical} />
        </>
      )}
    </div>
  )
}
