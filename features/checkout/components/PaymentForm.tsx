"use client";

import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { useReloadOnPaymentPageRestore } from "@/features/checkout/hooks/useReloadOnPaymentPageRestore";

interface PaymentFormProps {
  returnUrl: string;
}

export default function PaymentForm({
  returnUrl,
}: PaymentFormProps) {

  useReloadOnPaymentPageRestore();

  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error } =
      await stripe.confirmPayment({
        elements,

        confirmParams: {
          return_url: returnUrl,
        },
      });

    if (error) {
      setError(
        error.message ??
          "Something went wrong with your payment."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
        <PaymentElement />
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Processing Payment..."
          : "Pay Securely"}
      </button>
    </form>
  );
}