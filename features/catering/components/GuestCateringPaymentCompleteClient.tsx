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
      <StatusPanel
        role="status"
        eyebrow="Payment Confirmed"
        title="Payment Complete"
        icon="✓"
        tone="success"
      >
        <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
          Your catering payment has
          been confirmed successfully.
        </p>

        <p className="mt-3 max-w-xl font-sans text-xs leading-5 text-foreground/45 sm:text-sm sm:leading-6">
          Khans Food now has your
          approved catering order and
          confirmed payment.
        </p>

        <div className="mt-7 border-t border-foreground/15 pt-5">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-secondary/30 font-sans text-[10px] text-secondary"
            >
              ✓
            </span>

            <p className="font-sans text-xs leading-5 text-foreground/45">
              No additional payment
              action is required.
            </p>
          </div>
        </div>
      </StatusPanel>
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
      <StatusPanel
        role="alert"
        eyebrow="Action Required"
        title="Payment Not Completed"
        icon="!"
        tone="warning"
      >
        <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
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
   * ======================================
   * FAILED
   * ======================================
   */

  if (
    status === "failed"
  ) {
    return (
      <StatusPanel
        role="alert"
        eyebrow="Payment Issue"
        title="Payment Failed"
        icon="×"
        tone="error"
      >
        <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
          The payment did not complete.
          You can return to the secure
          payment page and try again.
        </p>

        <Link
          href={
            `/catering/pay/${orderId}` +
            `?token=${encodeURIComponent(
              accessToken
            )}`
          }
          className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[190px]"
        >
          Try Again

          <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </StatusPanel>
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
      <StatusPanel
        role="status"
        eyebrow="Payment Update"
        title="Payment Refunded"
        icon="↺"
        tone="neutral"
      >
        <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
          This catering payment has
          been refunded.
        </p>

        <p className="mt-3 max-w-xl font-sans text-xs leading-5 text-foreground/45">
          If you have questions about
          the refund or your catering
          order, please contact Khans
          Food.
        </p>
      </StatusPanel>
    );
  }

  /*
   * ======================================
   * FINALIZING / PROCESSING
   * ======================================
   */

  return (
    <StatusPanel
      role="status"
      eyebrow={
        status ===
        "finalizing"
          ? "Almost There"
          : "Payment Status"
      }
      title={
        status ===
        "finalizing"
          ? "Finalizing Payment"
          : "Payment Processing"
      }
      icon="…"
      tone="processing"
    >
      {!stoppedPolling ? (
        <>
          <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
            Your payment was received
            and we&apos;re waiting for
            the final order
            confirmation.
          </p>

          <div className="mt-7 flex items-center gap-4 border-t border-foreground/15 pt-5">
            <div
              aria-hidden="true"
              className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-foreground/10 border-t-primary"
            />

            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-foreground/60">
                Checking Status
              </p>

              <p className="mt-1 font-sans text-xs leading-5 text-foreground/40">
                This page will update
                automatically once
                payment is confirmed.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="font-sans text-sm leading-6 text-foreground/60 sm:text-base sm:leading-7">
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
            className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[190px]"
          >
            Check Again

            <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
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
  eyebrow,
  title,
  icon,
  tone,
  children,
}: {
  role:
    | "status"
    | "alert";
  eyebrow: string;
  title: string;
  icon: string;
  tone:
    | "success"
    | "warning"
    | "error"
    | "neutral"
    | "processing";
  children:
    React.ReactNode;
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

    warning: {
      wrapper:
        "border-primary/25 bg-primary/[0.05]",
      icon:
        "border border-primary/30 text-primary",
      eyebrow:
        "text-primary",
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
        "border border-primary/25 text-primary",
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