import Link from "next/link";

import { getAdminOrders } from "@/actions/orders/getAdminOrders";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-bold text-foreground">
          Orders
        </h1>

        <p className="mt-3 text-foreground/60">
          View and manage customer orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">
            No orders
          </h2>

          <p className="mt-2 text-foreground/60">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-black/10 bg-background">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Pickup
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Total
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold">
                    Order
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-5">
                      <p className="font-semibold">
                        {order.firstName} {order.lastName}
                      </p>

                      <p className="mt-1 text-sm text-foreground/50">
                        {order.email}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      {order.pickupDate ? (
                        <>
                          <p className="font-medium">
                            {new Date(
                              order.pickupDate
                            ).toLocaleDateString()}
                          </p>

                          {order.pickupTime && (
                            <p className="mt-1 text-sm text-foreground/50">
                              {order.pickupTime}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="font-medium">
                          Catering Event
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-5 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}