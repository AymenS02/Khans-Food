"use client";

import {
  useMemo,
  useSyncExternalStore,
} from "react";

import Link from "next/link";

import StripeProvider from "@/features/checkout/components/StripeProvider";
import PaymentForm from "@/features/checkout/components/PaymentForm";

interface PaymentData {
  orderId: string;
  clientSecret: string;
  successAccessToken: string;
}

/*
 * Stable subscription function.
 *
 * Session storage does not need to update
 * while this page is open, so this is a
 * no-op subscription.
 */
function subscribeToSessionStorage() {
  return () => {};
}

/*
 * Return the raw string from sessionStorage.
 *
 * This keeps the snapshot stable and avoids
 * the getSnapshot infinite-render issue.
 */
function getPaymentDataSnapshot():
  | string
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return sessionStorage.getItem(
    "checkoutPayment"
  );
}

/*
 * Server + hydration snapshot.
 */
function getEmptyPaymentDataSnapshot():
  | null {
  return null;
}

function parsePaymentData(
  stored: string | null
): PaymentData | null {
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
    return null;
  }
}

export default function PaymentPage() {
  const storedPaymentData =
    useSyncExternalStore(
      subscribeToSessionStorage,
      getPaymentDataSnapshot,
      getEmptyPaymentDataSnapshot
    );

  const paymentData =
    useMemo(
      () =>
        parsePaymentData(
          storedPaymentData
        ),
      [
        storedPaymentData,
      ]
    );

  /*
   * ============================================
   * NO PAYMENT SESSION
   * ============================================
   */

  if (!paymentData) {
    return (
      <main className="overflow-hidden">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="border-y border-foreground/15 py-14 sm:py-20">
            <div className="max-w-2xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Checkout
              </p>

              <h1 className="mt-4 font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                No Payment
                <br className="hidden sm:block" />{" "}
                Session Found.
              </h1>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px w-16 bg-foreground/25" />

                <span className="text-xs text-primary">
                  ◆
                </span>

                <div className="h-px w-16 bg-foreground/25" />
              </div>

              <p className="max-w-xl font-sans text-sm leading-6 text-foreground/55 sm:text-base">
                We couldn&apos;t find an
                active payment session.
                Return to checkout to
                continue your order.
              </p>

              <Link
                href="/checkout"
                className="group mt-8 flex min-h-12 w-full max-w-xs items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              >
                Back to Checkout

                <span className="ml-5 text-lg transition-transform group-hover:-translate-x-1">
                  ←
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /*
   * We only reach here after hydration because
   * the server snapshot is null.
   */
  const returnUrl =
    `${window.location.origin}/checkout/success` +
    `?orderId=${encodeURIComponent(
      paymentData.orderId
    )}` +
    `&token=${encodeURIComponent(
      paymentData.successAccessToken
    )}`;

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Link
          href="/checkout"
          className="group inline-flex min-h-10 items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back to Checkout
        </Link>

        <div className="mt-10 border-b border-foreground/15 pb-12 sm:pb-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Secure Checkout
          </p>

          <h1 className="mt-4 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Complete Your
            <br className="hidden sm:block" />{" "}
            Payment.
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            Complete your payment below
            to confirm your Khans Food
            order.
          </p>
        </div>
      </section>

      {/* =========================================
          PAYMENT CONTENT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* =====================================
              STRIPE FORM
          ===================================== */}

          <div>
            <div className="border-b border-foreground/15 pb-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Payment Details
              </p>

              <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
                Secure Payment
              </h2>

              <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-foreground/55">
                Enter your payment
                details below. Your
                payment is processed
                securely through Stripe.
              </p>
            </div>

            <div className="pt-8">
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
          </div>

          {/* =====================================
              SECURITY SUMMARY
          ===================================== */}

          <aside className="h-fit bg-foreground text-background lg:sticky lg:top-28">
            <div className="p-6 sm:p-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Checkout
              </p>

              <h2 className="mt-3 font-rye text-3xl">
                Secure & Simple
              </h2>

              <div className="my-6 h-px bg-background/15" />

              {/* STRIPE */}

              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Payment Provider
                </p>

                <p className="mt-2 font-sans text-sm font-semibold">
                  Stripe
                </p>
              </div>

              {/* ORDER */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Order
                </p>

                <p className="mt-2 break-all font-mono text-xs leading-5 text-background/60">
                  {
                    paymentData.orderId
                  }
                </p>
              </div>

              {/* SECURE NOTE */}

              <div className="mt-7 border-t border-background/15 pt-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-background/20 font-sans text-[10px]">
                    ✓
                  </span>

                  <div>
                    <p className="font-sans text-xs font-semibold text-background">
                      Secure checkout
                    </p>

                    <p className="mt-1 font-sans text-xs leading-5 text-background/45">
                      Payment details
                      are processed
                      securely through
                      Stripe.
                    </p>
                  </div>
                </div>
              </div>

              {/* CONFIRMATION */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-background/20 font-sans text-[10px]">
                    ✓
                  </span>

                  <p className="font-sans text-xs leading-5 text-background/45">
                    Your order is
                    confirmed only after
                    the payment has been
                    successfully verified.
                  </p>
                </div>
              </div>

              {/* BACK LINK */}

              <Link
                href="/checkout"
                className="group mt-7 flex min-h-11 w-full items-center justify-between border border-background/25 px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.13em] text-background transition hover:bg-background hover:text-foreground"
              >
                Back to Checkout

                <span className="transition-transform group-hover:-translate-x-1">
                  ←
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}