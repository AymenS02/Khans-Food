import Link from "next/link";

import { getAdminOrderById } from "@/actions/orders/getAdminOrderById";
import { updateOrderStatus } from "@/actions/orders/updateOrderStatus";
import { orderStatusTransitions } from "@/features/orders/constants/orderStatusTransitions";

interface AdminOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatStatus(
  status: string
) {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

export default async function AdminOrderPage({
  params,
}: AdminOrderPageProps) {
  const { id } = await params;

  const order = await getAdminOrderById(id);
  
  const nextStatuses = orderStatusTransitions[order.orderStatus];

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <Link
        href="/admin/orders"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Orders
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Order Information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-black/10 pb-6">
            <p className="text-sm text-foreground/50">
              Order
            </p>

            <h1 className="mt-1 break-all font-mono text-xl font-bold">
              {order.id}
            </h1>

            <p className="mt-2 text-sm text-foreground/60">
              Placed{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </p>
          </div>

          {/* Customer */}
          <section className="border-b border-black/10 py-6">
            <h2 className="text-xl font-bold">
              Customer
            </h2>

            <div className="mt-4 space-y-2">
              <p>
                {order.firstName} {order.lastName}
              </p>

              <p>{order.email}</p>

              <p>{order.phone}</p>

              <p className="text-sm text-foreground/50">
                {order.customer
                  ? "Registered customer"
                  : "Guest checkout"}
              </p>
            </div>
          </section>

          {/* Pickup */}
          <section className="border-b border-black/10 py-6">
            <h2 className="text-xl font-bold">
              Pickup
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-foreground/50">
                  Date
                </p>

                <p className="mt-1 font-semibold">
                  {new Date(
                    order.pickupDate
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-foreground/50">
                  Time
                </p>

                <p className="mt-1 font-semibold">
                  {order.pickupTime}
                </p>
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="border-b border-black/10 py-6">
            <h2 className="text-xl font-bold">
              Items
            </h2>

            <div className="mt-5 divide-y divide-black/10">
              {order.items.map((item) => (
                <div
                  key={item.menuItem}
                  className="flex justify-between gap-6 py-4 first:pt-0"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-foreground/60">
                      ${item.price.toFixed(2)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    $
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          {order.notes && (
            <section className="border-b border-black/10 py-6">
              <h2 className="text-xl font-bold">
                Customer Notes
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-foreground/70">
                {order.notes}
              </p>
            </section>
          )}

          {/* Totals */}
          <section className="pt-6">
            <div className="ml-auto max-w-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground/60">
                  Subtotal
                </span>

                <span>
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-foreground/60">
                  Tax ({order.taxRate * 100}%)
                </span>

                <span>
                  ${order.tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-black/10 pt-3 text-lg font-bold">
                <span>Total</span>

                <span>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Admin Controls */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Order Management
          </h2>

          <div className="mt-5">
            <p className="text-sm text-foreground/50">
              Payment Status
            </p>

            <span className="mt-2 inline-block rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
              {order.paymentStatus}
            </span>
          </div>

          {nextStatuses.length > 0 ? (
            <form
              action={updateOrderStatus}
              className="mt-6"
            >
              <input
                type="hidden"
                name="orderId"
                value={order.id}
              />

              <label
                htmlFor="status"
                className="text-sm font-semibold"
              >
                Change Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue=""
                required
                className="mt-2 w-full rounded-xl border border-black/20 bg-white px-4 py-3"
              >
                <option value="" disabled>
                  Select next status
                </option>

                {nextStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white"
              >
                Update Status
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-xl bg-background p-4">
              <p className="text-sm text-foreground/60">
                This order has reached a final status.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}