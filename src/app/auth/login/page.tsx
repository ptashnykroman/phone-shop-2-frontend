import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { PageHeader } from "@/shared/components/ui/page-header";

export const metadata: Metadata = {
  title: "Вхід",
};

export default function LoginPage() {
  return (
    <div className="page-shell section-space space-y-8">
      <PageHeader
        eyebrow="Auth"
        title="Увійдіть, щоб продовжити покупки"
        description="Після входу frontend автоматично використовує доступний `sessionId`, щоб backend міг злити guest cart із вашим акаунтом."
      />
      <AuthForm mode="login" />
    </div>
  );
}
