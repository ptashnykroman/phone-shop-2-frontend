import type { ComparisonResponse } from "@/shared/api/api-types";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

export function CompareSummary({
  comparison,
  hideIdentical,
}: {
  comparison: ComparisonResponse;
  hideIdentical: boolean;
}) {
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
          {comparison.highlightedDifferences.map((difference) => (
            <div key={difference.key} className="rounded-2xl border border-border/70 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{difference.label}</p>
                <Badge variant="outline">{difference.type}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {difference.explanation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Переможець за категоріями</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {comparison.winnerByCategory.map((winner) => (
            <div key={winner.category} className="rounded-2xl border border-border/70 p-4">
              <p className="font-semibold capitalize">{winner.category}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {winner.winnerProductIds.length > 1 ? "Нічия" : "Є явний лідер"}
              </p>
              <p className="mt-2 text-2xl font-bold">{winner.score}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {visibleGroups.map((group) => (
        <Card key={group.groupName}>
          <CardHeader>
            <CardTitle>{group.groupName}</CardTitle>
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
                    <TableCell className="font-medium">{item.label}</TableCell>
                    {comparison.products.map((product) => {
                      const value = item.values.find(
                        (entry) => entry.productId === product.id,
                      );
                      return (
                        <TableCell key={product.id}>
                          {value ? `${value.value}${value.unit ? ` ${value.unit}` : ""}` : "N/A"}
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
