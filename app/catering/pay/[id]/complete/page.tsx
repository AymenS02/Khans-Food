import { notFound } from "next/navigation";

import { getGuestCateringPaymentCompletion } from "@/actions/catering/getGuestCateringPaymentCompletion";

import GuestCateringPaymentCompleteClient from "@/features/catering/components/GuestCateringPaymentCompleteClient";

interface GuestCateringPaymentCompletePageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function GuestCateringPaymentCompletePage({
  params,
  searchParams,
}: GuestCateringPaymentCompletePageProps) {
  const { id } =
    await params;

  const { token } =
    await searchParams;

  if (!token) {
    notFound();
  }

  /*
   * We intentionally ignore Stripe query
   * parameters such as redirect_status.
   *
   * The server verifies the actual Stripe
   * PaymentIntent instead.
   */
  const payment =
    await getGuestCateringPaymentCompletion(
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
          PAYMENT STATUS
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
                verified securely
                against your catering
                order and Stripe
                PaymentIntent.
              </p>
            </div>

            <div className="pt-8">
              <GuestCateringPaymentCompleteClient
                orderId={
                  payment.orderId
                }
                accessToken={
                  token
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

              {/* SECURITY NOTE */}

              <div className="mt-7 border-t border-background/15 pt-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-background/20 font-sans text-[10px]">
                    ✓
                  </span>

                  <p className="font-sans text-xs leading-5 text-background/45">
                    This payment link is
                    securely tied to your
                    catering order.
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