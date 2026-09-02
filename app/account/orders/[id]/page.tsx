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
  const { id } =
    await params;

  const order =
    await getCustomerOrderById(
      id
    );

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Link
          href="/account/orders"
          className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50 transition hover:text-primary"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back to My Orders
        </Link>

        <div className="mt-10 flex flex-col gap-8 border-b border-foreground/15 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Order Details
            </p>

            <h1 className="mt-4 font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Order
            </h1>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-16 bg-foreground/25" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="break-all font-mono text-xs font-semibold leading-5 text-foreground/60 sm:text-sm">
              {order.id}
            </p>

            <p className="mt-3 font-sans text-xs text-foreground/40">
              Placed{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString(
                "en-CA",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          {/* STATUS */}

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center border px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.1em] ${orderStatusClassName(
                order.orderStatus
              )}`}
            >
              Order:{" "}
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
      </section>

      {/* =========================================
          ORDER BODY
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* =====================================
              LEFT
          ===================================== */}

          <div>
            {/* ===================================
                FULFILLMENT
            =================================== */}

            <section className="border-b border-foreground/15 pb-10">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Fulfillment
              </p>

              {order.orderType ===
                "regular" &&
              order.pickupDate &&
              order.pickupTime ? (
                <div className="mt-5">
                  <h2 className="font-rye text-3xl text-foreground">
                    Pickup
                  </h2>

                  <p className="mt-4 font-sans text-sm text-foreground/45">
                    Date
                  </p>

                  <p className="mt-1 font-rye text-xl">
                    {formatDateOnly(
                      order.pickupDate
                    )}
                  </p>

                  <p className="mt-4 font-sans text-sm text-foreground/45">
                    Time
                  </p>

                  <p className="mt-1 font-rye text-xl text-primary">
                    {
                      order.pickupTime
                    }
                  </p>
                </div>
              ) : order.orderType ===
                  "catering" &&
                order.catering ? (
                <div className="mt-5">
                  <h2 className="font-rye text-3xl text-foreground">
                    Catering Event
                  </h2>

                  <div className="mt-5 grid grid-cols-2 gap-8">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-[0.15em] text-foreground/40">
                        Event Date
                      </p>

                      <p className="mt-2 font-rye text-xl">
                        {formatDateOnly(
                          order
                            .catering
                            .eventDate
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-sans text-xs uppercase tracking-[0.15em] text-foreground/40">
                        Guests
                      </p>

                      <p className="mt-2 font-rye text-xl text-primary">
                        {
                          order
                            .catering
                            .guestCount
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-5 font-sans text-sm text-accent">
                  Fulfillment
                  information is
                  currently
                  unavailable.
                </p>
              )}
            </section>

            {/* ===================================
                ITEMS
            =================================== */}

            <section className="py-12">
              <div className="flex items-end justify-between border-b border-foreground/15 pb-5">
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                    Your Food
                  </p>

                  <h2 className="mt-2 font-rye text-3xl text-foreground sm:text-4xl">
                    Order Items
                  </h2>
                </div>

                <p className="font-sans text-xs text-foreground/40">
                  {order.items.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      item.quantity,
                    0
                  )}{" "}
                  items
                </p>
              </div>

              <div>
                {order.items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.menuItem ??
                        `${item.name}-${item.quantity}`
                      }
                      className="grid grid-cols-[auto_1fr] gap-4 border-b border-foreground/10 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6"
                    >
                      <span className="font-sans text-[10px] font-bold text-primary">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div className="min-w-0">
                        <p className="font-rye text-lg leading-tight text-foreground sm:text-xl">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-2 font-sans text-xs text-foreground/45">
                          $
                          {item.price.toFixed(
                            2
                          )}{" "}
                          ×{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p className="col-start-2 font-sans text-sm font-bold text-foreground sm:col-start-auto sm:text-right">
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ===================================
                CATERING PAYMENT
            =================================== */}

            {order.orderType ===
              "catering" &&
              order.paymentStatus !==
                "paid" &&
              order.orderStatus !==
                "cancelled" && (
                <section className="border-t border-foreground/15 pt-12">
                  <div className="bg-foreground px-6 py-8 text-background sm:px-8 sm:py-10">
                    <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                      Action Required
                    </p>

                    <h2 className="mt-3 font-rye text-3xl">
                      Payment Required
                    </h2>

                    <div className="my-6 h-px bg-background/15" />

                    <p className="max-w-xl font-sans text-sm leading-6 text-background/60">
                      Your catering
                      request has been
                      approved. Complete
                      payment to confirm
                      your catering
                      order.
                    </p>

                    <p className="mt-7 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-background/40">
                      Amount Due
                    </p>

                    <p className="mt-2 font-rye text-4xl text-primary">
                      $
                      {order.total.toFixed(
                        2
                      )}
                    </p>

                    <form
                      action={
                        prepareCateringPayment
                      }
                      className="mt-7"
                    >
                      <input
                        type="hidden"
                        name="orderId"
                        value={
                          order.id
                        }
                      />

                      <button
                        type="submit"
                        className="flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:max-w-sm"
                      >
                        Pay Catering
                        Order

                        <span className="text-lg">
                          →
                        </span>
                      </button>
                    </form>
                  </div>
                </section>
              )}

            {/* ===================================
                PAID CATERING
            =================================== */}

            {order.orderType ===
              "catering" &&
              order.paymentStatus ===
                "paid" && (
                <section className="border-t border-foreground/15 pt-12">
                  <div className="border border-secondary/30 bg-secondary/10 px-6 py-7">
                    <div className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary font-sans text-sm font-bold text-white">
                        ✓
                      </span>

                      <div>
                        <p className="font-rye text-2xl text-foreground">
                          Catering Order
                          Paid
                        </p>

                        <p className="mt-2 font-sans text-sm leading-6 text-foreground/55">
                          No payment is
                          currently due
                          for this order.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
          </div>

          {/* =====================================
              SUMMARY
          ===================================== */}

          <aside className="h-fit border border-foreground/15 lg:sticky lg:top-28">
            <div className="p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Summary
              </p>

              <h2 className="mt-3 font-rye text-3xl text-foreground">
                Order Total
              </h2>

              <div className="my-6 h-px bg-foreground/15" />

              <div className="space-y-4 font-sans text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground/50">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    $
                    {order.subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground/50">
                    Tax (
                    {(
                      order.taxRate *
                      100
                    ).toFixed(
                      0
                    )}
                    %)
                  </span>

                  <span className="font-semibold">
                    $
                    {order.tax.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-foreground/15 pt-6">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                  Total
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {order.total.toFixed(
                    2
                  )}
                </p>
              </div>

              <div className="mt-7 border-t border-foreground/15 pt-6">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                  Order Type
                </p>

                <p className="mt-2 font-sans text-sm font-semibold capitalize">
                  {
                    order.orderType
                  }
                </p>
              </div>

              <div className="mt-6">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                  Payment
                </p>

                <p className="mt-2 font-sans text-sm font-semibold capitalize">
                  {
                    order.paymentStatus
                  }
                </p>
              </div>
            </div>
          </aside>
        </div>
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