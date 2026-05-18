"use client";

import { useState } from "react";
import { ExplanationForm } from "@/features/admin/forms/explanation-form";
import {
  useCharacteristicExplanationsQuery,
  useCreateExplanationMutation,
  useDeleteExplanationMutation,
  useUpdateExplanationMutation,
} from "@/features/explanations/hooks/use-explanations";
import type { CharacteristicExplanation } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { ProtectedRoute } from "@/shared/components/ui/protected-route";

export default function AdminExplanationsPage() {
  const [editing, setEditing] = useState<CharacteristicExplanation | null>(null);
  const explanationsQuery = useCharacteristicExplanationsQuery();
  const createMutation = useCreateExplanationMutation();
  const deleteMutation = useDeleteExplanationMutation();
  const updateMutation = useUpdateExplanationMutation(editing?.id ?? "");

  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Admin explanations"
          title="CRUD для CharacteristicExplanation"
          description="Форма працює з полями `specificationKey`, `label`, `shortExplanation`, `detailedExplanation`, `practicalImpact`, `example`."
        />

        <Card>
          <CardHeader>
            <CardTitle>
              {editing ? "Редагування пояснення" : "Нове пояснення"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExplanationForm
              initialData={editing ?? undefined}
              submitLabel={editing ? "Оновити пояснення" : "Створити пояснення"}
              onSubmit={(values) => {
                if (editing) {
                  updateMutation.mutate(values, {
                    onSuccess: () => setEditing(null),
                  });
                  return;
                }

                createMutation.mutate(values);
              }}
            />
            {editing ? (
              <Button variant="outline" className="mt-4" onClick={() => setEditing(null)}>
                Скасувати редагування
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Наявні пояснення</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {explanationsQuery.isError ? (
              <ErrorState />
            ) : (
              (explanationsQuery.data ?? []).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/70 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {item.label} <span className="text-muted-foreground">({item.specificationKey})</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.shortExplanation}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setEditing(item)}>
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
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
