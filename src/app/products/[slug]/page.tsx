import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverApi } from "@/shared/api/server-fetch";
import { AlternativesPanel } from "@/features/alternatives/components/alternatives-panel";
import { PerformanceBreakdown } from "@/features/performance/components/performance-breakdown";
import { ProductDetailAside } from "@/features/products/components/product-detail-aside";
import { ReviewForm } from "@/features/reviews/components/review-form";
import { ReviewList } from "@/features/reviews/components/review-list";
import { ExplainedSpecifications } from "@/features/specifications/components/explained-specifications";
import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await serverApi.productBySlug(slug);
    return {
      title: product.name,
      description: product.shortDescription,
      openGraph: {
        title: product.name,
        description: product.shortDescription,
        images: product.images[0] ? [product.images[0]] : [],
      },
    };
  } catch {
    return {
      title: "Товар не знайдено",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await serverApi.productBySlug(slug);
  } catch {
    notFound();
  }

  const [explained, performance, alternatives, reviews] = await Promise.all([
    serverApi.explainedSpecifications(product.id).catch(() => []),
    serverApi.performance(product.id).catch(() => null),
    serverApi.alternatives(product.id).catch(() => null),
    serverApi.reviews(product.id).catch(() => []),
  ]);

  return (
    <div className="page-shell section-space space-y-8">
      <Breadcrumbs
        items={[
          { label: "Головна", href: "/" },
          { label: "Каталог", href: "/products" },
          { label: product.name },
        ]}
      />

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_0.32fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/70 bg-muted">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="grid gap-4">
              {product.images.slice(1, 4).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-border/70 bg-muted"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Коротко про модель</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{product.description}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {product.specifications.slice(0, 6).map((specification) => (
                  <div
                    key={specification.id}
                    className="rounded-2xl border border-border/70 bg-muted/30 p-4"
                  >
                    <p className="text-sm text-muted-foreground">
                      {specification.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {specification.value}
                      {specification.unit ? ` ${specification.unit}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <ProductDetailAside product={product} />
      </section>

      {explained.length > 0 ? (
        <ExplainedSpecifications groups={explained} />
      ) : null}

      {performance ? <PerformanceBreakdown score={performance} /> : null}

      {alternatives ? <AlternativesPanel alternatives={alternatives} /> : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ReviewList reviews={reviews} />
        <ReviewForm productId={product.id} />
      </section>
    </div>
  );
}
