'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export default function GlobalErrorPage() {
  return (
    <div className="page-shell section-space flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-xl border-destructive/20">
        <CardHeader className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Не вдалося завантажити сторінку</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground sm:text-base">
            Сторінка тимчасово недоступна. Будь ласка, поверніться на головну сторінку та спробуйте пізніше.
          </p>
          <Button asChild size="lg">
            <Link href="/">Повернутися на головну</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
