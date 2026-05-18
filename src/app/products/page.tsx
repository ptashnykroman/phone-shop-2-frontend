import type { Metadata } from "next";
import { serverApi } from "@/shared/api/server-fetch";
import { ProductCard } from "@/features/products/components/product-card";
import { CatalogFilters } from "@/features/catalog/components/catalog-filters";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { PageHeader } from "@/shared/components/ui/page-header";
import { PaginationControls } from "@/shared/components/ui/pagination-controls";

export const metadata: Metadata = {
  title: "Каталог смартфонів",
  description:
    "Каталог мобільних телефонів з фільтрами, порівнянням та поясненням характеристик.",
};

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");

  try {
    const [products, brands, categories] = await Promise.all([
      serverApi.products({
        page,
        limit: Number(params.limit ?? "12"),
        search: typeof params.search === "string" ? params.search : undefined,
        brandIds:
          typeof params.brandIds === "string" ? [params.brandIds] : undefined,
        categoryIds:
          typeof params.categoryIds === "string"
            ? [params.categoryIds]
            : undefined,
        colors: typeof params.colors === "string" ? [params.colors] : undefined,
        minPrice:
          typeof params.minPrice === "string"
            ? Number(params.minPrice)
            : undefined,
        maxPrice:
          typeof params.maxPrice === "string"
            ? Number(params.maxPrice)
            : undefined,
        inStock: params.inStock === "true",
        sortBy:
          typeof params.sortBy === "string"
            ? (params.sortBy as never)
            : undefined,
        sortOrder:
          typeof params.sortOrder === "string"
            ? (params.sortOrder as never)
            : undefined,
        specifications:
          typeof params.specifications === "string"
            ? params.specifications
            : undefined,
      }),
      serverApi.brands(),
      serverApi.categories(),
    ]);

    return (
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Каталог"
          title="Обирайте смартфон під свій сценарій"
        />

        <CatalogFilters brands={brands} categories={categories} />

        {products.items.length === 0 ? (
          <EmptyState
            title="За цими фільтрами товарів не знайдено"
            description="Спробуйте розширити діапазон ціни, змінити бренд або скинути додаткові специфікації."
            actionLabel="Скинути фільтри"
            actionHref="/products"
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {products.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <PaginationControls
              page={products.meta.page}
              totalPages={products.meta.totalPages ?? 1}
              buildHref={(nextPage) => {
                const nextParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                  if (typeof value === "string") {
                    nextParams.set(key, value);
                  }
                });
                nextParams.set("page", String(nextPage));
                return `/products?${nextParams.toString()}`;
              }}
            />
          </>
        )}
      </div>
    );
  } catch {
    return (
      <div className="page-shell section-space">
        <ErrorState />
      </div>
    );
  }
}
