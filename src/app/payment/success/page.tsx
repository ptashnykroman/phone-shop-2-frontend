import { PaymentSuccessView } from "@/features/payments/components/payment-success-view";

interface PaymentSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { orderId = "" } = await searchParams;
  return <PaymentSuccessView orderId={orderId} />;
}
