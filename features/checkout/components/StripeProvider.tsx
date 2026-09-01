"use client";

import { ReactNode } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
} from "@stripe/react-stripe-js";

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

let stripePromise:
  | Promise<Stripe | null>
  | null = null;

function getStripePromise() {
  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    );
  }

  if (!stripePromise) {
    stripePromise =
      loadStripe(
        publishableKey
      );
  }

  return stripePromise;
}

export default function StripeProvider({
  clientSecret,
  children,
}: StripeProviderProps) {
  return (
    <Elements
      stripe={getStripePromise()}
      options={{
        clientSecret,
      }}
    >
      {children}
    </Elements>
  );
}