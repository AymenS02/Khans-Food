"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import StripeProvider from "@/features/checkout/components/StripeProvider";
import PaymentForm from "@/features/checkout/components/PaymentForm";

interface PaymentData {
  orderId: string;
  clientSecret: string;
  successAccessToken: string;
}

export default function PaymentPage() {
  const paymentData =
    useSyncExternalStore(
      subscribeToSessionStorage,
      getPaymentDataSnapshot,
      getEmptyPaymentDataSnapshot
    );

  if (!paymentData) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-10">
        <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-foreground">Payment</h1>
          <p className="mt-4 text-foreground/70">No payment session was found.</p>
        </section>
      </main>
    );
  }

  function subscribeToSessionStorage() {
    return () => {};
  }

  function getEmptyPaymentDataSnapshot() {
    return null;
  }

  function getPaymentDataSnapshot():
    | PaymentData
    | null {
    if (
      typeof window ===
      "undefined"
    ) {
      return null;
    }

    const stored =
      sessionStorage.getItem(
        "checkoutPayment"
      );

    if (!stored) {
      return null;
    }

    try {
      const parsed =
        JSON.parse(stored);

      if (
        typeof parsed.orderId !==
          "string" ||
        typeof parsed.clientSecret !==
          "string" ||
        typeof parsed.successAccessToken !==
          "string"
      ) {
        sessionStorage.removeItem(
          "checkoutPayment"
        );

        return null;
      }

      return {
        orderId:
          parsed.orderId,
        clientSecret:
          parsed.clientSecret,
        successAccessToken:
          parsed.successAccessToken,
      };
    } catch {
      sessionStorage.removeItem(
        "checkoutPayment"
      );

      return null;
    }
  }

  const returnUrl =
    `${window.location.origin}/checkout/success` +
    `?orderId=${encodeURIComponent(
      paymentData.orderId
    )}` +
    `&token=${encodeURIComponent(
      paymentData.successAccessToken
    )}`;
    
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <Link href="/checkout" className="text-sm font-semibold text-primary hover:underline">
          ← Back to Checkout
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">Payment</h1>
        <p className="mt-2 text-foreground/70">Complete your payment to confirm your order.</p>

        <div className="mt-5 rounded-xl border border-black/10 bg-background px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Secure checkout</p>
          <p className="mt-1 text-xs text-foreground/60">Payments are processed securely through Stripe.</p>
        </div>

        <div className="mt-6">
          <StripeProvider
            clientSecret={
              paymentData.clientSecret
            }
          >
            <PaymentForm
              returnUrl={
                returnUrl
              }
            />
          </StripeProvider>
        </div>
      </section>
    </main>
  );
}