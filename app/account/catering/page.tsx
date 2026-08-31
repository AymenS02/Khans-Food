import Link from "next/link";

import { getCustomerCateringRequests } from "@/actions/catering/getCustomerCateringRequests";

import CustomerCateringStatusBadge from "@/features/catering/components/CustomerCateringStatusBadge";

export default async function CustomerCateringRequestsPage() {
  const requests =
    await getCustomerCateringRequests();

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      {/* Header */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            My Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Catering Requests
          </h1>

          <p className="mt-2 max-w-2xl text-foreground/60">
            Track your catering
            requests, approvals, and
            related orders.
          </p>
        </div>

        <Link
          href="/catering"
          className="w-fit rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          New Catering Request
        </Link>
      </div>

      {/* Requests */}

      {requests.length === 0 ? (
        <section className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold">
            No catering requests yet
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-foreground/60">
            When you submit a catering
            request, you&apos;ll be able
            to track its status here.
          </p>

          <Link
            href="/catering"
            className="mt-6 inline-block font-semibold text-primary hover:underline"
          >
            Browse Catering →
          </Link>
        </section>
      ) : (
        <section className="mt-8 space-y-4">
          {requests.map(
            (request) => (
              <article
                key={
                  request.id
                }
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
              >
                {/* Top */}

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                      Catering Request
                    </p>

                    <p className="mt-1 font-mono text-sm font-semibold">
                      #
                      {request.id.slice(
                        -8
                      )}
                    </p>
                  </div>

                  <CustomerCateringStatusBadge
                    status={
                      request.status
                    }
                  />
                </div>

                {/* Details */}

                <div className="mt-6 grid gap-4 border-t border-black/10 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                      Event Date
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatDate(
                        request.eventDate
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                      Guests
                    </p>

                    <p className="mt-1 font-semibold">
                      {
                        request.guestCount
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                      Request Type
                    </p>

                    <p className="mt-1 font-semibold">
                      {request.selection ===
                      "package"
                        ? "Catering Package"
                        : "Custom Catering"}
                    </p>
                  </div>
                </div>

                {/* Submitted */}

                <p className="mt-5 text-xs text-foreground/40">
                  Submitted{" "}
                  {formatDate(
                    request.createdAt
                  )}
                </p>

                {/* Approved Order */}

                {request.status ===
                  "approved" &&
                  request.orderId && (
                    <div className="mt-5 border-t border-black/10 pt-5">
                      <Link
                        href={`/account/orders/${request.orderId}/payment`}
                        className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        View Catering Order →
                      </Link>
                    </div>
                  )}
              </article>
            )
          )}
        </section>
      )}
    </main>
  );
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      year:
        "numeric",

      month:
        "short",

      day:
        "numeric",
    }
  ).format(
    new Date(value)
  );
}