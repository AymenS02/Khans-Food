"use client";

import { ReactNode, useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
} from "@stripe/react-stripe-js";

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

export default function StripeProvider({
  clientSecret,
  children,
}: StripeProviderProps) {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    const publishableKey =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
      );
    }

    setStripePromise(loadStripe(publishableKey));
  }, []);

  if (!stripePromise) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      {children}
    </Elements>
  );
}