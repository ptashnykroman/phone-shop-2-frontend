"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuthSession } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { hydrated, user } = useAuthSession();

  if (!hydrated) {
    return <div className="page-shell section-space text-sm text-muted-foreground">Завантаження...</div>;
  }

  if (!user) {
    return (
      <div className="page-shell section-space">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Потрібна авторизація
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Щоб продовжити, увійдіть у свій акаунт.
            </p>
            <Button asChild>
              <Link href="/auth/login">Увійти</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminOnly && user.role !== "ADMIN") {
    return (
      <div className="page-shell section-space">
        <Card>
          <CardHeader>
            <CardTitle>Недостатньо прав</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ця сторінка доступна лише адміністраторам.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
