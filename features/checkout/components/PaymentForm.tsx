"use client";

import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

interface PaymentFormProps {
  orderId: string;

  returnUrl: string;
}

export default function PaymentForm({
  orderId,
  returnUrl,
}: PaymentFormProps) {
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
      <PaymentElement />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-lg bg-foreground px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting
          ? "Processing..."
          : "Pay now"}
      </button>
    </form>
  );
}