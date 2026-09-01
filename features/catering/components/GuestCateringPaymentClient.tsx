"use client";

import StripeProvider from "@/features/checkout/components/StripeProvider";
import PaymentForm from "@/features/checkout/components/PaymentForm";

interface GuestCateringPaymentClientProps {
  orderId: string;

  accessToken: string;

  clientSecret: string;
}

export default function GuestCateringPaymentClient({
  orderId,
  accessToken,
  clientSecret,
}: GuestCateringPaymentClientProps) {
  /*
   * IMPORTANT:
   *
   * The access token must travel to the
   * completion page too because the guest
   * does not have an authenticated account.
   */

  const returnUrl =
    `${window.location.origin}` +
    `/catering/pay/${orderId}/complete` +
    `?token=${encodeURIComponent(
      accessToken
    )}`;

  return (
    <StripeProvider
      clientSecret={
        clientSecret
      }
    >
      <PaymentForm
        returnUrl={
          returnUrl
        }
      />
    </StripeProvider>
  );
}