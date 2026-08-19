"use server";

import { Types } from "mongoose";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

import Order from "@/models/Order";
import CateringRequest from "@/models/CateringRequest";

export async function prepareCateringPayment(
  formData: FormData
) {
  /*
   * --------------------------------------------------
   * 1. Require authentication
   * --------------------------------------------------
   */

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  /*
   * --------------------------------------------------
   * 2. Validate Order ID
   * --------------------------------------------------
   */

  const orderId =
    formData.get("orderId");

  if (
    typeof orderId !== "string" ||
    !Types.ObjectId.isValid(orderId)
  ) {
    throw new Error(
      "Invalid catering order."
    );
  }

  await connectToDatabase();

  /*
   * --------------------------------------------------
   * 3. SECURITY:
   *
   * Load the Order only if:
   *
   * - it exists
   * - it belongs to this customer
   * - it is a catering Order
   *
   * This prevents another logged-in customer
   * from paying/viewing an arbitrary Order ID.
   * --------------------------------------------------
   */

  const order =
    await Order.findOne({
      _id: orderId,

      customer:
        session.user.id,

      orderType:
        "catering",
    });

  if (!order) {
    throw new Error(
      "Catering order not found."
    );
  }

  /*
   * --------------------------------------------------
   * 4. Already paid?
   * --------------------------------------------------
   */

  if (
    order.paymentStatus === "paid"
  ) {
    redirect(
      `/account/orders/${orderId}`
    );
  }

  /*
   * A cancelled Order should not suddenly
   * become payable.
   */
  if (
    order.orderStatus ===
    "cancelled"
  ) {
    throw new Error(
      "This catering order has been cancelled."
    );
  }

  /*
   * --------------------------------------------------
   * 5. Verify catering relationship
   * --------------------------------------------------
   */

  if (
    !order.catering?.requestId
  ) {
    throw new Error(
      "Catering request information is missing."
    );
  }

  /*
   * Do not trust the Order alone.
   *
   * Confirm that:
   *
   * CateringRequest
   *      ↓
   * status = approved
   *      ↓
   * points back to THIS Order
   */
  const cateringRequest =
    await CateringRequest.findOne({
      _id:
        order.catering.requestId,

      status:
        "approved",

      order:
        order._id,
    });

  if (!cateringRequest) {
    throw new Error(
      "This catering request is not approved for payment."
    );
  }

  /*
   * --------------------------------------------------
   * 6. Validate financial snapshot
   * --------------------------------------------------
   */

  if (
    !Number.isFinite(order.total) ||
    order.total <= 0
  ) {
    throw new Error(
      "This catering order has an invalid total."
    );
  }

  /*
   * --------------------------------------------------
   * 7. Reuse existing PaymentIntent
   * --------------------------------------------------
   */

  if (
    order.stripePaymentIntentId
  ) {
    const existingPaymentIntent =
      await stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId
      );

    /*
     * Stripe may already know the payment
     * succeeded before our webhook finishes
     * updating MongoDB.
     *
     * Do not create another PaymentIntent.
     */
    if (
      existingPaymentIntent.status ===
      "succeeded"
    ) {
      redirect(
        `/account/orders/${orderId}`
      );
    }

    /*
     * Existing unpaid PaymentIntent:
     * reuse it.
     */
    redirect(
      `/account/orders/${orderId}/payment`
    );
  }

  /*
   * --------------------------------------------------
   * 8. Create Stripe PaymentIntent
   * --------------------------------------------------
   */

  const paymentIntent =
    await stripe.paymentIntents.create(
      {
        /*
         * Stripe uses cents.
         *
         * $1130.00 CAD
         * →
         * 113000
         */
        amount:
          Math.round(
            order.total * 100
          ),

        currency:
          "cad",

        receipt_email:
          order.email,

        metadata: {
          orderId:
            order._id.toString(),

          orderType:
            "catering",

          cateringRequestId:
            cateringRequest._id.toString(),
        },

        automatic_payment_methods: {
          enabled: true,
        },
      },

      /*
       * Prevent accidental duplicate Intent
       * creation for this catering Order.
       */
      {
        idempotencyKey:
          `catering-order-${order._id.toString()}`,
      }
    );

  /*
   * --------------------------------------------------
   * 9. Save Stripe ID
   * --------------------------------------------------
   */

  order.stripePaymentIntentId =
    paymentIntent.id;

  await order.save();

  /*
   * --------------------------------------------------
   * 10. Continue to payment page
   * --------------------------------------------------
   */

  redirect(
    `/account/orders/${orderId}/payment`
  );
}