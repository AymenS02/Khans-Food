import Link from "next/link";

import { getCustomerOrders } from "@/actions/orders/getCustomerOrders";

export default async function OrdersPage() {
  const orders =
    await getCustomerOrders();

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="border-b border-foreground/15 pb-12 sm:pb-16">
          <Link
            href="/account"
            className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50 transition hover:text-primary"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>

            Back to Account
          </Link>

          <p className="mt-10 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Account
          </p>

          <h1 className="mt-4 font-rye text-5xl leading-tight text-foreground sm:text-6xl lg:text-7xl">
            My Orders
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            Keep track of your current
            orders, pickup details,
            payment status, and previous
            Khans Food orders.
          </p>
        </div>
      </section>

      {/* =========================================
          ORDERS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        {orders.length === 0 ? (
          /* =====================================
             EMPTY STATE
          ===================================== */

          <div className="border-y border-foreground/15 py-16 sm:py-20">
            <div className="max-w-xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Nothing Here Yet
              </p>

              <h2 className="mt-4 font-rye text-3xl text-foreground sm:text-4xl">
                No Orders Yet
              </h2>

              <p className="mt-4 font-sans text-sm leading-6 text-foreground/55 sm:text-base">
                Once you place an order
                while signed in, it will
                appear here so you can
                track its progress.
              </p>

              <Link
                href="/menu"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-between bg-primary px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[210px]"
              >
                Browse Menu

                <span className="ml-5 text-lg">
                  →
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ===================================
                COUNT
            =================================== */}

            <div className="flex items-end justify-between border-b border-foreground/15 pb-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                Order History
              </p>

              <p className="font-sans text-xs text-foreground/45">
                {orders.length}{" "}
                {orders.length === 1
                  ? "order"
                  : "orders"}
              </p>
            </div>

            {/* ===================================
                ORDER LIST
            =================================== */}

            <div>
              {orders.map(
                (
                  order,
                  index
                ) => (
                  <article
                    key={
                      order.id
                    }
                    className="group border-b border-foreground/15 py-8 sm:py-10"
                  >
                    {/* ===========================
                        TOP ROW
                    =========================== */}

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-xs font-bold text-primary">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <span className="h-px w-8 bg-foreground/20" />

                          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                            Order
                          </p>
                        </div>

                        <p className="mt-3 break-all font-mono text-xs font-semibold leading-5 text-foreground sm:text-sm">
                          {
                            order.id
                          }
                        </p>
                      </div>

                      {/* STATUS */}

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center border px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.1em] ${orderStatusClassName(
                            order.orderStatus
                          )}`}
                        >
                          {
                            order.orderStatus
                          }
                        </span>

                        <span
                          className={`inline-flex items-center border px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.1em] ${paymentStatusClassName(
                            order.paymentStatus
                          )}`}
                        >
                          Payment:{" "}
                          {
                            order.paymentStatus
                          }
                        </span>
                      </div>
                    </div>

                    {/* ===========================
                        ORDER INFO
                    =========================== */}

                    <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 border-y border-foreground/10 py-6 sm:grid-cols-3">
                      {/* DATE */}

                      <div className="col-span-2 sm:col-span-1">
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                          {order.orderType ===
                          "regular"
                            ? "Pickup"
                            : "Catering Event"}
                        </p>

                        {order.orderType ===
                          "regular" &&
                        order.pickupDate &&
                        order.pickupTime ? (
                          <>
                            <p className="mt-2 font-rye text-lg text-foreground">
                              {formatDateOnly(
                                order.pickupDate
                              )}
                            </p>

                            <p className="mt-1 font-sans text-xs text-foreground/50">
                              {
                                order.pickupTime
                              }
                            </p>
                          </>
                        ) : order.orderType ===
                            "catering" &&
                          order.catering ? (
                          <>
                            <p className="mt-2 font-rye text-lg text-foreground">
                              {formatDateOnly(
                                order
                                  .catering
                                  .eventDate
                              )}
                            </p>

                            <p className="mt-1 font-sans text-xs text-foreground/50">
                              {
                                order
                                  .catering
                                  .guestCount
                              }{" "}
                              guests
                            </p>
                          </>
                        ) : (
                          <p className="mt-2 font-sans text-sm text-foreground/40">
                            Information
                            unavailable
                          </p>
                        )}
                      </div>

                      {/* ITEMS */}

                      <div>
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                          Items
                        </p>

                        <p className="mt-2 font-rye text-2xl text-foreground">
                          {order.items.reduce(
                            (
                              total,
                              item
                            ) =>
                              total +
                              item.quantity,
                            0
                          )}
                        </p>
                      </div>

                      {/* TOTAL */}

                      <div>
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                          Total
                        </p>

                        <p className="mt-2 font-rye text-2xl text-primary">
                          $
                          {order.total.toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ===========================
                        ACTION
                    =========================== */}

                    <div className="mt-6 flex justify-end">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="group/link inline-flex w-full items-center justify-between border border-foreground/20 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.13em] transition hover:border-foreground hover:bg-foreground hover:text-background sm:w-auto sm:min-w-[220px]"
                      >
                        View Order Details

                        <span className="ml-5 text-lg transition-transform group-hover/link:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

/* =============================================
   DATE
============================================= */

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

/* =============================================
   ORDER STATUS
============================================= */

function orderStatusClassName(
  status: string
) {
  if (
    status === "cancelled"
  ) {
    return "border-accent/25 bg-accent/10 text-accent";
  }

  if (
    status === "completed" ||
    status === "ready"
  ) {
    return "border-secondary/30 bg-secondary/10 text-foreground";
  }

  if (
    status === "confirmed" ||
    status === "preparing"
  ) {
    return "border-primary/25 bg-primary/10 text-primary";
  }

  return "border-foreground/15 bg-foreground/[0.03] text-foreground/60";
}

/* =============================================
   PAYMENT STATUS
============================================= */

function paymentStatusClassName(
  status: string
) {
  if (
    status === "failed" ||
    status === "refunded"
  ) {
    return "border-accent/25 bg-accent/10 text-accent";
  }

  if (
    status === "paid"
  ) {
    return "border-secondary/30 bg-secondary/10 text-foreground";
  }

  return "border-foreground/15 bg-foreground/[0.03] text-foreground/60";
}