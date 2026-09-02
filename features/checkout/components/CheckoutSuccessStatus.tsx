"use client";

import {
  useEffect,
  useState,
  type ReactNode,
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
   * ==========================================
   * PAID
   * ==========================================
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

        <StatusPanel
          role="status"
          tone="success"
          eyebrow="Payment Confirmed"
          title={`Thank You, ${firstName}.`}
          icon="✓"
        >
          <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
            Your payment has been
            confirmed and your order
            is now in the hands of
            Khans Food.
          </p>

          <div className="mt-7 grid gap-4 border-t border-foreground/15 pt-5 sm:grid-cols-2">
            <StatusDetail
              label="Order"
              value={
                formatStatus(
                  orderStatus
                )
              }
            />

            <StatusDetail
              label="Payment"
              value="Paid"
              accent
            />
          </div>

          <div className="mt-6 flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-secondary/30 font-sans text-[10px] text-secondary"
            >
              ✓
            </span>

            <p className="max-w-lg font-sans text-xs leading-5 text-foreground/45">
              No additional payment
              action is required. You
              can use the order details
              on this page to review
              your pickup information.
            </p>
          </div>
        </StatusPanel>
      </>
    );
  }

  /*
   * ==========================================
   * FAILED
   * ==========================================
   */

  if (
    paymentStatus ===
    "failed"
  ) {
    return (
      <StatusPanel
        role="alert"
        tone="error"
        eyebrow="Payment Issue"
        title="Payment Not Completed"
        icon="×"
      >
        <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
          Your order was created, but
          the payment did not complete.
          Return to the payment page to
          try again.
        </p>

        <Link
          href="/checkout/payment"
          className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[220px]"
        >
          Return to Payment

          <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </StatusPanel>
    );
  }

  /*
   * ==========================================
   * REFUNDED
   * ==========================================
   */

  if (
    paymentStatus ===
    "refunded"
  ) {
    return (
      <StatusPanel
        role="status"
        tone="neutral"
        eyebrow="Payment Update"
        title="Payment Refunded"
        icon="↺"
      >
        <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
          This payment has been
          refunded.
        </p>

        <div className="mt-6 border-t border-foreground/15 pt-5">
          <StatusDetail
            label="Order Status"
            value={
              formatStatus(
                orderStatus
              )
            }
          />
        </div>
      </StatusPanel>
    );
  }

  /*
   * ==========================================
   * PENDING
   * ==========================================
   */

  return (
    <StatusPanel
      role="status"
      tone="processing"
      eyebrow="Almost There"
      title="Confirming Payment"
      icon="…"
    >
      {!stoppedPolling ? (
        <>
          <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
            Your order was received.
            We&apos;re waiting for the
            final payment confirmation
            before marking the order as
            paid.
          </p>

          <div className="mt-7 flex items-start gap-4 border-t border-foreground/15 pt-5">
            <div
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-foreground/10 border-t-primary"
            />

            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-foreground/60">
                Checking Payment
              </p>

              <p className="mt-1 font-sans text-xs leading-5 text-foreground/40">
                This page will update
                automatically once the
                payment is confirmed.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
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
            className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[190px]"
          >
            Check Again

            <span className="ml-5 text-lg transition-transform group-hover:rotate-180">
              ↻
            </span>
          </button>
        </>
      )}
    </StatusPanel>
  );
}

/* =============================================
   STATUS PANEL
============================================= */

function StatusPanel({
  role,
  tone,
  eyebrow,
  title,
  icon,
  children,
}: {
  role:
    | "status"
    | "alert";
  tone:
    | "success"
    | "error"
    | "neutral"
    | "processing";
  eyebrow: string;
  title: string;
  icon: string;
  children: ReactNode;
}) {
  const styles = {
    success: {
      wrapper:
        "border-secondary/30 bg-secondary/[0.08]",
      icon:
        "bg-secondary text-white",
      eyebrow:
        "text-secondary",
    },

    error: {
      wrapper:
        "border-accent/30 bg-accent/10",
      icon:
        "border border-accent/30 text-accent",
      eyebrow:
        "text-accent",
    },

    neutral: {
      wrapper:
        "border-foreground/15 bg-foreground/[0.025]",
      icon:
        "border border-foreground/20 text-foreground/55",
      eyebrow:
        "text-primary",
    },

    processing: {
      wrapper:
        "border-primary/20 bg-primary/[0.035]",
      icon:
        "border border-primary/30 text-primary",
      eyebrow:
        "text-primary",
    },
  }[tone];

  return (
    <section
      role={role}
      className={`border-y px-0 py-8 sm:px-6 sm:py-10 ${styles.wrapper}`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div
          aria-hidden="true"
          className={`flex h-12 w-12 shrink-0 items-center justify-center font-sans text-lg font-bold ${styles.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`font-sans text-xs font-semibold uppercase tracking-[0.25em] ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>

          <h2 className="mt-3 font-rye text-3xl leading-tight text-foreground sm:text-4xl">
            {title}
          </h2>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px w-14 bg-foreground/20" />

            <span className="text-xs text-primary">
              ◆
            </span>
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}

/* =============================================
   STATUS DETAIL
============================================= */

function StatusDetail({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
        {label}
      </p>

      <p
        className={`mt-2 font-sans text-sm font-bold ${
          accent
            ? "text-secondary"
            : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =============================================
   HELPERS
============================================= */

function formatStatus(
  status: OrderStatus
) {
  return (
    status
      .charAt(0)
      .toUpperCase() +
    status.slice(1)
  );
}