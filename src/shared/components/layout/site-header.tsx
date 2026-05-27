"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Scale,
  ShoppingCart,
  UserCircle2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useAuthSession,
  useLogoutMutation,
} from "@/features/auth/hooks/use-auth";
import { useCartQuery } from "@/features/cart/hooks/use-cart";
import { HeaderSearch } from "@/shared/components/layout/header-search";
import { Button } from "@/shared/components/ui/button";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import logo from "@/shared/assets/logo.png";
import { primaryNavigation } from "@/shared/constants/navigation";
import { cn } from "@/shared/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuthSession();
  const logoutMutation = useLogoutMutation();
  const cartQuery = useCartQuery();
  const cartCount = cartQuery.data?.totalQuantity ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex min-h-[5rem] items-center gap-4 py-3">
          <Link
            href="/"
            aria-label="Phone Shop"
            className="flex min-w-fit items-center gap-3 rounded-2xl transition-opacity hover:opacity-90"
          >
            <img
              src={logo.src}
              alt="Phone Shop"
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

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />

            <Button variant="ghost" size="icon" asChild>
              <Link href="/compare" aria-label="Порівняння">
                <Scale className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" aria-label="Кошик">
                <div className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 ? (
                    <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {cartCount}
                    </span>
                  ) : null}
                </div>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link
                href={user ? "/profile" : "/auth/login"}
                aria-label={user ? "Профіль" : "Увійти"}
              >
                <UserCircle2 className="h-4 w-4" />
              </Link>
            </Button>

            {user ? (
              <div className="hidden items-center gap-1 md:flex">
                {user.role === "ADMIN" ? (
                  <Button variant="secondary" asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4" />
                      Адмінка
                    </Link>
                  </Button>
                ) : null}
                <Button variant="ghost" asChild>
                  <Link href="/profile">
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
                  <Link href="/auth/register">Зареєструватися</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
