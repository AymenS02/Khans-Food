import { notFound } from "next/navigation";
import Link from "next/link";

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
    <main className="mx-auto max-w-3xl px-5 py-12">
      {/*
       * Only clear cart/payment storage
       * once our DATABASE confirms payment.
       *
       * A Stripe browser redirect alone
       * does not mean we mark it paid.
       */}

      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="border-b border-black/10 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Khans Food
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Your Order
          </h1>
        </div>
        
        <section className="border-b border-black/10 py-6">
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
        </section>

        {/* ==========================================
            ORDER INFO
        ========================================== */}

        <section className="grid gap-5 border-b border-black/10 py-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-foreground/50">
              Order
            </p>

            <p className="mt-1 break-all font-mono text-sm font-semibold">
              {order.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-foreground/50">
              Pickup
            </p>

            <p className="mt-1 font-semibold">
              {formatDateOnly(
                order.pickupDate
              )}
            </p>

            <p className="mt-1 text-sm text-foreground/60">
              {order.pickupTime}
            </p>
          </div>

          <div>
            <p className="text-sm text-foreground/50">
              Total
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              $
              {order.total.toFixed(
                2
              )}
            </p>
          </div>
        </section>

        {/* ==========================================
            ITEMS
        ========================================== */}

        <section className="border-b border-black/10 py-6">
          <h2 className="text-xl font-bold text-foreground">
            Items
          </h2>

          <div className="mt-5 divide-y divide-black/10">
            {order.items.map(
              (item, index) => (
                <div
                  key={
                    item.menuItem ??
                    `${item.name}-${index}`
                  }
                  className="flex items-start justify-between gap-6 py-4 first:pt-0"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-foreground/60">
                      $
                      {item.price.toFixed(
                        2
                      )}
                      {" × "}
                      {
                        item.quantity
                      }
                    </p>
                  </div>

                  <p className="font-semibold">
                    $
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* ==========================================
            TOTALS
        ========================================== */}

        <section className="pt-6">
          <div className="ml-auto max-w-sm space-y-3">
            <div className="flex justify-between gap-6">
              <span className="text-foreground/60">
                Subtotal
              </span>

              <span>
                $
                {order.subtotal.toFixed(
                  2
                )}
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="text-foreground/60">
                Tax (
                {(
                  order.taxRate *
                  100
                ).toFixed(0)}
                %)
              </span>

              <span>
                $
                {order.tax.toFixed(
                  2
                )}
              </span>
            </div>

            <div className="flex justify-between gap-6 border-t border-black/10 pt-3 text-lg font-bold">
              <span>
                Total
              </span>

              <span>
                $
                {order.total.toFixed(
                  2
                )}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 border-t border-black/10 pt-6">
          <h2 className="text-lg font-bold text-foreground">What&apos;s next?</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            You can track this order from your account when signed in, or continue browsing the menu.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/account/orders"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              View My Orders
            </Link>
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background"
            >
              Browse Menu
            </Link>
          </div>
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
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(date)
  );
}