"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Brand, Category, ProductSortBy } from "@/shared/api/api-types";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";

interface CatalogFiltersProps {
  brands: Brand[];
  categories: Category[];
}

export function CatalogFilters({ brands, categories }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      brandIds: searchParams.get("brandIds") ?? "",
      categoryIds: searchParams.get("categoryIds") ?? "",
      colors: searchParams.get("colors") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      specifications: searchParams.get("specifications") ?? "",
      sortBy: (searchParams.get("sortBy") as ProductSortBy | null) ?? "newest",
      sortOrder: searchParams.get("sortOrder") ?? "desc",
      inStock: searchParams.get("inStock") === "true",
    }),
    [searchParams],
  );

  const [form, setForm] = useState(initial);

  const submit = () => {
    const params = new URLSearchParams();

    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) {
          params.set(key, "true");
        }
        return;
      }

      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фільтри каталогу</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
          value={form.search}
          onChange={(event) =>
            setForm((current) => ({ ...current, search: event.target.value }))
          }
          placeholder="Пошук"
        />
        <Select
          value={form.brandIds}
          onChange={(event) =>
            setForm((current) => ({ ...current, brandIds: event.target.value }))
          }
          options={brands.map((brand) => ({
            label: brand.name,
            value: brand.id,
          }))}
          placeholder="Оберіть бренд"
        />
        <Select
          value={form.categoryIds}
          onChange={(event) =>
            setForm((current) => ({ ...current, categoryIds: event.target.value }))
          }
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          placeholder="Оберіть категорію"
        />
        <Select
          value={form.sortBy}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              sortBy: event.target.value as ProductSortBy,
            }))
          }
          options={[
            { label: "Найновіші", value: "newest" },
            { label: "За ціною", value: "price" },
            { label: "За рейтингом", value: "rating" },
            { label: "За популярністю", value: "popularity" },
          ]}
        />
        <Input
          value={form.colors}
          onChange={(event) =>
            setForm((current) => ({ ...current, colors: event.target.value }))
          }
          placeholder="Кольори через кому"
        />
        <Input
          type="number"
          value={form.minPrice}
          onChange={(event) =>
            setForm((current) => ({ ...current, minPrice: event.target.value }))
          }
          placeholder="Мін. ціна"
        />
        <Input
          type="number"
          value={form.maxPrice}
          onChange={(event) =>
            setForm((current) => ({ ...current, maxPrice: event.target.value }))
          }
          placeholder="Макс. ціна"
        />
        <Input
          value={form.specifications}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              specifications: event.target.value,
            }))
          }
          placeholder="specKey:value"
        />
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(event) =>
              setForm((current) => ({ ...current, inStock: event.target.checked }))
            }
          />
          Лише в наявності
        </label>
        <div className="flex gap-3 md:col-span-2 xl:col-span-4">
          <Button onClick={submit}>Застосувати</Button>
          <Button variant="outline" onClick={() => router.push("/products")}>
            Скинути
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
