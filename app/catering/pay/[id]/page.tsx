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
    <main className="mx-auto max-w-3xl px-5 py-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="border-b border-black/10 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Khans Food Catering
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Catering Payment
          </h1>

          <p className="mt-3 leading-7 text-foreground/60">
            Complete payment for your
            approved catering request.
          </p>
        </div>

        {/* Event information */}
        <div className="grid gap-5 border-b border-black/10 py-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-foreground/50">
              Event
            </p>

            <p className="mt-1 font-semibold">
              {formatDateOnly(
                payment.eventDate
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-foreground/50">
              Guests
            </p>

            <p className="mt-1 font-semibold">
              {
                payment.guestCount
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-foreground/50">
              Amount
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              $
              {payment.total.toFixed(
                2
              )}
            </p>
          </div>
        </div>

        {/* ==========================================
            READY
        ========================================== */}

        {payment.status ===
          "ready" &&
          payment.clientSecret && (
            <div className="pt-6">
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
          )}

        {/* ==========================================
            ALREADY PAID
        ========================================== */}

        {payment.status ===
          "paid" && (
          <div className="pt-6">
            <div className="rounded-xl border border-secondary/20 bg-secondary/10 p-5">
              <h2 className="text-xl font-bold">
                Payment Complete
              </h2>

              <p className="mt-2 text-foreground/60">
                This catering order
                has already been paid.
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            FINALIZING
        ========================================== */}

        {payment.status ===
          "finalizing" && (
          <div className="pt-6">
            <div className="rounded-xl bg-background p-5">
              <h2 className="text-xl font-bold">
                Finalizing Payment
              </h2>

              <p className="mt-2 text-foreground/60">
                Stripe has received
                the payment and the
                order confirmation is
                being finalized.
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            PROCESSING
        ========================================== */}

        {payment.status ===
          "processing" && (
          <div className="pt-6">
            <div className="rounded-xl bg-background p-5">
              <h2 className="text-xl font-bold">
                Payment Processing
              </h2>

              <p className="mt-2 text-foreground/60">
                Your payment is still
                being processed.
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            FAILED
        ========================================== */}

        {payment.status ===
          "failed" && (
          <div className="pt-6">
            <div className="rounded-xl border border-accent/20 bg-accent/10 p-5">
              <h2 className="text-xl font-bold">
                Payment Unavailable
              </h2>

              <p className="mt-2 text-foreground/60">
                This payment session
                can no longer be used.
                Please contact Khans
                Food for assistance.
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            REFUNDED
        ========================================== */}

        {payment.status ===
          "refunded" && (
          <div className="pt-6">
            <div className="rounded-xl bg-background p-5">
              <h2 className="text-xl font-bold">
                Payment Refunded
              </h2>

              <p className="mt-2 text-foreground/60">
                This catering payment
                has been refunded.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
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