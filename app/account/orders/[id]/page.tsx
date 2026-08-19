import Link from "next/link";

import { getCustomerOrderById } from "@/actions/orders/getCustomerOrderById";
import { prepareCateringPayment } from "@/actions/catering/prepareCateringPayment";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  const order = await getCustomerOrderById(id);

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href="/account/orders"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to My Orders
      </Link>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-foreground/50">
              Order
            </p>

            <h1 className="mt-1 break-all font-mono text-xl font-bold text-foreground">
              {order.id}
            </h1>

            <p className="mt-2 text-sm text-foreground/60">
              Placed{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
              Order Status: {order.orderStatus}
            </span>

            <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
              Payment Status: {order.paymentStatus}
            </span>
          </div>
        </div>

        <section className="py-6">
          {order.orderType === "regular" &&
          order.pickupDate &&
          order.pickupTime ? (
            <div>
              <p className="text-sm text-foreground/50">
                Pickup
              </p>

              <p className="mt-1 font-semibold">
                {formatDateOnly(order.pickupDate)}
                {" at "}
                {order.pickupTime}
              </p>
            </div>
          ) : order.orderType === "catering" &&
            order.catering ? (
            <div>
              <p className="text-sm text-foreground/50">
                Catering Event
              </p>

              <p className="mt-1 font-semibold">
                {formatDateOnly(
                  order.catering.eventDate
                )}
              </p>

              <p className="mt-1 text-sm text-foreground/60">
                {order.catering.guestCount} guests
              </p>
            </div>
          ) : (
            <p className="text-sm text-accent">
              Fulfillment information unavailable.
            </p>
          )}
        </section>

        <section className="border-t border-black/10 py-6">
          <h2 className="text-xl font-bold text-foreground">
            Items
          </h2>

          <div className="mt-5 divide-y divide-black/10">
            {order.items.map((item) => (
              <div
                key={
                  item.menuItem ??
                  `${item.name}-${item.quantity}`
                }
                className="flex items-start justify-between gap-6 py-4 first:pt-0"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-foreground/60">
                    ${item.price.toFixed(2)} ×{" "}
                    {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  $
                  {(
                    item.price * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 pt-6">
          <div className="ml-auto max-w-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-foreground/60">
                Subtotal
              </span>

              <span>
                ${order.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-foreground/60">
                Tax ({order.taxRate * 100}%)
              </span>

              <span>
                ${order.tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-t border-black/10 pt-3 text-lg font-bold">
              <span>Total</span>

              <span>
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {order.orderType === "catering" &&
          order.paymentStatus !== "paid" &&
          order.orderStatus !== "cancelled" && (
            <section className="mt-6 border-t border-black/10 pt-6">
              <div className="rounded-2xl bg-background p-5">
                <h2 className="text-lg font-bold text-foreground">
                  Payment Required
                </h2>

                <p className="mt-2 text-sm leading-6 text-foreground/60">
                  Your catering request has been
                  approved. Complete payment to
                  confirm your catering order.
                </p>

                <p className="mt-4 text-sm text-foreground/50">
                  Amount Due
                </p>

                <p className="mt-1 text-2xl font-bold text-primary">
                  ${order.total.toFixed(2)}
                </p>

                <form
                  action={
                    prepareCateringPayment
                  }
                  className="mt-5"
                >
                  <input
                    type="hidden"
                    name="orderId"
                    value={order.id}
                  />

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    Pay Catering Order
                  </button>
                </form>
              </div>
            </section>
          )}

          {order.orderType === "catering" &&
            order.paymentStatus === "paid" && (
              <section className="mt-6 border-t border-black/10 pt-6">
                <div className="rounded-2xl bg-secondary/10 p-5">
                  <p className="font-semibold text-foreground">
                    Catering order paid
                  </p>

                  <p className="mt-2 text-sm text-foreground/60">
                    No payment is currently due.
                  </p>
                </div>
              </section>
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
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }
  ).format(new Date(date));
}