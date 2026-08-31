import Link from "next/link";

import { getAdminCustomers } from "@/actions/customers/getAdminCustomers";

export default async function AdminCustomersPage() {
  const customers =
    await getAdminCustomers();

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.isActive
    ).length;

  const inactiveCustomers =
    customers.length -
    activeCustomers;

  return (
    <main className="space-y-8">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Customer Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Customers
          </h1>

          <p className="mt-2 max-w-2xl text-foreground/60">
            View registered customer
            accounts and their contact
            information.
          </p>
        </div>

        <Link
          href="/admin"
          className="font-semibold text-primary hover:underline"
        >
          ← Admin Dashboard
        </Link>
      </div>

      {/* ======================================
          SUMMARY
      ====================================== */}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-foreground/50">
            Total Customers
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {customers.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-foreground/50">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {activeCustomers}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-foreground/50">
            Inactive
          </p>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {inactiveCustomers}
          </p>
        </div>
      </section>

      {/* ======================================
          CUSTOMER DIRECTORY
      ====================================== */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">
            Customer Directory
          </h2>

          <span className="text-sm text-foreground/50">
            {customers.length}{" "}
            {customers.length === 1
              ? "customer"
              : "customers"}
          </span>
        </div>

        {customers.length === 0 ? (
          <div className="mt-6 rounded-xl bg-background p-8 text-center">
            <h3 className="font-semibold">
              No customers yet
            </h3>

            <p className="mt-2 text-sm text-foreground/60">
              Registered customer
              accounts will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
            {/* ==================================
                DESKTOP HEADINGS
            ================================== */}

            <div className="hidden grid-cols-[1.2fr_1.5fr_1fr_.7fr_.7fr_.5fr] gap-4 bg-background px-4 py-3 text-sm font-semibold text-foreground/60 md:grid">
              <span>
                Customer
              </span>

              <span>
                Email
              </span>

              <span>
                Phone
              </span>

              <span>
                Account
              </span>

              <span>
                Email
              </span>

              <span>
                Actions
              </span>
            </div>

            {/* ==================================
                CUSTOMERS
            ================================== */}

            {customers.map(
              (customer) => (
                <div
                  key={
                    customer.id
                  }
                  className="grid gap-4 border-t border-black/10 px-4 py-5 first:border-t-0 md:grid-cols-[1.2fr_1.5fr_1fr_.7fr_.7fr_.5fr] md:items-center"
                >
                  {/* ==============================
                      CUSTOMER
                  ============================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold md:mt-0">
                      {
                        customer.firstName
                      }{" "}
                      {
                        customer.lastName
                      }
                    </p>

                    <p className="mt-1 font-mono text-xs text-foreground/30">
                      #
                      {customer.id.slice(
                        -8
                      )}
                    </p>
                  </div>

                  {/* ==============================
                      EMAIL
                  ============================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Email
                    </p>

                    <a
                      href={`mailto:${customer.email}`}
                      className="mt-1 block break-all text-sm text-primary hover:underline md:mt-0"
                    >
                      {
                        customer.email
                      }
                    </a>
                  </div>

                  {/* ==============================
                      PHONE
                  ============================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Phone
                    </p>

                    {customer.phone ? (
                      <a
                        href={`tel:${customer.phone}`}
                        className="mt-1 block text-sm text-primary hover:underline md:mt-0"
                      >
                        {
                          customer.phone
                        }
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-foreground/40 md:mt-0">
                        —
                      </p>
                    )}
                  </div>

                  {/* ==============================
                      ACCOUNT STATUS
                  ============================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Account
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold md:mt-0 ${
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

                  {/* ==============================
                      EMAIL VERIFICATION
                  ============================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Email Verification
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold md:mt-0 ${
                        customer.emailVerified
                          ? "bg-secondary/10 text-foreground"
                          : "bg-background text-foreground/50"
                      }`}
                    >
                      {customer.emailVerified
                        ? "Verified"
                        : "Unverified"}
                    </span>
                  </div>

                  {/* ==============================
                      ACTIONS
                  ============================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Actions
                    </p>

                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="mt-1 inline-block text-sm font-semibold text-primary hover:underline md:mt-0"
                    >
                      View →
                    </Link>
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