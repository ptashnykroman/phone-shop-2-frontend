import { MockPaymentPageView } from "@/features/payments/components/mock-payment-page-view";

interface MockPaymentPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function MockPaymentPage({
  searchParams,
}: MockPaymentPageProps) {
  const { orderId = "" } = await searchParams;
  return <MockPaymentPageView orderId={orderId} />;
}
