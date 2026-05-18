import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/features/products/components/product-card";
import heroPhoneImage from "@/shared/assets/hero-image.png";
import { serverApi } from "@/shared/api/server-fetch";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latestProducts, popularProducts] = await Promise.all([
    serverApi.products({ limit: 4, sortBy: "newest", sortOrder: "desc" }),
    serverApi.products({ limit: 4, sortBy: "popularity", sortOrder: "desc" }),
  ]);

  return (
    <div className="section-space">
      <section className="page-shell">
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-hero-grid p-6 shadow-soft dark:bg-hero-grid-dark sm:p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="space-y-4">
                  <h1 className="max-w-2xl font-semibold leading-tight text-3xl sm:text-4xl xl:text-5xl">
                    Обирайте смартфон під свій стиль, задачі та бюджет
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Актуальні моделі від популярних брендів та чесні ціни. Від
                    камерофона до ігрового флагмана, усе зручно в одному
                    магазині.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/products">
                      Перейти до каталогу
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="h-full border-border/70 bg-background/85">
                  <CardContent className="space-y-3 p-5">
                    <Truck className="h-5 w-5 text-primary" />
                    <p className="font-semibold">Швидка доставка</p>
                    <p className="text-sm text-muted-foreground">
                      Оперативно відправляємо товари по всій території Україні.
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full border-border/70 bg-background/85">
                  <CardContent className="space-y-3 p-5">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <p className="font-semibold">Офіційна гарантія</p>
                    <p className="text-sm text-muted-foreground">
                      Обирайте смартфони з прозорими умовами сервісу та
                      підтримкою після покупки.
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full border-border/70 bg-background/85">
                  <CardContent className="space-y-3 p-5">
                    <Headphones className="h-5 w-5 text-primary" />
                    <p className="font-semibold">Допомога з вибором</p>
                    <p className="text-sm text-muted-foreground">
                      Легко знайти модель для фото, ігор, роботи чи щоденного
                      користування.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative mx-auto hidden lg:flex w-full items-center justify-center">
              <div className="relative w-full sm:p-2">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
                  <Image
                    src={heroPhoneImage}
                    alt="Смартфон у hero секції"
                    fill
                    priority
                    sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 80vw"
                    className="object-contain drop-shadow-[0_28px_50px_rgba(15,23,42,0.24)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-14 space-y-6">
        <PageHeader eyebrow="Новинки" title="Свіжі надходження" />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {latestProducts.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell mt-14 space-y-6">
        <PageHeader eyebrow="Популярні моделі" title="Що обирають найчастіше" />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {popularProducts.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
