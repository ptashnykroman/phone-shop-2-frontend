import type { ComparisonResponse } from "@/shared/api/api-types";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import {
  buildComparisonDifferenceExplanation,
  formatComparisonCategory,
  formatComparisonDifferenceType,
  formatComparisonGroupName,
  formatComparisonSpecificationLabel,
  formatComparisonValue,
} from "@/features/comparison/lib/comparison-formatters";

export function CompareSummary({
  comparison,
  hideIdentical,
}: {
  comparison: ComparisonResponse;
  hideIdentical: boolean;
}) {
  const productNameMap = new Map(
    comparison.products.map((product) => [product.id, product.name]),
  );
  const visibleGroups = comparison.groupedSpecifications
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!hideIdentical) {
          return true;
        }

        const values = item.values.map((value) => value.value.toLowerCase());
        return new Set(values).size > 1;
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Головні відмінності</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comparison.highlightedDifferences.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Суттєвих відмінностей за порівнюваними характеристиками не виявлено.
            </p>
          ) : (
            comparison.highlightedDifferences.map((difference) => (
              <div
                key={difference.key}
                className="rounded-2xl border border-border/70 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">
                    {formatComparisonSpecificationLabel(
                      difference.key,
                      difference.label,
                    )}
                  </p>
                  <Badge variant="outline">
                    {formatComparisonDifferenceType(difference.type)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {buildComparisonDifferenceExplanation(
                    difference,
                    comparison.products,
                  )}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Переможець за категоріями</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {comparison.winnerByCategory.map((winner) => {
            const winnerNames = winner.winnerProductIds
              .map((productId) => productNameMap.get(productId))
              .filter((productName): productName is string => Boolean(productName));

            return (
              <div
                key={winner.category}
                className="rounded-2xl border border-border/70 p-4"
              >
                <p className="font-semibold">
                  {formatComparisonCategory(winner.category)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {winner.winnerProductIds.length > 1
                    ? "Нічия"
                    : "Є явний лідер"}
                </p>
                {winnerNames.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {winnerNames.map((winnerName) => (
                      <Badge key={`${winner.category}-${winnerName}`}>
                        {winnerName}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <p className="mt-3 text-2xl font-bold">{winner.score}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {visibleGroups.map((group) => (
        <Card key={group.groupName}>
          <CardHeader>
            <CardTitle>{formatComparisonGroupName(group.groupName)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Характеристика</TableHead>
                  {comparison.products.map((product) => (
                    <TableHead key={product.id}>{product.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.items.map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className="font-medium">
                      {formatComparisonSpecificationLabel(item.key, item.label)}
                    </TableCell>
                    {comparison.products.map((product) => {
                      const value = item.values.find(
                        (entry) => entry.productId === product.id,
                      );

                      return (
                        <TableCell key={product.id}>
                          {value
                            ? formatComparisonValue(value.value, value.unit)
                            : "Немає даних"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
