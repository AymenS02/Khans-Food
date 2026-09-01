import Link from "next/link";

import { getAdminCateringRequests } from "@/actions/catering/getAdminCateringRequests";

export default async function AdminCateringPage() {
  const requests =
    await getAdminCateringRequests();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-bold text-foreground">
          Catering Requests
        </h1>

        <p className="mt-3 text-foreground/60">
          Review package and custom
          catering requests.
        </p>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            No catering requests
          </h2>

          <p className="mt-2 text-foreground/60">
            New catering requests will
            appear here.
          </p>
        </div>
      ) : (
        <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="border-b border-black/10 bg-background">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Request
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Event
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Guests
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10">
                {requests.map(
                  (request) => (
                    <tr
                      key={
                        request.id
                      }
                    >
                      {/* Customer */}
                      <td className="px-5 py-5">
                        <p className="font-semibold">
                          {
                            request.firstName
                          }{" "}
                          {
                            request.lastName
                          }
                        </p>

                        <p className="mt-1 break-all text-sm text-foreground/50">
                          {
                            request.email
                          }
                        </p>

                        <p className="mt-1 text-xs text-foreground/40">
                          {request.customer
                            ? "Registered customer"
                            : "Guest"}
                        </p>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-5">
                        <p className="font-semibold capitalize">
                          {
                            request.selectionType
                          }
                        </p>

                        {request.selectionType ===
                          "package" &&
                          request.package && (
                            <p className="mt-1 text-sm text-foreground/50">
                              {
                                request
                                  .package
                                  .name
                              }
                            </p>
                          )}

                        {request.selectionType ===
                          "custom" && (
                          <p className="mt-1 text-sm text-foreground/50">
                            {
                              request
                                .customItems
                                .length
                            }{" "}
                            selected{" "}
                            {request
                              .customItems
                              .length ===
                            1
                              ? "item"
                              : "items"}
                          </p>
                        )}
                      </td>

                      {/* Event */}
                      <td className="px-5 py-5">
                        <p className="font-medium">
                          {new Date(
                            request.eventDate
                          ).toLocaleDateString()}
                        </p>

                        <p className="mt-1 text-xs text-foreground/50">
                          Submitted{" "}
                          {new Date(
                            request.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Guests */}
                      <td className="px-5 py-5">
                        <p className="font-semibold">
                          {
                            request.guestCount
                          }
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusClassName(request.status)}`}>
                          {
                            request.status
                          }
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-5">
                        <Link
                          href={`/admin/catering/${request.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

function statusClassName(status: string) {
  if (status === "approved") {
    return "bg-secondary/10 text-foreground";
  }

  if (status === "rejected" || status === "cancelled") {
    return "bg-accent/10 text-accent";
  }

  return "bg-background text-foreground/75";
}