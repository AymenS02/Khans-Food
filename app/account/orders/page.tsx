import Link from "next/link";

import { getCustomerOrders } from "@/actions/orders/getCustomerOrders";

export default async function OrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold text-foreground">
          My Orders
        </h1>

        <p className="mt-3 text-foreground/60">
          View your current and previous Khans Food orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            No orders yet
          </h2>

          <p className="mt-2 text-foreground/60">
            Once you place an order while logged in, it will appear here.
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-foreground/50">
                    Order
                  </p>

                  <h2 className="mt-1 font-mono font-semibold text-foreground">
                    {order.id}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
                    Order Status: {order.orderStatus}
                  </span>

                  <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
                    Payment Status: {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-foreground/50">
                    {order.orderType === "regular"
                      ? "Pickup"
                      : "Catering Event"}
                  </p>

                  {order.orderType === "regular" &&
                  order.pickupDate &&
                  order.pickupTime ? (
                    <>
                      <p className="mt-1 font-semibold">
                        {formatDateOnly(
                          order.pickupDate
                        )}
                      </p>

                      <p className="mt-1 text-sm text-foreground/60">
                        {order.pickupTime}
                      </p>
                    </>
                  ) : order.orderType === "catering" &&
                    order.catering ? (
                    <>
                      <p className="mt-1 font-semibold">
                        {formatDateOnly(
                          order.catering.eventDate
                        )}
                      </p>

                      <p className="mt-1 text-sm text-foreground/60">
                        {order.catering.guestCount} guests
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-foreground/50">
                      Information unavailable
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-foreground/50">
                    Items
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.items.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-foreground/50">
                    Total
                  </p>

                  <p className="mt-1 font-semibold">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-black/10 pt-5">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  View Order Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
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