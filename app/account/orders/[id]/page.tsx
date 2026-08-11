import Link from "next/link";

import { getCustomerOrderById } from "@/actions/orders/getCustomerOrderById";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;

  const order = await getCustomerOrderById(id);

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href="/account/orders"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to My Orders
      </Link>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-foreground/50">
              Order
            </p>

            <h1 className="mt-1 break-all font-mono text-xl font-bold text-foreground">
              {order.id}
            </h1>

            <p className="mt-2 text-sm text-foreground/60">
              Placed{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
              Order Status: {order.orderStatus}
            </span>

            <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold capitalize">
              Payment Status: {order.paymentStatus}
            </span>
          </div>
        </div>

        <section className="py-6">
          <h2 className="text-xl font-bold text-foreground">
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

        <section className="border-t border-black/10 py-6">
          <h2 className="text-xl font-bold text-foreground">
            Items
          </h2>

          <div className="mt-5 divide-y divide-black/10">
            {order.items.map((item) => (
              <div
                key={item.menuItem}
                className="flex items-start justify-between gap-6 py-4 first:pt-0"
              >
                <div>
                  <p className="font-semibold text-foreground">
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

        <section className="border-t border-black/10 pt-6">
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
    </main>
  );
}