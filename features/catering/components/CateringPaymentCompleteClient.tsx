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
      <div
        role="status"
        className="rounded-2xl border border-secondary/20 bg-secondary/10 p-6"
      >
        <h2 className="text-2xl font-bold text-foreground">
          Payment Complete
        </h2>

        <p className="mt-3 leading-7 text-foreground/70">
          Your catering payment has
          been confirmed.
        </p>

        <Link
          href={`/account/orders/${orderId}`}
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          View Catering Order
        </Link>
      </div>
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
      <div
        role="alert"
        className="rounded-2xl bg-background p-6"
      >
        <h2 className="text-xl font-bold text-foreground">
          Payment Not Completed
        </h2>

        <p className="mt-3 leading-7 text-foreground/60">
          Your payment still needs
          attention. You can return to
          the payment page and try
          again.
        </p>

        <Link
          href={`/account/orders/${orderId}/payment`}
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white"
        >
          Return to Payment
        </Link>
      </div>
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
      <div
        role="alert"
        className="rounded-2xl border border-accent/20 bg-accent/10 p-6"
      >
        <h2 className="text-xl font-bold text-foreground">
          Payment Failed
        </h2>

        <p className="mt-3 text-foreground/60">
          The payment was not
          completed.
        </p>

        <Link
          href={`/account/orders/${orderId}/payment`}
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white"
        >
          Try Again
        </Link>
      </div>
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
      <div className="rounded-2xl bg-background p-6">
        <h2 className="text-xl font-bold text-foreground">
          Payment Refunded
        </h2>

        <p className="mt-3 text-foreground/60">
          This catering payment has
          been refunded.
        </p>

        <Link
          href={`/account/orders/${orderId}`}
          className="mt-6 inline-block font-semibold text-primary hover:underline"
        >
          View Order →
        </Link>
      </div>
    );
  }

  /*
   * ==================================================
   * FINALIZING / PROCESSING
   * ==================================================
   */

  return (
    <div
      role="status"
      className="rounded-2xl bg-background p-6"
    >
      <h2 className="text-xl font-bold text-foreground">
        {status ===
        "finalizing"
          ? "Finalizing Payment"
          : "Payment Processing"}
      </h2>

      {!stoppedPolling ? (
        <>
          <p className="mt-3 leading-7 text-foreground/60">
            We received your payment
            status and are waiting for
            the order confirmation to
            finish.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/10 border-t-primary" />

            <span className="text-sm font-medium text-foreground/60">
              Checking payment
              status...
            </span>
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 leading-7 text-foreground/60">
            Your payment is still being
            confirmed. You can safely
            return to your order and
            check its payment status
            again.
          </p>

          <Link
            href={`/account/orders/${orderId}`}
            className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white"
          >
            View Order
          </Link>
        </>
      )}
    </div>
  );
}