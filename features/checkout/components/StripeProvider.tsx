"use client";

import {
  type ReactNode,
  useMemo,
} from "react";

import {
  loadStripe,
  type Stripe,
} from "@stripe/stripe-js";

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
    process.env
      .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

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
  /*
   * Stripe's PaymentElement is rendered inside
   * an iframe, so Tailwind classes from the
   * surrounding page cannot style its fields.
   *
   * The Appearance API is therefore used to
   * bring Stripe's UI closer to the Khans Food
   * editorial design.
   */
  const options =
    useMemo(
      () => ({
        clientSecret,

        appearance: {
          theme:
            "stripe" as const,

          variables: {
            borderRadius:
              "0px",

            fontFamily:
              "Arial, Helvetica, sans-serif",

            fontSizeBase:
              "14px",

            spacingGridRow:
              "18px",

            spacingGridColumn:
              "16px",

            colorText:
              "#1f1f1f",

            colorTextSecondary:
              "#6b6b6b",

            colorBackground:
              "#ffffff",

            colorDanger:
              "#b42318",
          },

          rules: {
            ".Label": {
              marginBottom:
                "8px",

              fontSize:
                "11px",

              fontWeight:
                "600",

              textTransform:
                "uppercase",

              letterSpacing:
                "0.08em",
            },

            ".Input": {
              minHeight:
                "48px",

              padding:
                "12px 14px",

              border:
                "1px solid rgba(31, 31, 31, 0.20)",

              boxShadow:
                "none",
            },

            ".Input:focus": {
              border:
                "1px solid currentColor",

              boxShadow:
                "none",
            },

            ".Input--invalid": {
              boxShadow:
                "none",
            },

            ".Tab": {
              minHeight:
                "48px",

              border:
                "1px solid rgba(31, 31, 31, 0.15)",

              boxShadow:
                "none",
            },

            ".Tab:hover": {
              boxShadow:
                "none",
            },

            ".Tab--selected": {
              border:
                "1px solid rgba(31, 31, 31, 0.65)",

              boxShadow:
                "none",
            },

            ".Block": {
              border:
                "1px solid rgba(31, 31, 31, 0.15)",

              boxShadow:
                "none",
            },
          },
        },
      }),
      [
        clientSecret,
      ]
    );

  return (
    <Elements
      stripe={
        getStripePromise()
      }
      options={
        options
      }
    >
      {children}
    </Elements>
  );
}