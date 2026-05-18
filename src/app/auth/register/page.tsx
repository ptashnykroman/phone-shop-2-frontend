import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { PageHeader } from "@/shared/components/ui/page-header";

export const metadata: Metadata = {
  title: "Реєстрація",
};

export default function RegisterPage() {
  return (
    <div className="page-shell section-space space-y-8">
      <PageHeader
        eyebrow="Auth"
        title="Створіть акаунт"
        description="Реєстрація відкриє доступ до замовлень, обраного, історії покупок і захищених сценаріїв checkout."
      />
      <AuthForm mode="register" />
    </div>
  );
}
