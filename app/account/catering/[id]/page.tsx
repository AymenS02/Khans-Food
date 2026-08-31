import Link from "next/link";
import { notFound } from "next/navigation";

import { getCustomerCateringRequest } from "@/actions/catering/getCustomerCateringRequest";

import CustomerCateringStatusBadge from "@/features/catering/components/CustomerCateringStatusBadge";

interface CustomerCateringRequestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerCateringRequestPage({
  params,
}: CustomerCateringRequestPageProps) {
  const { id } =
    await params;

  const request =
    await getCustomerCateringRequest(
      id
    );

  if (!request) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      {/* ======================================
          BACK
      ====================================== */}

      <Link
        href="/account/catering"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Catering Requests
      </Link>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Catering Request
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Request #
            {request.id.slice(-8)}
          </h1>

          <p className="mt-2 text-sm text-foreground/50">
            Submitted{" "}
            {formatDateTime(
              request.createdAt
            )}
          </p>
        </div>

        <CustomerCateringStatusBadge
          status={
            request.status
          }
        />
      </div>

      {/* ======================================
          EVENT INFORMATION
      ====================================== */}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold">
          Event Information
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
              Event Date
            </p>

            <p className="mt-2 font-semibold">
              {formatDate(
                request.eventDate
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
              Guest Count
            </p>

            <p className="mt-2 font-semibold">
              {
                request.guestCount
              }{" "}
              guests
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
              Request Type
            </p>

            <p className="mt-2 font-semibold">
              {request.selectionType ===
              "package"
                ? "Catering Package"
                : "Custom Catering"}
            </p>
          </div>
        </div>

        {request.notes && (
          <div className="mt-6 border-t border-black/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
              Your Notes
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground/70">
              {request.notes}
            </p>
          </div>
        )}
      </section>

      {/* ======================================
          REQUESTED CATERING
      ====================================== */}

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold">
          Requested Catering
        </h2>

        {/* Package Request */}

        {request.selectionType ===
          "package" &&
        request.package ? (
          <div className="mt-5 rounded-xl border border-black/10 p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  Package
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {
                    request.package
                      .name
                  }
                </h3>
              </div>

              <div className="sm:text-right">
                <p className="text-lg font-bold text-primary">
                  $
                  {request.package.price.toFixed(
                    2
                  )}
                </p>

                <p className="mt-1 text-xs text-foreground/50">
                  {request.package
                    .pricingType ===
                  "per_person"
                    ? "per person"
                    : "package price at request time"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-foreground/50">
              This is a snapshot of the
              package that was selected
              when the catering request
              was submitted.
            </p>
          </div>
        ) : null}

        {/* Custom Request */}

        {request.selectionType ===
        "custom" ? (
          request.customItems.length ===
          0 ? (
            <p className="mt-5 text-sm text-foreground/60">
              No custom items were
              recorded for this request.
            </p>
          ) : (
            <div className="mt-5 overflow-hidden rounded-xl border border-black/10">
              {request.customItems.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={`${item.cateringItem}-${index}`}
                    className="flex flex-col justify-between gap-3 border-t border-black/10 p-4 first:border-t-0 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {
                          item.quantity
                        }
                        ×{" "}
                        {
                          item.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-foreground/50">
                        {item.pricingType ===
                        "per_person"
                          ? `$${item.price.toFixed(
                              2
                            )} per person`
                          : `$${item.price.toFixed(
                              2
                            )} each`}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-foreground/70">
                      {formatCustomItemPricing(
                        item.price,
                        item.quantity,
                        item.pricingType,
                        request.guestCount
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          )
        ) : null}
      </section>

      {/* ======================================
          STATUS
      ====================================== */}

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold">
          Request Status
        </h2>

        <div className="mt-5">
          <CustomerCateringStatusBadge
            status={
              request.status
            }
          />
        </div>

        <p className="mt-4 text-sm leading-6 text-foreground/60">
          {getStatusMessage(
            request.status
          )}
        </p>

        {request.adminNotes && (
          <div className="mt-6 rounded-xl bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
              Message from Khans Food
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground/70">
              {
                request.adminNotes
              }
            </p>
          </div>
        )}
      </section>

      {/* ======================================
          OFFICIAL QUOTE
      ====================================== */}

      {request.quotedTotal !==
        undefined && (
        <section className="mt-6 rounded-2xl border border-primary/20 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
              Official Quote
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Catering Total
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {request.quotedSubtotal !==
              undefined && (
              <div className="flex items-center justify-between gap-5 text-sm">
                <span className="text-foreground/60">
                  Subtotal
                </span>

                <span className="font-semibold">
                  $
                  {request.quotedSubtotal.toFixed(
                    2
                  )}
                </span>
              </div>
            )}

            {request.tax !==
              undefined && (
              <div className="flex items-center justify-between gap-5 text-sm">
                <span className="text-foreground/60">
                  Tax
                  {request.taxRate !==
                    undefined &&
                    ` (${formatTaxRate(
                      request.taxRate
                    )})`}
                </span>

                <span className="font-semibold">
                  $
                  {request.tax.toFixed(
                    2
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-5 border-t border-black/10 pt-4">
              <span className="font-bold">
                Total
              </span>

              <span className="text-2xl font-bold text-primary">
                $
                {request.quotedTotal.toFixed(
                  2
                )}
              </span>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-foreground/50">
            This is the official quote
            prepared by Khans Food for
            this catering request.
          </p>
        </section>
      )}

      {/* ======================================
          APPROVED ORDER / PAYMENT
      ====================================== */}

      {request.status ===
        "approved" &&
        request.orderId && (
          <section className="mt-6 rounded-2xl border border-primary/20 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold">
              Your Catering Order
            </h2>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
              Your catering request has
              been approved and an order
              has been created.
            </p>

            <Link
              href={`/account/orders/${request.orderId}/payment`}
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              View Catering Order →
            </Link>
          </section>
        )}

      {/* ======================================
          LAST UPDATED
      ====================================== */}

      <p className="mt-8 text-xs text-foreground/40">
        Last updated{" "}
        {formatDateTime(
          request.updatedAt
        )}
      </p>
    </main>
  );
}

/*
 * ============================================
 * DATE HELPERS
 * ============================================
 */

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      year: "numeric",

      month: "long",

      day: "numeric",
    }
  ).format(
    new Date(value)
  );
}

function formatDateTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      year: "numeric",

      month: "short",

      day: "numeric",

      hour: "numeric",

      minute:
        "2-digit",
    }
  ).format(
    new Date(value)
  );
}

/*
 * ============================================
 * CUSTOM ITEM PRICING
 * ============================================
 */

function formatCustomItemPricing(
  price: number,
  quantity: number,
  pricingType:
    | "flat"
    | "per_person",
  guestCount: number
) {
  const total =
    pricingType ===
    "per_person"
      ? price *
        quantity *
        guestCount
      : price *
        quantity;

  return `$${total.toFixed(
    2
  )}`;
}

/*
 * ============================================
 * TAX RATE
 * ============================================
 *
 * Handles either:
 *
 * 0.13 → 13%
 *
 * or
 *
 * 13 → 13%
 *
 * so the UI is tolerant of the storage
 * representation.
 */

function formatTaxRate(
  rate: number
) {
  const percentage =
    rate <= 1
      ? rate * 100
      : rate;

  return `${percentage.toFixed(
    Number.isInteger(
      percentage
    )
      ? 0
      : 2
  )}%`;
}

/*
 * ============================================
 * STATUS COPY
 * ============================================
 */

function getStatusMessage(
  status:
    | "submitted"
    | "reviewing"
    | "approved"
    | "rejected"
    | "cancelled"
) {
  switch (status) {
    case "submitted":
      return "Your request has been received. Khans Food will review the event details before providing the next steps.";

    case "reviewing":
      return "Your catering request is currently being reviewed. Any official quote or message from Khans Food will appear on this page.";

    case "approved":
      return "Your catering request has been approved. If an order has been created, you can continue to payment below.";

    case "rejected":
      return "This catering request could not be approved. Please review any message from Khans Food below.";

    case "cancelled":
      return "This catering request has been cancelled.";
  }
}