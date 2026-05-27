import type { Metadata } from 'next'
import { AuthForm } from '@/features/auth/components/auth-form'

export const metadata: Metadata = {
  title: 'Реєстрація',
}

export default function RegisterPage() {
  return (
    <div className="page-shell section-space space-y-8">
      <AuthForm mode="register" />
    </div>
  )
}
