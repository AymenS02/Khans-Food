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
  const { id } =
    await params;

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
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link
        href={`/account/orders/${payment.orderId}`}
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Order
      </Link>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-black/10 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Catering Payment
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Payment Status
          </h1>
        </div>

        {/* Order summary */}
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
              Total
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              $
              {payment.total.toFixed(
                2
              )}
            </p>
          </div>
        </div>

        {/* Live status */}
        <div className="pt-6">
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