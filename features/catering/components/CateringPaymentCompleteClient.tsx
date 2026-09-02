"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import type { CateringPaymentCompletionStatus } from "@/actions/catering/getCustomerCateringPaymentCompletion";

interface CateringPaymentCompleteClientProps {
  orderId: string;

  initialStatus:
    CateringPaymentCompletionStatus;
}

type PollPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export default function CateringPaymentCompleteClient({
  orderId,
  initialStatus,
}: CateringPaymentCompleteClientProps) {
  const [
    status,
    setStatus,
  ] =
    useState<CateringPaymentCompletionStatus>(
      initialStatus
    );

  const [
    stoppedPolling,
    setStoppedPolling,
  ] =
    useState(false);

  useEffect(() => {
    /*
     * These statuses don't need polling.
     */
    if (
      status === "paid" ||
      status === "retry" ||
      status === "failed" ||
      status === "refunded"
    ) {
      return;
    }

    let cancelled =
      false;

    let attempts =
      0;

    const maxAttempts =
      24;

    async function checkStatus() {
      try {
        const response =
          await fetch(
            `/api/catering/orders/${orderId}/payment-status`,
            {
              method: "GET",

              cache:
                "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as {
            paymentStatus:
              PollPaymentStatus;
          };

        if (cancelled) {
          return;
        }

        switch (
          data.paymentStatus
        ) {
          case "paid":
            setStatus(
              "paid"
            );
            return;

          case "failed":
            setStatus(
              "failed"
            );
            return;

          case "refunded":
            setStatus(
              "refunded"
            );
            return;

          default:
            break;
        }

        attempts += 1;

        if (
          attempts >=
          maxAttempts
        ) {
          setStoppedPolling(
            true
          );
        }
      } catch (
        error
      ) {
        console.error(
          "Unable to check catering payment status:",
          error
        );
      }
    }

    /*
     * Check immediately.
     */
    void checkStatus();

    const interval =
      window.setInterval(
        () => {
          if (
            attempts >=
            maxAttempts
          ) {
            window.clearInterval(
              interval
            );

            return;
          }

          void checkStatus();
        },
        2500
      );

    return () => {
      cancelled =
        true;

      window.clearInterval(
        interval
      );
    };
  }, [
    orderId,
    status,
  ]);

  /*
   * ==================================================
   * PAID
   * ==================================================
   */

  if (
    status === "paid"
  ) {
    return (
      <section
        role="status"
        className="border-y border-secondary/30 bg-secondary/10 py-8 sm:px-6 sm:py-10"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary font-sans text-lg font-bold text-white">
            ✓
          </div>

          <div className="flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Payment Confirmed
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
              Payment Complete
            </h2>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px w-14 bg-foreground/20" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
              Your catering payment
              has been confirmed and
              your order is now
              secured.
            </p>

            <Link
              href={`/account/orders/${orderId}`}
              className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[230px]"
            >
              View Catering Order

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /*
   * ==================================================
   * RETRY
   * ==================================================
   */

  if (
    status === "retry"
  ) {
    return (
      <section
        role="alert"
        className="border-y border-primary/25 bg-primary/[0.05] py-8 sm:px-6 sm:py-10"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary/30 font-rye text-xl text-primary">
            !
          </div>

          <div className="flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Action Required
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
              Payment Not Completed
            </h2>

            <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
              Your payment still needs
              attention. Return to the
              payment page and try
              again.
            </p>

            <Link
              href={`/account/orders/${orderId}/payment`}
              className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[220px]"
            >
              Return to Payment

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /*
   * ==================================================
   * FAILED
   * ==================================================
   */

  if (
    status === "failed"
  ) {
    return (
      <section
        role="alert"
        className="border-y border-accent/30 bg-accent/10 py-8 sm:px-6 sm:py-10"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-accent/30 font-sans text-lg font-bold text-accent">
            ×
          </div>

          <div className="flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Payment Issue
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
              Payment Failed
            </h2>

            <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
              The payment was not
              completed. You can return
              to the payment page and
              try again.
            </p>

            <Link
              href={`/account/orders/${orderId}/payment`}
              className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[190px]"
            >
              Try Again

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /*
   * ==================================================
   * REFUNDED
   * ==================================================
   */

  if (
    status ===
    "refunded"
  ) {
    return (
      <section className="border-y border-foreground/15 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-foreground/20 font-rye text-xl text-foreground/60">
            ↺
          </div>

          <div className="flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Payment Update
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
              Payment Refunded
            </h2>

            <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
              This catering payment
              has been refunded.
            </p>

            <Link
              href={`/account/orders/${orderId}`}
              className="group mt-7 inline-flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:text-primary"
            >
              View Order

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /*
   * ==================================================
   * FINALIZING / PROCESSING
   * ==================================================
   */

  return (
    <section
      role="status"
      className="border-y border-foreground/15 py-8 sm:px-6 sm:py-10"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          {!stoppedPolling ? (
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/10 border-t-primary" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center border border-foreground/20 font-rye text-xl text-primary">
              …
            </div>
          )}
        </div>

        <div className="flex-1">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Payment Status
          </p>

          <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
            {status ===
            "finalizing"
              ? "Finalizing Payment"
              : "Payment Processing"}
          </h2>

          {!stoppedPolling ? (
            <>
              <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
                We received your
                payment status and are
                waiting for the order
                confirmation to finish.
              </p>

              <div className="mt-7 flex items-center gap-3 border-t border-foreground/10 pt-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>

                <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-foreground/45">
                  Checking payment
                  status...
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
                Your payment is still
                being confirmed. You
                can safely return to
                your order and check
                its payment status
                again.
              </p>

              <Link
                href={`/account/orders/${orderId}`}
                className="group mt-7 flex min-h-12 w-full items-center justify-between border border-foreground/20 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] transition hover:border-foreground hover:bg-foreground hover:text-background sm:w-auto sm:min-w-[190px]"
              >
                View Order

                <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}