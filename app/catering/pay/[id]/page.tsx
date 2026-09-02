import { notFound } from "next/navigation";

import { getGuestCateringPayment } from "@/actions/catering/getGuestCateringPayment";

import GuestCateringPaymentClient from "@/features/catering/components/GuestCateringPaymentClient";

interface GuestCateringPaymentPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function GuestCateringPaymentPage({
  params,
  searchParams,
}: GuestCateringPaymentPageProps) {
  const { id } =
    await params;

  const { token } =
    await searchParams;

  if (!token) {
    notFound();
  }

  const payment =
    await getGuestCateringPayment(
      id,
      token
    );

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="border-b border-foreground/15 pb-12 sm:pb-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Khans Food Catering
          </p>

          <h1 className="mt-4 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Complete Your
            <br className="hidden sm:block" />{" "}
            Catering Payment.
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            Your catering request has
            been approved. Review your
            event details and complete
            payment securely below.
          </p>
        </div>
      </section>

      {/* =========================================
          PAYMENT CONTENT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* =====================================
              LEFT CONTENT
          ===================================== */}

          <div>
            {/* ===================================
                READY
            =================================== */}

            {payment.status ===
              "ready" &&
              payment.clientSecret && (
                <section>
                  <div className="border-b border-foreground/15 pb-8">
                    <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                      Secure Checkout
                    </p>

                    <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
                      Payment Details
                    </h2>

                    <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-foreground/55">
                      Complete payment
                      below to secure
                      your approved
                      catering order.
                    </p>
                  </div>

                  <div className="pt-8">
                    <GuestCateringPaymentClient
                      orderId={
                        payment.orderId
                      }
                      accessToken={
                        token
                      }
                      clientSecret={
                        payment.clientSecret
                      }
                    />
                  </div>
                </section>
              )}

            {/* ===================================
                ALREADY PAID
            =================================== */}

            {payment.status ===
              "paid" && (
              <PaymentStatusPanel
                type="success"
                eyebrow="Payment Confirmed"
                title="Payment Complete"
                description="This catering order has already been paid. No additional payment is required."
              />
            )}

            {/* ===================================
                FINALIZING
            =================================== */}

            {payment.status ===
              "finalizing" && (
              <PaymentStatusPanel
                type="processing"
                eyebrow="Almost Done"
                title="Finalizing Payment"
                description="Stripe has received the payment and your catering order confirmation is being finalized."
              />
            )}

            {/* ===================================
                PROCESSING
            =================================== */}

            {payment.status ===
              "processing" && (
              <PaymentStatusPanel
                type="processing"
                eyebrow="Payment Status"
                title="Payment Processing"
                description="Your payment is still being processed. No further action is required right now."
              />
            )}

            {/* ===================================
                FAILED
            =================================== */}

            {payment.status ===
              "failed" && (
              <PaymentStatusPanel
                type="error"
                eyebrow="Payment Issue"
                title="Payment Unavailable"
                description="This payment session can no longer be used. Please contact Khans Food for assistance."
              />
            )}

            {/* ===================================
                REFUNDED
            =================================== */}

            {payment.status ===
              "refunded" && (
              <PaymentStatusPanel
                type="neutral"
                eyebrow="Payment Update"
                title="Payment Refunded"
                description="This catering payment has been refunded."
              />
            )}
          </div>

          {/* =====================================
              EVENT SUMMARY
          ===================================== */}

          <aside className="h-fit bg-foreground text-background lg:sticky lg:top-28">
            <div className="p-6 sm:p-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Your Event
              </p>

              <h2 className="mt-3 font-rye text-3xl">
                Catering Summary
              </h2>

              <div className="my-6 h-px bg-background/15" />

              {/* EVENT DATE */}

              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Event Date
                </p>

                <p className="mt-2 font-rye text-xl">
                  {formatDateOnly(
                    payment.eventDate
                  )}
                </p>
              </div>

              {/* GUESTS */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Guests
                </p>

                <p className="mt-2 font-rye text-2xl">
                  {
                    payment.guestCount
                  }
                </p>
              </div>

              {/* AMOUNT */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Amount
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {payment.total.toFixed(
                    2
                  )}
                </p>
              </div>

              {/* STATUS */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Payment Status
                </p>

                <p className="mt-2 font-sans text-sm font-semibold capitalize">
                  {
                    payment.status
                  }
                </p>
              </div>

              {/* SECURITY */}

              <div className="mt-7 border-t border-background/15 pt-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-background/20 font-sans text-[10px]">
                    ✓
                  </span>

                  <p className="font-sans text-xs leading-5 text-background/45">
                    This secure payment
                    link is tied directly
                    to your catering
                    order.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* =============================================
   STATUS PANEL
============================================= */

function PaymentStatusPanel({
  type,
  eyebrow,
  title,
  description,
}: {
  type:
    | "success"
    | "processing"
    | "error"
    | "neutral";
  eyebrow: string;
  title: string;
  description: string;
}) {
  const styles = {
    success: {
      wrapper:
        "border-secondary/30 bg-secondary/10",
      icon:
        "bg-secondary text-white",
      eyebrow:
        "text-secondary",
      symbol: "✓",
    },

    processing: {
      wrapper:
        "border-primary/25 bg-primary/[0.05]",
      icon:
        "border border-primary/30 text-primary",
      eyebrow:
        "text-primary",
      symbol: "…",
    },

    error: {
      wrapper:
        "border-accent/30 bg-accent/10",
      icon:
        "border border-accent/30 text-accent",
      eyebrow:
        "text-accent",
      symbol: "×",
    },

    neutral: {
      wrapper:
        "border-foreground/15 bg-foreground/[0.025]",
      icon:
        "border border-foreground/20 text-foreground/60",
      eyebrow:
        "text-primary",
      symbol: "↺",
    },
  }[type];

  return (
    <section
      role={
        type === "error"
          ? "alert"
          : "status"
      }
      className={`border-y px-0 py-8 sm:px-6 sm:py-10 ${styles.wrapper}`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center font-sans text-lg font-bold ${styles.icon}`}
        >
          {styles.symbol}
        </div>

        <div>
          <p
            className={`font-sans text-xs font-semibold uppercase tracking-[0.25em] ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>

          <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
            {title}
          </h2>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px w-14 bg-foreground/20" />

            <span className="text-xs text-primary">
              ◆
            </span>
          </div>

          <p className="max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

function formatDateOnly(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",

      timeZone:
        "UTC",
    }
  ).format(
    new Date(date)
  );
}