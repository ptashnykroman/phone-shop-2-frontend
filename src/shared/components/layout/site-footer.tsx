import Link from "next/link";

import logo from "@/shared/assets/logo.png";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="page-shell flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            aria-label="Phone Shop"
            className="flex min-w-fit items-center gap-3 rounded-2xl transition-opacity hover:opacity-90"
          >
            <Image
              src={logo}
              alt="Phone Shop"
              priority
              className="h-11 w-auto shrink-0"
            />
            <div className="hidden min-w-fit flex-col leading-none sm:flex">
              <span className="text-base font-semibold tracking-tight text-foreground">
                Phone Shop
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Smart store
              </span>
            </div>
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/products" className="hover:text-foreground">
            Каталог
          </Link>
          <Link href="/compare" className="hover:text-foreground">
            Порівняння
          </Link>
        </div>
      </div>
    </footer>
  );
}
