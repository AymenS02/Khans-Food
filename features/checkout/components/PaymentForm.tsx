"use client";

import {
  type FormEvent,
  useState,
} from "react";

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

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !stripe ||
      !elements
    ) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const {
      error,
    } =
      await stripe.confirmPayment({
        elements,

        confirmParams: {
          return_url:
            returnUrl,
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
      onSubmit={
        handleSubmit
      }
      className="space-y-7"
    >
      {/* =========================================
          STRIPE PAYMENT ELEMENT
      ========================================= */}

      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
            Payment Method
          </p>

          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/30">
            Secure
          </span>
        </div>

        <div className="border border-foreground/15 bg-background p-4 sm:p-5">
          <PaymentElement />
        </div>
      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div
          role="alert"
          className="border border-accent/30 bg-accent/10 px-4 py-4"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center border border-accent/30 font-sans text-xs font-bold text-accent"
            >
              !
            </span>

            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Payment Error
              </p>

              <p className="mt-1 font-sans text-sm leading-6 text-accent">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          SECURITY NOTE
      ========================================= */}

      <div className="border-y border-foreground/15 py-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-foreground/15 font-sans text-[10px] text-primary"
          >
            ✓
          </span>

          <div>
            <p className="font-sans text-xs font-semibold text-foreground">
              Secure payment
            </p>

            <p className="mt-1 max-w-lg font-sans text-xs leading-5 text-foreground/45">
              Your payment details are
              handled securely through
              Stripe and are not stored
              directly by Khans Food.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          SUBMIT
      ========================================= */}

      <button
        type="submit"
        disabled={
          !stripe ||
          !elements ||
          isSubmitting
        }
        className="group flex min-h-14 w-full items-center justify-between bg-primary px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>
          {isSubmitting
            ? "Processing Payment..."
            : "Pay Securely"}
        </span>

        {!isSubmitting && (
          <span className="ml-6 text-lg transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </button>

      <p className="text-center font-sans text-[10px] uppercase tracking-[0.12em] text-foreground/35">
        Secure payment powered by Stripe
      </p>
    </form>
  );
}