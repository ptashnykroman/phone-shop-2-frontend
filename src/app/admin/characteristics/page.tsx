"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useCreateCharacteristicMutation,
  useDeleteCharacteristicMutation,
  useProductCharacteristicsQuery,
  useUpdateCharacteristicMutation,
} from "@/features/characteristics/hooks/use-characteristics";
import { useProductsQuery } from "@/features/products/hooks/use-products";
import type { ProductSpecificationInput } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ErrorState } from "@/shared/components/ui/error-state";
import { Input } from "@/shared/components/ui/input";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";
import { Select } from "@/shared/components/ui/select";

const emptySpec: ProductSpecificationInput = {
  groupName: "",
  key: "",
  label: "",
  value: "",
  unit: "",
  importance: 5,
  isComparable: true,
};

export default function AdminCharacteristicsPage() {
  const productsQuery = useProductsQuery({ page: 1, limit: 50 });
  const [productId, setProductId] = useState("");
  const [draft, setDraft] = useState<ProductSpecificationInput>(emptySpec);
  const [editingId, setEditingId] = useState<string | null>(null);
  const characteristicsQuery = useProductCharacteristicsQuery(productId);
  const createMutation = useCreateCharacteristicMutation(productId);
  const updateMutation = useUpdateCharacteristicMutation(productId, editingId ?? "");
  const deleteMutation = useDeleteCharacteristicMutation(productId);

  useEffect(() => {
    if (!productId && productsQuery.data?.items[0]) {
      setProductId(productsQuery.data.items[0].id);
    }
  }, [productId, productsQuery.data?.items]);

  const currentProduct = useMemo(
    () => productsQuery.data?.items.find((product) => product.id === productId),
    [productId, productsQuery.data?.items],
  );

  const submit = () => {
    if (editingId) {
      updateMutation.mutate(draft, {
        onSuccess: () => {
          setEditingId(null);
          setDraft(emptySpec);
        },
      });
      return;
    }

    createMutation.mutate(draft, {
      onSuccess: () => setDraft(emptySpec),
    });
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Admin characteristics"
          title="Керування характеристиками"
          description="CRUD для `products/:productId/specifications` з вибором конкретного товару."
        />

        {productsQuery.isError ? (
          <ErrorState />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Оберіть товар</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  options={(productsQuery.data?.items ?? []).map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                  placeholder="Оберіть товар"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? "Редагування характеристики" : "Нова характеристика"}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Input
                  placeholder="groupName"
                  value={draft.groupName}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, groupName: event.target.value }))
                  }
                />
                <Input
                  placeholder="key"
                  value={draft.key}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, key: event.target.value }))
                  }
                />
                <Input
                  placeholder="label"
                  value={draft.label}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, label: event.target.value }))
                  }
                />
                <Input
                  placeholder="value"
                  value={draft.value}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, value: event.target.value }))
                  }
                />
                <Input
                  placeholder="numericValue"
                  value={draft.numericValue ? String(draft.numericValue) : ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      numericValue: event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    }))
                  }
                />
                <Input
                  placeholder="unit"
                  value={draft.unit ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, unit: event.target.value }))
                  }
                />
                <Input
                  placeholder="importance"
                  type="number"
                  value={draft.importance ?? 5}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      importance: Number(event.target.value),
                    }))
                  }
                />
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.isComparable ?? true}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        isComparable: event.target.checked,
                      }))
                    }
                  />
                  Comparable
                </label>
                <div className="flex gap-3 md:col-span-2 xl:col-span-4">
                  <Button onClick={submit}>
                    {editingId ? "Оновити" : "Створити"}
                  </Button>
                  {editingId ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setDraft(emptySpec);
                      }}
                    >
                      Скасувати
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Характеристики товару {currentProduct ? `• ${currentProduct.name}` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {characteristicsQuery.isError ? (
                  <ErrorState />
                ) : (
                  (characteristicsQuery.data ?? []).map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.groupName} • {item.key} • {item.value}
                          {item.unit ? ` ${item.unit}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingId(item.id);
                            setDraft({
                              groupName: item.groupName,
                              key: item.key,
                              label: item.label,
                              value: item.value,
                              numericValue: item.numericValue ?? undefined,
                              unit: item.unit ?? undefined,
                              importance: item.importance,
                              isComparable: item.isComparable,
                            });
                          }}
                        >
                          Редагувати
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(item.id)}
                        >
                          Видалити
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
