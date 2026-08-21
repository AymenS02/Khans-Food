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
    <main className="mx-auto max-w-3xl px-5 py-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="border-b border-black/10 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Khans Food Catering
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Payment Status
          </h1>
        </div>

        {/* Event Summary */}
        <section className="grid gap-5 border-b border-black/10 py-6 sm:grid-cols-3">
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
              Total
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              $
              {payment.total.toFixed(
                2
              )}
            </p>
          </div>
        </section>

        {/* Live Status */}
        <section className="pt-6">
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
        </section>
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