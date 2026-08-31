import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminCustomer } from "@/actions/customers/getAdminCustomer";

import CustomerActiveToggle from "@/features/customers/components/admin/CustomerActiveToggle";

interface AdminCustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCustomerPage({
  params,
}: AdminCustomerPageProps) {
  const { id } =
    await params;

  const customer =
    await getAdminCustomer(
      id
    );

  if (!customer) {
    notFound();
  }

  const customerName =
    `${customer.firstName} ${customer.lastName}`;

  const totalSpent =
    customer.orders
      .filter(
        (order) =>
          order.paymentStatus ===
          "paid"
      )
      .reduce(
        (
          total,
          order
        ) =>
          total +
          order.total,
        0
      );

  return (
    <main className="space-y-8">
      {/* Back */}

      <Link
        href="/admin/customers"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Customers
      </Link>

      {/* Header */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Customer
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {customerName}
          </h1>

          <p className="mt-2 font-mono text-xs text-foreground/40">
            Customer ID:{" "}
            {customer.id}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            customer.isActive
              ? "bg-secondary/10 text-foreground"
              : "bg-background text-foreground/50"
          }`}
        >
          {customer.isActive
            ? "Active"
            : "Inactive"}
        </span>
      </div>

      {/* Customer information */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-bold">
              Account Information
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  Email
                </p>

                <a
                  href={`mailto:${customer.email}`}
                  className="mt-2 block text-primary hover:underline"
                >
                  {customer.email}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  Phone
                </p>

                {customer.phone ? (
                  <a
                    href={`tel:${customer.phone}`}
                    className="mt-2 block text-primary hover:underline"
                  >
                    {customer.phone}
                  </a>
                ) : (
                  <p className="mt-2 text-foreground/40">
                    Not provided
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  Email Verification
                </p>

                <p className="mt-2 font-semibold">
                  {customer.emailVerified
                    ? "Verified"
                    : "Unverified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  Account Status
                </p>

                <p className="mt-2 font-semibold">
                  {customer.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          <CustomerActiveToggle
            customerId={
              customer.id
            }
            customerName={
              customerName
            }
            isActive={
              customer.isActive
            }
          />
        </div>
      </section>

      {/* Summary */}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-foreground/50">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            {
              customer.orders
                .length
            }
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-foreground/50">
            Paid Order Value
          </p>

          <p className="mt-2 text-3xl font-bold text-primary">
            $
            {totalSpent.toFixed(
              2
            )}
          </p>
        </div>
      </section>

      {/* Orders */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">
            Order History
          </h2>

          <span className="text-sm text-foreground/50">
            {
              customer.orders
                .length
            }{" "}
            orders
          </span>
        </div>

        {customer.orders.length ===
        0 ? (
          <div className="mt-6 rounded-xl bg-background p-6 text-center">
            <p className="text-sm text-foreground/60">
              This customer has no
              account-linked orders yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
            <div className="hidden grid-cols-[1fr_.8fr_.8fr_.8fr_.8fr_.5fr] gap-4 bg-background px-4 py-3 text-sm font-semibold text-foreground/60 md:grid">
              <span>
                Order
              </span>

              <span>
                Type
              </span>

              <span>
                Date
              </span>

              <span>
                Order Status
              </span>

              <span>
                Payment
              </span>

              <span>
                Total
              </span>
            </div>

            {customer.orders.map(
              (order) => (
                <div
                  key={
                    order.id
                  }
                  className="grid gap-4 border-t border-black/10 px-4 py-5 first:border-t-0 md:grid-cols-[1fr_.8fr_.8fr_.8fr_.8fr_.5fr] md:items-center"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Order
                    </p>

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="mt-1 font-mono text-sm font-semibold text-primary hover:underline md:mt-0"
                    >
                      #
                      {order.id.slice(
                        -8
                      )}
                    </Link>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Type
                    </p>

                    <p className="mt-1 text-sm capitalize md:mt-0">
                      {
                        order.orderType
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Date
                    </p>

                    <p className="mt-1 text-sm md:mt-0">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Order Status
                    </p>

                    <p className="mt-1 text-sm capitalize md:mt-0">
                      {
                        order.orderStatus
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Payment
                    </p>

                    <p className="mt-1 text-sm capitalize md:mt-0">
                      {
                        order.paymentStatus
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Total
                    </p>

                    <p className="mt-1 font-semibold md:mt-0">
                      $
                      {order.total.toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(
    new Date(value)
  );
}