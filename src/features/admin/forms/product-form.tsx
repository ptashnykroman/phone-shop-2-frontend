"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useBrandsQuery } from "@/features/brands/hooks/use-brands";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/features/products/hooks/use-products";
import type { Product } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const specificationSchema = z.object({
  groupName: z.string().min(1, "Вкажіть групу"),
  key: z.string().min(1, "Вкажіть ключ"),
  label: z.string().min(1, "Вкажіть label"),
  value: z.string().min(1, "Вкажіть значення"),
  numericValue: z.string().optional(),
  unit: z.string().optional(),
  importance: z.coerce.number().min(1).max(10),
  isComparable: z.boolean(),
});

const productFormSchema = z.object({
  name: z.string().min(2, "Вкажіть назву"),
  slug: z.string().optional(),
  description: z.string().min(10, "Опис занадто короткий"),
  shortDescription: z.string().min(10, "Короткий опис занадто короткий"),
  price: z.coerce.number().min(0, "Ціна не може бути від'ємною"),
  oldPrice: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  sku: z.string().min(2, "Вкажіть SKU"),
  color: z.string().optional(),
  imagesText: z.string().optional(),
  isActive: z.boolean(),
  brandId: z.string().uuid("Оберіть бренд"),
  categoryId: z.string().uuid("Оберіть категорію"),
  specifications: z.array(specificationSchema),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function ProductForm({
  product,
}: {
  product?: Product;
}) {
  const router = useRouter();
  const brandsQuery = useBrandsQuery();
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation(product?.id ?? "");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          oldPrice: product.oldPrice ? String(product.oldPrice) : "",
          stock: product.stock,
          sku: product.sku,
          color: product.color ?? "",
          imagesText: product.images.join("\n"),
          isActive: product.isActive,
          brandId: product.brandId,
          categoryId: product.categoryId,
          specifications: product.specifications.map((specification) => ({
            groupName: specification.groupName,
            key: specification.key,
            label: specification.label,
            value: specification.value,
            numericValue:
              specification.numericValue !== null
                ? String(specification.numericValue)
                : "",
            unit: specification.unit ?? "",
            importance: specification.importance,
            isComparable: specification.isComparable,
          })),
        }
      : {
          name: "",
          slug: "",
          description: "",
          shortDescription: "",
          price: 0,
          oldPrice: "",
          stock: 0,
          sku: "",
          color: "",
          imagesText: "",
          isActive: true,
          brandId: "",
          categoryId: "",
          specifications: [],
        },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const submit = (values: ProductFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description,
      shortDescription: values.shortDescription,
      price: values.price,
      oldPrice: values.oldPrice ? Number(values.oldPrice) : undefined,
      stock: values.stock,
      sku: values.sku,
      color: values.color || undefined,
      images: values.imagesText
        ? values.imagesText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      isActive: values.isActive,
      brandId: values.brandId,
      categoryId: values.categoryId,
      specifications: values.specifications.map((specification) => ({
        groupName: specification.groupName,
        key: specification.key,
        label: specification.label,
        value: specification.value,
        numericValue: specification.numericValue
          ? Number(specification.numericValue)
          : undefined,
        unit: specification.unit || undefined,
        importance: specification.importance,
        isComparable: specification.isComparable,
      })),
    };

    const mutation = product ? updateMutation : createMutation;

    mutation.mutate(payload, {
      onSuccess: () => router.push("/admin/products"),
    });
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      <Card>
        <CardHeader>
          <CardTitle>Основні дані товару</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Назва</Label>
            <Input id="name" {...form.register("name")} />
            <p className="text-xs text-destructive">{form.formState.errors.name?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...form.register("slug")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Опис</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shortDescription">Короткий опис</Label>
            <Textarea
              id="shortDescription"
              {...form.register("shortDescription")}
              className="min-h-[90px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Ціна</Label>
            <Input id="price" type="number" step="0.01" {...form.register("price")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oldPrice">Стара ціна</Label>
            <Input id="oldPrice" type="number" step="0.01" {...form.register("oldPrice")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Склад</Label>
            <Input id="stock" type="number" {...form.register("stock")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...form.register("sku")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Колір</Label>
            <Input id="color" {...form.register("color")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandId">Бренд</Label>
            <Select
              id="brandId"
              value={form.watch("brandId")}
              onChange={(event) => form.setValue("brandId", event.target.value)}
              options={(brandsQuery.data ?? []).map((brand) => ({
                label: brand.name,
                value: brand.id,
              }))}
              placeholder="Оберіть бренд"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Категорія</Label>
            <Select
              id="categoryId"
              value={form.watch("categoryId")}
              onChange={(event) => form.setValue("categoryId", event.target.value)}
              options={(categoriesQuery.data ?? []).map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              placeholder="Оберіть категорію"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="imagesText">URL зображень, кожен з нового рядка</Label>
            <Textarea id="imagesText" {...form.register("imagesText")} />
          </div>
          <label className="flex items-center gap-3 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={form.watch("isActive")}
              onChange={(event) => form.setValue("isActive", event.target.checked)}
            />
            Товар активний
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Характеристики</CardTitle>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              fieldArray.append({
                groupName: "",
                key: "",
                label: "",
                value: "",
                numericValue: "",
                unit: "",
                importance: 5,
                isComparable: true,
              })
            }
          >
            Додати характеристику
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fieldArray.fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 rounded-2xl border border-border/70 p-4 md:grid-cols-3"
            >
              <Input placeholder="groupName" {...form.register(`specifications.${index}.groupName`)} />
              <Input placeholder="key" {...form.register(`specifications.${index}.key`)} />
              <Input placeholder="label" {...form.register(`specifications.${index}.label`)} />
              <Input placeholder="value" {...form.register(`specifications.${index}.value`)} />
              <Input placeholder="numericValue" {...form.register(`specifications.${index}.numericValue`)} />
              <Input placeholder="unit" {...form.register(`specifications.${index}.unit`)} />
              <Input
                type="number"
                placeholder="importance"
                {...form.register(`specifications.${index}.importance`)}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.watch(`specifications.${index}.isComparable`)}
                  onChange={(event) =>
                    form.setValue(
                      `specifications.${index}.isComparable`,
                      event.target.checked,
                    )
                  }
                />
                comparable
              </label>
              <Button
                type="button"
                variant="destructive"
                onClick={() => fieldArray.remove(index)}
              >
                Видалити
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" size="lg">
        {product ? "Оновити товар" : "Створити товар"}
      </Button>
    </form>
  );
}
