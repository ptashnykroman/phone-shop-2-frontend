"use client";

import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { useCompareStore } from "@/features/comparison/stores/compare-store";
import type { AlternativesResponse } from "@/shared/api/api-types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatAlternativeGroup, formatPrice } from "@/shared/utils/formatters";

export function AlternativesPanel({
  alternatives,
}: {
  alternatives: AlternativesResponse;
}) {
  const compareStore = useCompareStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Можливо, краще обрати</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(alternatives.alternativesByType).map(([key, items]) =>
          items.length > 0 ? (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{formatAlternativeGroup(key)}</h3>
                <Badge variant="outline">{items.length} варіанти</Badge>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={`${item.product.id}-${item.reasonType}`} className="border-border/70">
                    <CardHeader className="space-y-3">
                      <Badge>{item.title}</Badge>
                      <div>
                        <h4 className="text-lg font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {formatPrice(item.product.price)}
                        </span>
                        <Badge variant={item.priceDifference <= 0 ? "accent" : "outline"}>
                          {item.priceDifference >= 0 ? "+" : ""}
                          {formatPrice(item.priceDifference)}
                        </Badge>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {item.mainAdvantages.map((advantage) => (
                          <li key={advantage}>• {advantage}</li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/products/${item.product.slug}`}>
                            Переглянути
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            compareStore.addProduct(alternatives.sourceProduct.id);
                            compareStore.addProduct(item.product.id);
                          }}
                        >
                          <Scale className="h-4 w-4" />
                          Порівняти
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </CardContent>
    </Card>
  );
}
