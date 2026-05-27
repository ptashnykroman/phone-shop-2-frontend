'use client'

import Link from 'next/link'
import { Heart, LayoutDashboard, Mail, Package, Phone, ShieldCheck } from 'lucide-react'
import { useAuthSession } from '@/features/auth/hooks/use-auth'
import { useFavoritesQuery } from '@/features/favorites/hooks/use-favorites'
import { useMyOrdersQuery } from '@/features/orders/hooks/use-orders'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PageHeader } from '@/shared/components/ui/page-header'
import { ProtectedRoute } from '@/shared/components/ui/protected-route'
import { formatDate } from '@/shared/utils/formatters'

function getRoleLabel(role: 'USER' | 'ADMIN' | 'GUEST' | undefined) {
  if (role === 'ADMIN') {
    return 'Адміністратор'
  }

  if (role === 'USER') {
    return 'Користувач'
  }

  return 'Гість'
}

export default function ProfilePage() {
  const { user } = useAuthSession()
  const favoritesQuery = useFavoritesQuery()
  const ordersQuery = useMyOrdersQuery()

  const favoritesCount = favoritesQuery.data?.length ?? 0
  const ordersCount = ordersQuery.data?.length ?? 0

  return (
    <ProtectedRoute>
      <div className="page-shell section-space space-y-8">
        <PageHeader
          eyebrow="Profile"
          title={user ? `${user.firstName} ${user.lastName}` : 'Профіль'}
          actions={
            user?.role === 'ADMIN' ? (
              <Button variant="secondary" asChild>
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  Адмінка
                </Link>
              </Button>
            ) : null
          }
        />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle>Дані акаунта</CardTitle>
                {user?.role === 'ADMIN' ? <Badge>{getRoleLabel(user?.role)}</Badge> : null}
              </div>
              <CardDescription>Основна інформація про ваш профіль.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</p>
                <p className="mt-3 flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-primary" />
                  {user?.email ?? 'Немає даних'}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Телефон</p>
                <p className="mt-3 flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4 text-primary" />
                  {user?.phone ?? 'Не вказано'}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="flex h-full flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Обране
                  </CardTitle>
                  <Badge variant="accent">
                    {favoritesQuery.isPending ? 'Оновлюємо...' : `${favoritesCount} товарів`}
                  </Badge>
                </div>
                <CardDescription>
                  Переглядайте моделі, які ви зберегли для подальшого вибору та порівняння.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <p className="text-sm text-muted-foreground">
                  Швидкий доступ до всіх смартфонів, які ви відклали в особистий список.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/favorites">Перейти до обраного</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Замовлення
                  </CardTitle>
                  <Badge variant="outline">
                    {ordersQuery.isPending ? 'Завантажуємо...' : `${ordersCount} замовлень`}
                  </Badge>
                </div>
                <CardDescription>Контролюйте статус оплати, доставки та переглядайте історію покупок.</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <p className="text-sm text-muted-foreground">
                  Тут зібрані всі ваші оформлені покупки з деталями по кожному замовленню.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/orders">Перейти до замовлень</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
