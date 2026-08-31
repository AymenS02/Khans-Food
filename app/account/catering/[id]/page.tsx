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
      {/* Back */}

      <Link
        href="/account/catering"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Catering Requests
      </Link>

      {/* Header */}

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
            {formatDate(
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

      {/* Request information */}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold">
          Event Information
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
        </div>
      </section>

      {/* Status information */}

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

      {/* Approved order */}

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

      {/* Metadata */}

      <p className="mt-8 text-xs text-foreground/40">
        Last updated{" "}
        {formatDateTime(
          request.updatedAt
        )}
      </p>
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
      minute: "2-digit",
    }
  ).format(
    new Date(value)
  );
}

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
      return "Your catering request is currently being reviewed.";

    case "approved":
      return "Your catering request has been approved. If an order has been created, you can continue to payment below.";

    case "rejected":
      return "This catering request could not be approved. Please review any message from Khans Food below.";

    case "cancelled":
      return "This catering request has been cancelled.";
  }
}