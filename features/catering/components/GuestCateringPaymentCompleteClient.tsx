"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import type { GuestCateringCompletionStatus } from "@/actions/catering/getGuestCateringPaymentCompletion";

interface GuestCateringPaymentCompleteClientProps {
  orderId: string;

  accessToken: string;

  initialStatus:
    GuestCateringCompletionStatus;
}

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export default function GuestCateringPaymentCompleteClient({
  orderId,
  accessToken,
  initialStatus,
}: GuestCateringPaymentCompleteClientProps) {
  const [
    status,
    setStatus,
  ] =
    useState<GuestCateringCompletionStatus>(
      initialStatus
    );

  const [
    stoppedPolling,
    setStoppedPolling,
  ] =
    useState(false);

  useEffect(() => {
    /*
     * Final states don't need polling.
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
            `/api/catering/guest-orders/${orderId}/payment-status?token=${encodeURIComponent(
              accessToken
            )}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const result =
          (await response.json()) as {
            paymentStatus:
              PaymentStatus;
          };

        if (cancelled) {
          return;
        }

        switch (
          result.paymentStatus
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
      } catch (error) {
        console.error(
          "Unable to check guest catering payment:",
          error
        );
      }
    }

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
    accessToken,
    status,
  ]);

  /*
   * ======================================
   * PAID
   * ======================================
   */

  if (
    status === "paid"
  ) {
    return (
      <div
        role="status"
        className="rounded-xl border border-secondary/20 bg-secondary/10 p-6"
      >
        <h2 className="text-2xl font-bold text-foreground">
          Payment Complete
        </h2>

        <p className="mt-3 leading-7 text-foreground/70">
          Your catering payment has
          been confirmed.
        </p>

        <p className="mt-3 text-sm text-foreground/50">
          Khans Food now has your
          approved catering order and
          confirmed payment.
        </p>
      </div>
    );
  }

  /*
   * ======================================
   * RETRY
   * ======================================
   */

  if (
    status === "retry"
  ) {
    return (
      <div
        role="alert"
        className="rounded-xl bg-background p-6"
      >
        <h2 className="text-xl font-bold text-foreground">
          Payment Not Completed
        </h2>

        <p className="mt-3 leading-7 text-foreground/60">
          Your payment still needs
          attention. Return to the
          secure payment page to try
          again.
        </p>

        <Link
          href={
            `/catering/pay/${orderId}` +
            `?token=${encodeURIComponent(
              accessToken
            )}`
          }
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white"
        >
          Return to Payment
        </Link>
      </div>
    );
  }

  /*
   * ======================================
   * FAILED
   * ======================================
   */

  if (
    status === "failed"
  ) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-accent/20 bg-accent/10 p-6"
      >
        <h2 className="text-xl font-bold text-foreground">
          Payment Failed
        </h2>

        <p className="mt-3 leading-7 text-foreground/60">
          The payment did not
          complete.
        </p>

        <Link
          href={
            `/catering/pay/${orderId}` +
            `?token=${encodeURIComponent(
              accessToken
            )}`
          }
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white"
        >
          Try Again
        </Link>
      </div>
    );
  }

  /*
   * ======================================
   * REFUNDED
   * ======================================
   */

  if (
    status ===
    "refunded"
  ) {
    return (
      <div className="rounded-xl bg-background p-6">
        <h2 className="text-xl font-bold text-foreground">
          Payment Refunded
        </h2>

        <p className="mt-3 text-foreground/60">
          This catering payment has
          been refunded.
        </p>
      </div>
    );
  }

  /*
   * ======================================
   * FINALIZING / PROCESSING
   * ======================================
   */

  return (
    <div
      role="status"
      className="rounded-xl bg-background p-6"
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
            Your payment was received
            and we are waiting for the
            final order confirmation.
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
            Confirmation is taking
            longer than usual. Your
            payment status remains
            safely stored and can be
            checked again.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-white"
          >
            Check Again
          </button>
        </>
      )}
    </div>
  );
}