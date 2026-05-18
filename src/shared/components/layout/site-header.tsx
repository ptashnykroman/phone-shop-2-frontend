"use client";

import Link from "next/link";
import { Heart, LayoutDashboard, Scale, ShoppingCart, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuthSession, useLogoutMutation } from "@/features/auth/hooks/use-auth";
import { useCartQuery } from "@/features/cart/hooks/use-cart";
import { useFavoritesQuery } from "@/features/favorites/hooks/use-favorites";
import { primaryNavigation } from "@/shared/constants/navigation";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { HeaderSearch } from "@/shared/components/layout/header-search";

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuthSession();
  const logoutMutation = useLogoutMutation();
  const cartQuery = useCartQuery();
  const favoritesQuery = useFavoritesQuery();

  const counts = useMemo(
    () => ({
      cart: cartQuery.data?.totalQuantity ?? 0,
      favorites: favoritesQuery.data?.length ?? 0,
    }),
    [cartQuery.data?.totalQuantity, favoritesQuery.data?.length],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex min-h-[5rem] items-center gap-4 py-3">
          <Link href="/" className="min-w-fit">
            <div className="rounded-2xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground">
              PS
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <HeaderSearch />

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" asChild>
              <Link href="/favorites" aria-label="Обране">
                <div className="relative">
                  <Heart className="h-4 w-4" />
                  {counts.favorites > 0 ? (
                    <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                      {counts.favorites}
                    </span>
                  ) : null}
                </div>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/compare" aria-label="Порівняння">
                <Scale className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" aria-label="Кошик">
                <div className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {counts.cart > 0 ? (
                    <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {counts.cart}
                    </span>
                  ) : null}
                </div>
              </Link>
            </Button>

            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                {user.role === "ADMIN" ? (
                  <Button variant="secondary" asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4" />
                      Адмінка
                    </Link>
                  </Button>
                ) : null}
                <Button variant="ghost" asChild>
                  <Link href="/orders">
                    <UserCircle2 className="h-4 w-4" />
                    {user.firstName}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  Вийти
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Увійти</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Створити акаунт</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
