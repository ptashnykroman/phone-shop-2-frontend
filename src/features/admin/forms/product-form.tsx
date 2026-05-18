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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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

function FieldLabel({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {label}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </Label>
  );
}

function FieldHint({ text }: { text: string }) {
  return <p className="text-xs text-muted-foreground">{text}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-destructive">{message}</p>;
}

export function ProductForm({ product }: { product?: Product }) {
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
        <CardHeader className="space-y-2">
          <CardTitle>Основні дані товару</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="name" label="Назва" required />
            <Input id="name" {...form.register("name")} />
            <FieldError message={form.formState.errors.name?.message} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="slug" label="Slug" />
            <Input id="slug" {...form.register("slug")} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <FieldLabel htmlFor="description" label="Опис" required />
            <Textarea id="description" {...form.register("description")} />
            <FieldError message={form.formState.errors.description?.message} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <FieldLabel
              htmlFor="shortDescription"
              label="Короткий опис"
              required
            />
            <Textarea
              id="shortDescription"
              {...form.register("shortDescription")}
              className="min-h-[90px]"
            />
            <FieldError
              message={form.formState.errors.shortDescription?.message}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="price" label="Ціна" required />
            <Input
              id="price"
              type="number"
              step="0.01"
              {...form.register("price")}
            />
            <FieldError message={form.formState.errors.price?.message} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="oldPrice" label="Стара ціна" />
            <Input
              id="oldPrice"
              type="number"
              step="0.01"
              {...form.register("oldPrice")}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="stock" label="Склад" required />
            <Input id="stock" type="number" {...form.register("stock")} />
            <FieldError message={form.formState.errors.stock?.message} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="sku" label="SKU" required />
            <Input id="sku" {...form.register("sku")} />
            <FieldError message={form.formState.errors.sku?.message} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="color" label="Колір" />
            <Input id="color" {...form.register("color")} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="brandId" label="Бренд" required />
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
            <FieldError message={form.formState.errors.brandId?.message} />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="categoryId" label="Категорія" required />
            <Select
              id="categoryId"
              value={form.watch("categoryId")}
              onChange={(event) =>
                form.setValue("categoryId", event.target.value)
              }
              options={(categoriesQuery.data ?? []).map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              placeholder="Оберіть категорію"
            />
            <FieldError message={form.formState.errors.categoryId?.message} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <FieldLabel
              htmlFor="imagesText"
              label="URL зображень, кожен з нового рядка"
            />
            <Textarea id="imagesText" {...form.register("imagesText")} />
          </div>

          <label className="flex items-center gap-3 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={form.watch("isActive")}
              onChange={(event) =>
                form.setValue("isActive", event.target.checked)
              }
            />
            Товар активний
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <CardTitle>Характеристики</CardTitle>
            <p className="text-sm text-muted-foreground">
              Додайте параметри, які побачить покупець на сторінці товару та в
              порівнянні. Наприклад: діагональ екрана, пам'ять, камера,
              акумулятор.
            </p>
          </div>
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
          {fieldArray.fields.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
              Ще немає жодної характеристики. Додайте ключові параметри товару,
              щоб покупцю було легше зрозуміти модель і порівняти її з іншими.
            </div>
          ) : null}

          {fieldArray.fields.map((field, index) => {
            const specificationErrors =
              form.formState.errors.specifications?.[index];
            const fieldIdPrefix = `specification-${field.id}`;

            return (
              <div
                key={field.id}
                className="grid gap-4 rounded-2xl border border-border/70 p-4 lg:grid-cols-2 xl:grid-cols-3"
              >
                <div className="flex flex-col gap-3 lg:col-span-2 xl:col-span-3 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      Характеристика #{index + 1}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Заповніть назву для покупця, значення та, за потреби,
                      технічний ключ для фільтрів і пояснень.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => fieldArray.remove(index)}
                  >
                    Видалити
                  </Button>
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`${fieldIdPrefix}-groupName`}
                    label="Група"
                    required
                  />
                  <FieldHint text="Секція, у якій характеристика буде показана. Наприклад: Дисплей, Камера, Акумулятор." />
                  <Input
                    id={`${fieldIdPrefix}-groupName`}
                    placeholder="Наприклад: Дисплей"
                    {...form.register(`specifications.${index}.groupName`)}
                  />
                  <FieldError
                    message={specificationErrors?.groupName?.message}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`${fieldIdPrefix}-key`}
                    label="Ключ"
                    required
                  />
                  <FieldHint text="Службова назва латиницею без пробілів. Наприклад: screen_size, battery_capacity, ram." />
                  <Input
                    id={`${fieldIdPrefix}-key`}
                    placeholder="Наприклад: battery_capacity"
                    {...form.register(`specifications.${index}.key`)}
                  />
                  <FieldError message={specificationErrors?.key?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`${fieldIdPrefix}-label`}
                    label="Назва для покупця"
                    required
                  />
                  <FieldHint text="Людська назва характеристики, яку бачить користувач. Наприклад: Ємність акумулятора." />
                  <Input
                    id={`${fieldIdPrefix}-label`}
                    placeholder="Наприклад: Ємність акумулятора"
                    {...form.register(`specifications.${index}.label`)}
                  />
                  <FieldError message={specificationErrors?.label?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`${fieldIdPrefix}-value`}
                    label="Значення"
                    required
                  />
                  <FieldHint text="Текст, який буде показано поруч із назвою характеристики. Наприклад: 5000, OLED, 12/256." />
                  <Input
                    id={`${fieldIdPrefix}-value`}
                    placeholder="Наприклад: 5000"
                    {...form.register(`specifications.${index}.value`)}
                  />
                  <FieldError message={specificationErrors?.value?.message} />
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`${fieldIdPrefix}-numericValue`}
                    label="Числове значення"
                  />
                  <FieldHint text="Заповнюйте, якщо характеристику треба порівнювати або використовувати у фільтрах як число." />
                  <Input
                    id={`${fieldIdPrefix}-numericValue`}
                    type="number"
                    step="any"
                    placeholder="Наприклад: 5000"
                    {...form.register(`specifications.${index}.numericValue`)}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`${fieldIdPrefix}-unit`}
                    label="Одиниця виміру"
                  />
                  <FieldHint text="Наприклад: ГБ, мА·год, Гц, Мп. Якщо не потрібна, залиште поле порожнім." />
                  <Input
                    id={`${fieldIdPrefix}-unit`}
                    placeholder="Наприклад: мА·год"
                    {...form.register(`specifications.${index}.unit`)}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel
                    htmlFor={`${fieldIdPrefix}-importance`}
                    label="Важливість"
                    required
                  />
                  <FieldHint text="Число від 1 до 10. Чим вище значення, тим пріоритетніше характеристика." />
                  <Input
                    id={`${fieldIdPrefix}-importance`}
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Від 1 до 10"
                    {...form.register(`specifications.${index}.importance`)}
                  />
                  <FieldError
                    message={specificationErrors?.importance?.message}
                  />
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/30 p-3 lg:col-span-2 xl:col-span-3">
                  <Label
                    htmlFor={`${fieldIdPrefix}-isComparable`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      id={`${fieldIdPrefix}-isComparable`}
                      type="checkbox"
                      checked={form.watch(
                        `specifications.${index}.isComparable`,
                      )}
                      onChange={(event) =>
                        form.setValue(
                          `specifications.${index}.isComparable`,
                          event.target.checked,
                        )
                      }
                    />
                    Показувати в порівнянні товарів
                  </Label>
                  <FieldHint text="Увімкніть, якщо ця характеристика має сенс для порівняння між різними моделями." />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Button type="submit" size="lg">
        {product ? "Оновити товар" : "Створити товар"}
      </Button>
    </form>
  );
}
