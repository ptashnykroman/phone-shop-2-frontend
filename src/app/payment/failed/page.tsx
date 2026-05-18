import { PaymentFailedView } from "@/features/payments/components/payment-failed-view";

interface PaymentFailedPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentFailedPage({
  searchParams,
}: PaymentFailedPageProps) {
  const { orderId } = await searchParams;
  return <PaymentFailedView orderId={orderId} />;
}
