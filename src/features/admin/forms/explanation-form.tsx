"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CharacteristicExplanation } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const explanationSchema = z.object({
  specificationKey: z.string().min(1, "Вкажіть specificationKey"),
  label: z.string().min(1, "Вкажіть label"),
  shortExplanation: z.string().min(10, "Коротке пояснення занадто коротке"),
  detailedExplanation: z.string().min(10, "Детальне пояснення занадто коротке"),
  practicalImpact: z.string().min(10, "Опишіть практичний вплив"),
  example: z.string().optional(),
});

type ExplanationFormValues = z.infer<typeof explanationSchema>;

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
    defaultValues: initialData
      ? {
          specificationKey: initialData.specificationKey,
          label: initialData.label,
          shortExplanation: initialData.shortExplanation,
          detailedExplanation: initialData.detailedExplanation,
          practicalImpact: initialData.practicalImpact,
          example: initialData.example ?? "",
        }
      : {
          specificationKey: "",
          label: "",
          shortExplanation: "",
          detailedExplanation: "",
          practicalImpact: "",
          example: "",
        },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="specificationKey">specificationKey</Label>
        <Input id="specificationKey" {...form.register("specificationKey")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" {...form.register("label")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="shortExplanation">Short explanation</Label>
        <Textarea id="shortExplanation" {...form.register("shortExplanation")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="detailedExplanation">Detailed explanation</Label>
        <Textarea id="detailedExplanation" {...form.register("detailedExplanation")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="practicalImpact">Practical impact</Label>
        <Textarea id="practicalImpact" {...form.register("practicalImpact")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="example">Example</Label>
        <Textarea id="example" {...form.register("example")} />
      </div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
