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
            Complete Payment
          </h1>

          <p className="mt-3 text-foreground/60">
            Complete payment for your
            approved catering order.
          </p>
        </div>

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
              {payment.guestCount}
            </p>
          </div>

          <div>
            <p className="text-sm text-foreground/50">
              Amount Due
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              $
              {payment.total.toFixed(
                2
              )}
            </p>
          </div>
        </div>

        <div className="pt-6">
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