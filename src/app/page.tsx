import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { serverApi } from "@/shared/api/server-fetch";
import { ProductCard } from "@/features/products/components/product-card";
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
        <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-hero-grid p-8 shadow-soft dark:bg-hero-grid-dark lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="space-y-6">
              <PageHeader
                eyebrow="Premium electronics store"
                title="Смартфон без маркетингового шуму"
                description="Phone Shop поєднує класичний e-commerce каталог із дипломними фічами: поясненням складних характеристик, візуальною шкалою продуктивності, блоком кращих альтернатив і чесним порівнянням реальних відмінностей."
                actions={
                  <>
                    <Button asChild size="lg">
                      <Link href="/products">
                        До каталогу
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/compare">Спробувати порівняння</Link>
                    </Button>
                  </>
                }
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-background/80">
                  <CardContent className="space-y-2 p-5">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <p className="font-semibold">Прості пояснення</p>
                    <p className="text-sm text-muted-foreground">
                      Кожна важлива характеристика пояснюється коротко й по
                      суті.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/80">
                  <CardContent className="space-y-2 p-5">
                    <Zap className="h-5 w-5 text-primary" />
                    <p className="font-semibold">Шкала продуктивності</p>
                    <p className="text-sm text-muted-foreground">
                      Backend уже рахує оцінки для ігор, батареї, дисплея й
                      довговічності.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/80">
                  <CardContent className="space-y-2 p-5">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <p className="font-semibold">Чесне порівняння</p>
                    <p className="text-sm text-muted-foreground">
                      Показуємо не всю таблицю підряд, а тільки справді значущі
                      відмінності.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-primary/20 bg-background/80">
              <CardContent className="space-y-5 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Чому цей frontend узгоджений з backend
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    • auth flow працює через `accessToken` + `refreshToken` у
                    body
                  </li>
                  <li>• guest cart прив'язаний до `x-session-id`</li>
                  <li>
                    • explained specifications, performance, alternatives і
                    compare не рахуються на frontend
                  </li>
                  <li>
                    • order/payment статуси строго повторюють backend enum-и
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="page-shell mt-14 space-y-6">
        <PageHeader
          eyebrow="Новинки"
          title="Свіжі товари"
          description="Останні моделі, які вже доступні для перегляду, додавання в кошик та порівняння."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {latestProducts.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell mt-14 space-y-6">
        <PageHeader
          eyebrow="Популярні моделі"
          title="Що дивляться найчастіше"
          description="Підбірка моделей із найкращою динамікою за рейтингом і популярністю."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {popularProducts.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
