'use client'

import { ProductForm } from '@/features/admin/forms/product-form'
import { PageHeader } from '@/shared/components/ui/page-header'
import { ProtectedRoute } from '@/shared/components/ui/protected-route'

export default function AdminNewProductPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="page-shell section-space space-y-8">
        <PageHeader eyebrow="Admin products" title="Створення нового товару" />
        <ProductForm />
      </div>
    </ProtectedRoute>
  )
}
