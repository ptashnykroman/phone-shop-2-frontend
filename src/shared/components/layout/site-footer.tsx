import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="page-shell flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">Phone Shop</p>
          <p>Преміальний каталог смартфонів із чесним порівнянням і зрозумілими поясненнями.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/products" className="hover:text-foreground">
            Каталог
          </Link>
          <Link href="/compare" className="hover:text-foreground">
            Порівняння
          </Link>
          <Link href="/favorites" className="hover:text-foreground">
            Обране
          </Link>
        </div>
      </div>
    </footer>
  );
}
