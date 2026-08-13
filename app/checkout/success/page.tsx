import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClearCart from "@/features/checkout/components/ClearCart";

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  await connectToDatabase();

  const order = await Order.findById(orderId).lean();

  if (!order) {
    notFound();
  }

  return (
    <>
    <ClearCart />
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl bg-white p-10 shadow">
        <h1 className="text-4xl font-bold text-green-600">
          Payment Successful!
        </h1>

        <p className="mt-4 text-lg">
          Thank you for your order.
        </p>

        <div className="mt-8 space-y-2">
          <p>
            <strong>Order ID:</strong>{" "}
            {order._id.toString()}
          </p>

          <p>
            <strong>Name:</strong>{" "}
            {order.firstName} {order.lastName}
          </p>

          <p>
            <strong>Pickup Date:</strong>{" "}
            {order.orderType === "regular" &&
              order.pickupDate &&
              order.pickupTime ? (
                <div>
                  <p className="text-sm text-foreground/50">
                    Pickup
                  </p>

                  <p className="mt-1 font-semibold">
                    {new Date(
                      order.pickupDate
                    ).toLocaleDateString()}
                    {" at "}
                    {order.pickupTime}
                  </p>
                </div>
              ) : order.orderType === "catering" &&
                order.catering?.eventDate ? (
                <div>
                  <p className="text-sm text-foreground/50">
                    Event Date
                  </p>

                  <p className="mt-1 font-semibold">
                    {new Date(
                      order.catering.eventDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              ) : null}
          </p>

          <p>
            <strong>Pickup Time:</strong>{" "}
            {order.pickupTime}
          </p>

          <p>
            <strong>Total:</strong> $
            {order.total.toFixed(2)}
          </p>

          <p>
            <strong>Payment Status:</strong>{" "}
            {order.paymentStatus}
          </p>

          <p>
            <strong>Order Status:</strong>{" "}
            {order.orderStatus}
          </p>
        </div>
        
        {order.paymentStatus === "paid" && <ClearCart />}

        <Link
          href="/"
          className="mt-10 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
        >
          Back to Home
        </Link>
      </div>
    </main>
    </>
  );
}