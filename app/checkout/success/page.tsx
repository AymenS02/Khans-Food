import Link from "next/link";
import { notFound } from "next/navigation";

import { getCheckoutSuccessOrder } from "@/actions/checkout/getCheckoutSuccessOrder";

import CheckoutSuccessStatus from "@/features/checkout/components/CheckoutSuccessStatus";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    token?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const {
    orderId,
    token,
  } =
    await searchParams;

  /*
   * Both are required.
   *
   * Order ID by itself is NOT
   * authorization anymore.
   */
  if (
    !orderId ||
    !token
  ) {
    notFound();
  }

  const order =
    await getCheckoutSuccessOrder(
      orderId,
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
            Khans Food
          </p>

          <h1 className="mt-4 max-w-4xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Your Order
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            Review your order details
            below while we confirm the
            latest payment and order
            status.
          </p>
        </div>
      </section>

      {/* =========================================
          CONTENT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* =====================================
              LEFT
          ===================================== */}

          <div>
            {/* ===================================
                LIVE STATUS
            =================================== */}

            <section className="border-b border-foreground/15 pb-10">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Order Status
              </p>

              <div className="mt-5">
                <CheckoutSuccessStatus
                  orderId={
                    order.id
                  }
                  accessToken={
                    token
                  }
                  firstName={
                    order.firstName
                  }
                  initialPaymentStatus={
                    order.paymentStatus
                  }
                  initialOrderStatus={
                    order.orderStatus
                  }
                />
              </div>
            </section>

            {/* ===================================
                PICKUP INFO
            =================================== */}

            <section className="border-b border-foreground/15 py-10">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Pickup Details
              </p>

              <div className="mt-6 grid gap-7 sm:grid-cols-2">
                <div>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                    Pickup Date
                  </p>

                  <p className="mt-2 font-rye text-xl text-foreground sm:text-2xl">
                    {formatDateOnly(
                      order.pickupDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                    Pickup Time
                  </p>

                  <p className="mt-2 font-rye text-xl text-primary sm:text-2xl">
                    {
                      order.pickupTime
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* ===================================
                ITEMS
            =================================== */}

            <section className="py-10">
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
                        `${item.name}-${index}`
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
                WHAT'S NEXT
            =================================== */}

            <section className="border-t border-foreground/15 pt-10">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                What&apos;s Next?
              </p>

              <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
                Keep Track of Your
                Order.
              </h2>

              <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-foreground/55 sm:text-base">
                If you&apos;re signed
                in, you can track this
                order from your account.
                You can also head back
                to the menu whenever
                you&apos;re ready.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/account/orders"
                  className="group flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 sm:w-auto sm:min-w-[210px]"
                >
                  View My Orders

                  <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/menu"
                  className="group flex min-h-12 w-full items-center justify-between border border-foreground/20 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-foreground hover:text-background sm:w-auto sm:min-w-[190px]"
                >
                  Browse Menu

                  <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </section>
          </div>

          {/* =====================================
              ORDER SUMMARY
          ===================================== */}

          <aside className="h-fit bg-foreground text-background lg:sticky lg:top-28">
            <div className="p-6 sm:p-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Order Summary
              </p>

              <h2 className="mt-3 font-rye text-3xl">
                Your Total
              </h2>

              <div className="my-6 h-px bg-background/15" />

              {/* ORDER ID */}

              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Order
                </p>

                <p className="mt-2 break-all font-mono text-xs leading-5 text-background/60">
                  {order.id}
                </p>
              </div>

              {/* PICKUP */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Pickup
                </p>

                <p className="mt-2 font-sans text-sm font-semibold">
                  {formatDateOnly(
                    order.pickupDate
                  )}
                </p>

                <p className="mt-1 font-sans text-xs text-background/50">
                  {
                    order.pickupTime
                  }
                </p>
              </div>

              {/* SUBTOTAL */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans text-xs text-background/45">
                    Subtotal
                  </span>

                  <span className="font-sans text-sm font-semibold">
                    $
                    {order.subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="font-sans text-xs text-background/45">
                    Tax (
                    {(
                      order.taxRate *
                      100
                    ).toFixed(
                      0
                    )}
                    %)
                  </span>

                  <span className="font-sans text-sm font-semibold">
                    $
                    {order.tax.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              {/* TOTAL */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Total
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {order.total.toFixed(
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
                    Payment status is
                    verified against
                    your order before
                    confirmation.
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
  ).format(
    new Date(date)
  );
}