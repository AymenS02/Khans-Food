import Link from "next/link";

import { getAdminCateringRequestById } from "@/actions/catering/getAdminCateringRequestById";
import { saveCateringQuote } from "@/actions/catering/saveCateringQuote";
import { markCateringRequestReviewing } from "@/actions/catering/markCateringRequestReviewing";
import { approveCateringRequest } from "@/actions/catering/approveCateringRequest";
import { rejectCateringRequest } from "@/actions/catering/rejectCateringRequest";
import { createCateringPaymentAccessToken } from "@/lib/orderAccessToken";

import type { AdminCateringRequest } from "@/features/catering/types/adminCatering";

interface AdminCateringRequestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCateringRequestPage({
  params,
}: AdminCateringRequestPageProps) {
  const { id } = await params;

  const request =
    await getAdminCateringRequestById(id);

  const suggestedSubtotal =
    calculateRequestEstimate(request);

  const guestPaymentToken =
    request.status === "approved" &&
    request.order &&
    !request.customer
      ? createCateringPaymentAccessToken(
          request.order,
          request.id
        )
      : null;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      {/* Back */}
      <Link
        href="/admin/catering"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Catering Requests
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* =====================================================
            MAIN REQUEST DETAILS
        ===================================================== */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="border-b border-black/10 pb-6">
            <p className="text-sm text-foreground/50">
              Catering Request
            </p>

            <h1 className="mt-1 break-all font-mono text-xl font-bold text-foreground">
              {request.id}
            </h1>

            <p className="mt-2 text-sm text-foreground/60">
              Submitted{" "}
              {formatSubmittedDate(
                request.createdAt
              )}
            </p>
          </div>

          {/* Customer */}
          <section className="border-b border-black/10 py-6">
            <h2 className="text-xl font-bold text-foreground">
              Customer
            </h2>

            <div className="mt-4 space-y-2">
              <p className="font-semibold">
                {request.firstName}{" "}
                {request.lastName}
              </p>

              <p>{request.email}</p>

              <p>{request.phone}</p>

              <p className="text-sm text-foreground/50">
                {request.customer
                  ? "Registered customer"
                  : "Guest request"}
              </p>
            </div>
          </section>

          {/* Event */}
          <section className="border-b border-black/10 py-6">
            <h2 className="text-xl font-bold text-foreground">
              Event
            </h2>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-foreground/50">
                  Event Date
                </p>

                <p className="mt-1 font-semibold">
                  {formatEventDate(
                    request.eventDate
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-foreground/50">
                  Guests
                </p>

                <p className="mt-1 font-semibold">
                  {request.guestCount}
                </p>
              </div>
            </div>
          </section>

          {/* Catering Selection */}
          <section className="border-b border-black/10 py-6">
            <h2 className="text-xl font-bold text-foreground">
              Catering Selection
            </h2>

            {/* Package */}
            {request.selectionType ===
              "package" &&
              request.package && (
                <div className="mt-4 rounded-xl bg-background p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                    Package
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {request.package.name}
                  </h3>

                  <p className="mt-3 font-semibold text-primary">
                    $
                    {request.package.price.toFixed(
                      2
                    )}

                    {request.package
                      .pricingType ===
                      "per_person" && (
                      <span className="ml-1 text-sm font-normal text-foreground/50">
                        / person
                      </span>
                    )}
                  </p>

                  <div className="mt-4 border-t border-black/10 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground/60">
                        Estimated subtotal
                      </span>

                      <span className="font-semibold">
                        $
                        {suggestedSubtotal.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* Custom */}
            {request.selectionType ===
              "custom" && (
              <>
                {request.customItems
                  .length === 0 ? (
                  <div className="mt-4 rounded-xl bg-background p-5">
                    <p className="text-sm text-foreground/60">
                      No custom catering
                      items were recorded.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 divide-y divide-black/10">
                    {request.customItems.map(
                      (item, index) => {
                        const lineTotal =
                          calculateItemEstimate(
                            item.price,
                            item.pricingType,
                            item.quantity,
                            request.guestCount
                          );

                        return (
                          <div
                            key={`${item.name}-${index}`}
                            className="flex justify-between gap-6 py-4 first:pt-0"
                          >
                            <div>
                              <p className="font-semibold">
                                {
                                  item.name
                                }
                              </p>

                              <p className="mt-1 text-sm text-foreground/50">
                                $
                                {item.price.toFixed(
                                  2
                                )}

                                {item.pricingType ===
                                "per_person"
                                  ? " / person"
                                  : " / item"}

                                {" × "}

                                {
                                  item.quantity
                                }
                              </p>

                              {item.pricingType ===
                                "per_person" && (
                                <p className="mt-1 text-xs text-foreground/40">
                                  For{" "}
                                  {
                                    request.guestCount
                                  }{" "}
                                  guests
                                </p>
                              )}
                            </div>

                            <p className="font-semibold">
                              $
                              {lineTotal.toFixed(
                                2
                              )}
                            </p>
                          </div>
                        );
                      }
                    )}

                    <div className="flex items-center justify-between py-4">
                      <span className="font-semibold">
                        Estimated Subtotal
                      </span>

                      <span className="text-lg font-bold text-primary">
                        $
                        {suggestedSubtotal.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Defensive fallback */}
            {request.selectionType ===
              "package" &&
              !request.package && (
                <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-4">
                  <p className="text-sm font-semibold text-accent">
                    Package information
                    is missing from this
                    request.
                  </p>
                </div>
              )}
          </section>

          {/* Customer Notes */}
          {request.notes && (
            <section className="border-b border-black/10 py-6">
              <h2 className="text-xl font-bold text-foreground">
                Customer Notes
              </h2>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-foreground/70">
                {request.notes}
              </p>
            </section>
          )}

          {/* Admin Notes */}
          {request.adminNotes && (
            <section className="pt-6">
              <h2 className="text-xl font-bold text-foreground">
                Internal Admin Notes
              </h2>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-foreground/70">
                {request.adminNotes}
              </p>
            </section>
          )}
        </div>

        {/* =====================================================
            ADMIN MANAGEMENT SIDEBAR
        ===================================================== */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-foreground">
            Request Management
          </h2>

          {/* Status */}
          <div className="mt-5">
            <p className="text-sm text-foreground/50">
              Status
            </p>

            <span className="mt-2 inline-block rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
              {request.status}
            </span>
          </div>

          {/* Type */}
          <div className="mt-6">
            <p className="text-sm text-foreground/50">
              Request Type
            </p>

            <p className="mt-1 font-semibold capitalize">
              {request.selectionType}
            </p>
          </div>

          {/* ===================================================
              SUBMITTED
          =================================================== */}
          {request.status ===
            "submitted" && (
            <div className="mt-6 border-t border-black/10 pt-6">
              <p className="text-sm leading-6 text-foreground/60">
                Start reviewing this
                request before creating
                an official quote.
              </p>

              <form
                action={
                  markCateringRequestReviewing
                }
                className="mt-4"
              >
                <input
                  type="hidden"
                  name="requestId"
                  value={request.id}
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Start Reviewing
                </button>
              </form>
            </div>
          )}

          {/* ===================================================
              REVIEWING — QUOTE
          =================================================== */}
          {request.status ===
            "reviewing" && (
            <>
              <div className="mt-6 rounded-xl bg-background p-4">
                <p className="text-sm leading-6 text-foreground/60">
                  This request is
                  currently being
                  reviewed. Save an
                  official quote before
                  approving it.
                </p>
              </div>

              <form
                action={
                  saveCateringQuote
                }
                className="mt-6 border-t border-black/10 pt-6"
              >
                <input
                  type="hidden"
                  name="requestId"
                  value={request.id}
                />

                <h3 className="font-bold text-foreground">
                  Official Quote
                </h3>

                <p className="mt-2 text-sm text-foreground/50">
                  Customer selection
                  estimate: $
                  {suggestedSubtotal.toFixed(
                    2
                  )}
                </p>

                {/* Quote subtotal */}
                <div className="mt-5">
                  <label
                    htmlFor="quotedSubtotal"
                    className="block text-sm font-semibold"
                  >
                    Quoted Subtotal
                  </label>

                  <input
                    id="quotedSubtotal"
                    name="quotedSubtotal"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={
                      request.quotedSubtotal ??
                      suggestedSubtotal
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
                  />

                  <p className="mt-2 text-xs leading-5 text-foreground/50">
                    Tax and final total
                    are calculated by the
                    server.
                  </p>
                </div>

                {/* Admin notes */}
                <div className="mt-5">
                  <label
                    htmlFor="adminNotes"
                    className="block text-sm font-semibold"
                  >
                    Internal Notes
                  </label>

                  <textarea
                    id="adminNotes"
                    name="adminNotes"
                    rows={4}
                    defaultValue={
                      request.adminNotes ??
                      ""
                    }
                    placeholder="Pricing adjustments, substitutions, setup details, etc."
                    className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  {request.quotedTotal !==
                  undefined
                    ? "Update Quote"
                    : "Save Quote"}
                </button>
              </form>
            </>
          )}

          {/* ===================================================
              CURRENT QUOTE
              
              We display this for reviewing AND approved requests.
          =================================================== */}
          {request.quotedSubtotal !==
            undefined &&
            request.taxRate !==
              undefined &&
            request.tax !==
              undefined &&
            request.quotedTotal !==
              undefined && (
              <div className="mt-6 rounded-xl bg-background p-4">
                <p className="text-sm font-semibold text-foreground/50">
                  Current Quote
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      $
                      {request.quotedSubtotal.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>
                      Tax (
                      {(
                        request.taxRate *
                        100
                      ).toFixed(0)}
                      %)
                    </span>

                    <span>
                      $
                      {request.tax.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-black/10 pt-3 text-base font-bold">
                    <span>
                      Total
                    </span>

                    <span>
                      $
                      {request.quotedTotal.toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

          {/* ===================================================
              REVIEWING — DECISION
          =================================================== */}
          {request.status ===
            "reviewing" && (
            <div className="mt-6 border-t border-black/10 pt-6">
              <h3 className="font-bold text-foreground">
                Decision
              </h3>

              {request.quotedTotal !==
              undefined ? (
                <>
                  {/* Approve */}
                  <form
                    action={
                      approveCateringRequest
                    }
                    className="mt-4"
                  >
                    <input
                      type="hidden"
                      name="requestId"
                      value={request.id}
                    />

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-secondary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                    >
                      Approve Request
                    </button>
                  </form>

                  <p className="mt-2 text-center text-xs leading-5 text-foreground/50">
                    Approval will create
                    a catering order for
                    $
                    {request.quotedTotal.toFixed(
                      2
                    )}
                    .
                  </p>
                </>
              ) : (
                <div className="mt-4 rounded-xl bg-background p-4">
                  <p className="text-sm leading-6 text-foreground/60">
                    Save an official
                    quote before
                    approving this
                    request.
                  </p>
                </div>
              )}

              {/* Reject */}
              <form
                action={
                  rejectCateringRequest
                }
                className="mt-4"
              >
                <input
                  type="hidden"
                  name="requestId"
                  value={request.id}
                />

                <button
                  type="submit"
                  className="w-full rounded-xl border border-accent px-5 py-3 font-semibold text-accent transition hover:bg-accent/5"
                >
                  Reject Request
                </button>
              </form>
            </div>
          )}

          {/* ===================================================
              APPROVED
          =================================================== */}
          {request.status ===
            "approved" && (
            <div className="mt-6 rounded-xl border border-secondary/20 bg-secondary/10 p-4">
              <p className="font-semibold text-foreground">
                Request Approved
              </p>

              {request.order ? (
                <>
                  <p className="mt-2 text-sm leading-6 text-foreground/60">
                    A catering order has
                    been created and is
                    waiting for payment.
                  </p>

                  <Link
                    href={`/admin/orders/${request.order}`}
                    className="mt-4 inline-block font-semibold text-primary hover:underline"
                  >
                    View Order →
                  </Link>

                  {!request.customer &&
                    request.order &&
                    guestPaymentToken && (
                      <div className="mt-5 border-t border-secondary/20 pt-5">
                        <p className="text-sm font-semibold text-foreground">
                          Guest Payment Link
                        </p>

                        <p className="mt-2 text-xs leading-5 text-foreground/60">
                          This customer checked out as a
                          guest. Send them this secure link
                          so they can pay their approved
                          catering order.
                        </p>

                        <div className="mt-3 break-all rounded-xl bg-white/70 p-3 font-mono text-xs">
                          {`/catering/pay/${request.order}?token=${guestPaymentToken}`}
                        </div>
                      </div>
                    )}
                </>
              ) : (
                <p className="mt-2 text-sm leading-6 text-accent">
                  This request is marked
                  approved, but no linked
                  order was found.
                </p>
              )}
            </div>
          )}

          {/* ===================================================
              REJECTED
          =================================================== */}
          {request.status ===
            "rejected" && (
            <div className="mt-6 rounded-xl border border-accent/20 bg-accent/10 p-4">
              <p className="font-semibold text-foreground">
                Request Rejected
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground/60">
                No order was created for
                this catering request.
              </p>
            </div>
          )}

          {/* ===================================================
              CANCELLED
          =================================================== */}
          {request.status ===
            "cancelled" && (
            <div className="mt-6 rounded-xl bg-background p-4">
              <p className="font-semibold text-foreground">
                Request Cancelled
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground/60">
                This catering request
                has been cancelled.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

/* =========================================================
   PRICING HELPERS
========================================================= */

function calculateRequestEstimate(
  request: AdminCateringRequest
) {
  if (
    request.selectionType ===
      "package" &&
    request.package
  ) {
    if (
      request.package.pricingType ===
      "per_person"
    ) {
      return (
        request.package.price *
        request.guestCount
      );
    }

    return request.package.price;
  }

  return request.customItems.reduce(
    (total, item) => {
      return (
        total +
        calculateItemEstimate(
          item.price,
          item.pricingType,
          item.quantity,
          request.guestCount
        )
      );
    },
    0
  );
}

function calculateItemEstimate(
  price: number,
  pricingType:
    | "flat"
    | "per_person",
  quantity: number,
  guestCount: number
) {
  if (
    pricingType ===
    "per_person"
  ) {
    return (
      price *
      guestCount *
      quantity
    );
  }

  return price * quantity;
}

/* =========================================================
   DATE HELPERS
========================================================= */

/**
 * Event dates are stored as a date-only value at UTC midnight.
 *
 * For example:
 * 2026-08-30T00:00:00.000Z
 *
 * We explicitly format in UTC so a server running in Toronto
 * does not accidentally display August 29.
 */
function formatEventDate(
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
  ).format(new Date(date));
}

/**
 * createdAt is a real timestamp, so displaying it in the
 * business timezone is appropriate.
 */
function formatSubmittedDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone:
        "America/Toronto",
    }
  ).format(new Date(date));
}