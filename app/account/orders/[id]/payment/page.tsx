import Link from "next/link";

import { getCustomerCateringPayment } from "@/actions/catering/getCustomerCateringPayment";

import CateringPaymentClient from "@/features/catering/components/CateringPaymentClient";

interface CateringPaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CateringPaymentPage({
  params,
}: CateringPaymentPageProps) {
  const { id } =
    await params;

  const payment =
    await getCustomerCateringPayment(
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
            Your catering request has
            been approved. Complete
            payment below to secure your
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
              PAYMENT FORM
          ===================================== */}

          <div>
            <div className="border-b border-foreground/15 pb-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Secure Checkout
              </p>

              <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
                Payment Details
              </h2>

              <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-foreground/55">
                Payments are processed
                securely through Stripe.
                Your catering order will
                be confirmed once the
                payment is completed.
              </p>
            </div>

            <div className="pt-8">
              <CateringPaymentClient
                orderId={
                  payment.orderId
                }
                clientSecret={
                  payment.clientSecret
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
                  Amount Due
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {payment.total.toFixed(
                    2
                  )}
                </p>
              </div>

              {/* SECURE NOTE */}

              <div className="mt-7 border-t border-background/15 pt-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-background/20 font-sans text-[10px]">
                    ✓
                  </span>

                  <p className="font-sans text-xs leading-5 text-background/45">
                    Secure payment
                    processing through
                    Stripe.
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