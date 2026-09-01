"use client";

import { useSyncExternalStore } from "react";

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
        <h1 className="text-3xl font-bold text-foreground">
          Payment
        </h1>

        <p className="mt-4 text-foreground/70">
          No payment session was found.
        </p>
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
      <h1 className="text-4xl font-bold text-foreground">
        Payment
      </h1>

      <p className="mt-2 text-foreground/70">
        Complete your payment to
        confirm your order.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <StripeProvider
          clientSecret={
            paymentData.clientSecret
          }
        >
          <PaymentForm
            orderId={
              paymentData.orderId
            }
            returnUrl={
              returnUrl
            }
          />
        </StripeProvider>
      </div>
    </main>
  );
}