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
    `${window.location.origin}` +
    `/account/orders/${orderId}/payment/complete`;

  return (
    <div className="w-full">
      {/* =========================================
          PAYMENT FORM
      ========================================= */}

      <div className="border-y border-foreground/15 py-7 sm:py-8">
        <div className="mb-7">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Secure Payment
          </p>

          <h3 className="mt-2 font-rye text-2xl text-foreground sm:text-3xl">
            Payment Details
          </h3>

          <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-foreground/50">
            Enter your payment
            information below to
            complete your approved
            catering order.
          </p>
        </div>

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
      </div>

      {/* =========================================
          SECURITY NOTE
      ========================================= */}

      <div className="flex items-start gap-3 pt-5">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-foreground/15 font-sans text-[10px] text-primary"
        >
          ✓
        </span>

        <div>
          <p className="font-sans text-xs font-semibold text-foreground">
            Secure checkout
          </p>

          <p className="mt-1 max-w-lg font-sans text-xs leading-5 text-foreground/45">
            Your payment is processed
            securely through Stripe.
            After checkout, you&apos;ll
            return to your account where
            the latest payment status
            will be verified.
          </p>
        </div>
      </div>
    </div>
  );
}