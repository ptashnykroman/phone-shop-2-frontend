"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CharacteristicExplanation } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const explanationSchema = z.object({
  specificationKey: z
    .string()
    .min(1, "Вкажіть ключ характеристики"),
  label: z
    .string()
    .min(1, "Вкажіть назву характеристики"),
  shortExplanation: z
    .string()
    .min(10, "Коротке пояснення занадто коротке"),
  detailedExplanation: z
    .string()
    .min(10, "Детальне пояснення занадто коротке"),
  practicalImpact: z
    .string()
    .min(10, "Опишіть практичний вплив"),
  example: z.string().optional(),
});

type ExplanationFormValues = z.infer<typeof explanationSchema>;

const emptyValues: ExplanationFormValues = {
  specificationKey: "",
  label: "",
  shortExplanation: "",
  detailedExplanation: "",
  practicalImpact: "",
  example: "",
};

function toFormValues(
  initialData?: CharacteristicExplanation,
): ExplanationFormValues {
  if (!initialData) {
    return emptyValues;
  }

  return {
    specificationKey: initialData.specificationKey,
    label: initialData.label,
    shortExplanation: initialData.shortExplanation,
    detailedExplanation: initialData.detailedExplanation,
    practicalImpact: initialData.practicalImpact,
    example: initialData.example ?? "",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-destructive">{message}</p>;
}

export function ExplanationForm({
  initialData,
  submitLabel,
  onSubmit,
}: {
  initialData?: CharacteristicExplanation;
  submitLabel: string;
  onSubmit: (values: ExplanationFormValues) => void;
}) {
  const form = useForm<ExplanationFormValues>({
    resolver: zodResolver(explanationSchema),
    defaultValues: toFormValues(initialData),
  });

  useEffect(() => {
    form.reset(toFormValues(initialData));
  }, [form, initialData]);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="specificationKey">Ключ характеристики</Label>
        <Input
          id="specificationKey"
          placeholder="battery_mah"
          {...form.register("specificationKey")}
        />
        <p className="text-xs text-muted-foreground">
          Системний ключ, за яким пояснення підтягується до товарів.
        </p>
        <FieldError message={form.formState.errors.specificationKey?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Назва характеристики</Label>
        <Input
          id="label"
          placeholder="Ємність акумулятора"
          {...form.register("label")}
        />
        <FieldError message={form.formState.errors.label?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortExplanation">Коротке пояснення</Label>
        <Textarea
          id="shortExplanation"
          placeholder="Коротко поясніть, що означає ця характеристика."
          {...form.register("shortExplanation")}
        />
        <FieldError message={form.formState.errors.shortExplanation?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="detailedExplanation">Детальне пояснення</Label>
        <Textarea
          id="detailedExplanation"
          placeholder="Опишіть детальніше, як працює ця характеристика."
          {...form.register("detailedExplanation")}
        />
        <FieldError message={form.formState.errors.detailedExplanation?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="practicalImpact">Практичний вплив</Label>
        <Textarea
          id="practicalImpact"
          placeholder="Поясніть, як це впливає на реальне користування."
          {...form.register("practicalImpact")}
        />
        <FieldError message={form.formState.errors.practicalImpact?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="example">Приклад</Label>
        <Textarea
          id="example"
          placeholder="Наприклад: смартфон витримає цілий день без підзарядки."
          {...form.register("example")}
        />
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
