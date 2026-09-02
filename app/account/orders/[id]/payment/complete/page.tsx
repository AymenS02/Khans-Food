import Link from "next/link";

import { getCustomerCateringPaymentCompletion } from "@/actions/catering/getCustomerCateringPaymentCompletion";

import CateringPaymentCompleteClient from "@/features/catering/components/CateringPaymentCompleteClient";

interface CateringPaymentCompletePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CateringPaymentCompletePage({
  params,
}: CateringPaymentCompletePageProps) {
  const { id } = await params;

  /*
   * We deliberately do NOT trust query
   * parameters such as:
   *
   * ?redirect_status=succeeded
   *
   * The server verifies the real Order
   * and Stripe PaymentIntent instead.
   */
  const payment =
    await getCustomerCateringPaymentCompletion(
      id
    );

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Link
          href={`/account/orders/${payment.orderId}`}
          className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50 transition hover:text-primary"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back to Order
        </Link>

        <div className="mt-10 border-b border-foreground/15 pb-12 sm:pb-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Catering Payment
          </p>

          <h1 className="mt-4 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Payment Status
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            We&apos;re confirming the
            latest status of your
            catering payment and order.
          </p>
        </div>
      </section>

      {/* =========================================
          PAYMENT STATUS CONTENT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* =====================================
              LIVE STATUS
          ===================================== */}

          <div>
            <div className="border-b border-foreground/15 pb-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Live Status
              </p>

              <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
                Your Payment
              </h2>

              <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-foreground/55">
                Your payment status is
                verified against the
                actual order and Stripe
                PaymentIntent.
              </p>
            </div>

            <div className="pt-8">
              <CateringPaymentCompleteClient
                orderId={
                  payment.orderId
                }
                initialStatus={
                  payment.status
                }
              />
            </div>
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

              {/* EVENT */}

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

              {/* TOTAL */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Total
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {payment.total.toFixed(
                    2
                  )}
                </p>
              </div>

              {/* ORDER LINK */}

              <div className="mt-7 border-t border-background/15 pt-6">
                <Link
                  href={`/account/orders/${payment.orderId}`}
                  className="group/link flex min-h-11 w-full items-center justify-between border border-background/25 px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.13em] text-background transition hover:bg-background hover:text-foreground"
                >
                  View Order

                  <span className="text-lg transition-transform group-hover/link:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function formatDateOnly(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }
  ).format(new Date(date));
}