"use client";

import StripeProvider from "@/features/checkout/components/StripeProvider";
import PaymentForm from "@/features/checkout/components/PaymentForm";

interface CateringPaymentClientProps {
  orderId: string;
  clientSecret: string;
}

export default function CateringPaymentClient({
  orderId,
  clientSecret,
}: CateringPaymentClientProps) {
  const returnUrl =
    `${window.location.origin}/account/orders/${orderId}/payment/complete`;

  return (
    <StripeProvider
      clientSecret={
        clientSecret
      }
    >
      <PaymentForm
        returnUrl={returnUrl}
      />
    </StripeProvider>
  );
}