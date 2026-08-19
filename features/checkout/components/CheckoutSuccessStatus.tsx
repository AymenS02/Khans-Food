"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import ClearCart from "./ClearCart";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

interface CheckoutSuccessStatusProps {
  orderId: string;

  accessToken: string;

  firstName: string;

  initialPaymentStatus:
    PaymentStatus;

  initialOrderStatus:
    OrderStatus;
}

export default function CheckoutSuccessStatus({
  orderId,
  accessToken,
  firstName,
  initialPaymentStatus,
  initialOrderStatus,
}: CheckoutSuccessStatusProps) {
  const [
    paymentStatus,
    setPaymentStatus,
  ] =
    useState<PaymentStatus>(
      initialPaymentStatus
    );

  const [
    orderStatus,
    setOrderStatus,
  ] =
    useState<OrderStatus>(
      initialOrderStatus
    );

  const [
    stoppedPolling,
    setStoppedPolling,
  ] =
    useState(false);

  useEffect(() => {
    /*
     * Nothing to wait for once payment
     * reaches a final state.
     */
    if (
      paymentStatus ===
        "paid" ||
      paymentStatus ===
        "failed" ||
      paymentStatus ===
        "refunded"
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
            `/api/checkout/orders/${orderId}/status?token=${encodeURIComponent(
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

            orderStatus:
              OrderStatus;
          };

        if (cancelled) {
          return;
        }

        setPaymentStatus(
          result.paymentStatus
        );

        setOrderStatus(
          result.orderStatus
        );

        attempts += 1;

        if (
          attempts >=
          maxAttempts &&
          result.paymentStatus ===
            "pending"
        ) {
          setStoppedPolling(
            true
          );
        }
      } catch (error) {
        console.error(
          "Unable to check order payment status:",
          error
        );
      }
    }

    /*
     * Check immediately instead of waiting
     * for the first interval.
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
    accessToken,
    paymentStatus,
  ]);

  /*
   * -----------------------------------------
   * PAID
   * -----------------------------------------
   */

  if (
    paymentStatus ===
    "paid"
  ) {
    return (
      <>
        {/*
         * Only clear the cart after MongoDB
         * confirms that the webhook marked
         * this Order paid.
         */}
        <ClearCart />

        <div
          role="status"
          className="rounded-xl border border-secondary/20 bg-secondary/10 p-5"
        >
          <h2 className="text-xl font-bold text-foreground">
            Order Confirmed
          </h2>

          <p className="mt-2 leading-6 text-foreground/70">
            Thank you,{" "}
            {firstName}. Your
            payment has been
            confirmed.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold capitalize">
              Order:{" "}
              {orderStatus}
            </span>

            <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold">
              Payment: Paid
            </span>
          </div>
        </div>
      </>
    );
  }

  /*
   * -----------------------------------------
   * FAILED
   * -----------------------------------------
   */

  if (
    paymentStatus ===
    "failed"
  ) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-accent/20 bg-accent/10 p-5"
      >
        <h2 className="text-xl font-bold text-foreground">
          Payment Not Completed
        </h2>

        <p className="mt-2 leading-6 text-foreground/70">
          Your order was created,
          but the payment did not
          complete.
        </p>

        <Link
          href="/checkout/payment"
          className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white"
        >
          Return to Payment
        </Link>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * REFUNDED
   * -----------------------------------------
   */

  if (
    paymentStatus ===
    "refunded"
  ) {
    return (
      <div className="rounded-xl bg-background p-5">
        <h2 className="text-xl font-bold text-foreground">
          Payment Refunded
        </h2>

        <p className="mt-2 text-foreground/60">
          This payment has been
          refunded.
        </p>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * PENDING
   * -----------------------------------------
   */

  return (
    <div
      role="status"
      className="rounded-xl bg-background p-5"
    >
      <h2 className="text-xl font-bold text-foreground">
        Confirming Payment
      </h2>

      {!stoppedPolling ? (
        <>
          <p className="mt-2 leading-6 text-foreground/60">
            Your order was received.
            We are waiting for payment
            confirmation to finish.
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
          <p className="mt-2 leading-6 text-foreground/60">
            Payment confirmation is
            taking longer than usual.
            Your order has not been
            marked paid until
            confirmation finishes.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white"
          >
            Check Again
          </button>
        </>
      )}
    </div>
  );
}