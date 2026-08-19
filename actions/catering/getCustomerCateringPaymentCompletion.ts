"use server";

import { Types } from "mongoose";
import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

import Order from "@/models/Order";

export type CateringPaymentCompletionStatus =
  | "paid"
  | "finalizing"
  | "processing"
  | "retry"
  | "failed"
  | "refunded";

export interface CateringPaymentCompletionData {
  orderId: string;

  status:
    CateringPaymentCompletionStatus;

  total: number;

  eventDate: string;
  guestCount: number;
}

export async function getCustomerCateringPaymentCompletion(
  orderId: string
): Promise<CateringPaymentCompletionData> {
  /*
   * -------------------------------------------
   * 1. Authentication
   * -------------------------------------------
   */

  const session =
    await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  /*
   * -------------------------------------------
   * 2. Validate Order ID
   * -------------------------------------------
   */

  if (
    !Types.ObjectId.isValid(
      orderId
    )
  ) {
    notFound();
  }

  await connectToDatabase();

  /*
   * -------------------------------------------
   * 3. SECURITY
   *
   * The Order must:
   *
   * - exist
   * - belong to this logged-in user
   * - be a catering Order
   * -------------------------------------------
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
    notFound();
  }

  /*
   * -------------------------------------------
   * 4. Catering data must exist
   * -------------------------------------------
   */

  if (
    !order.catering?.eventDate
  ) {
    throw new Error(
      "Catering event information is missing."
    );
  }

  /*
   * -------------------------------------------
   * 5. MongoDB already says PAID
   *
   * This means our Stripe webhook has
   * successfully processed the payment.
   * -------------------------------------------
   */

  if (
    order.paymentStatus ===
    "paid"
  ) {
    return {
      orderId:
        order._id.toString(),

      status:
        "paid",

      total:
        order.total,

      eventDate:
        order.catering.eventDate.toISOString(),

      guestCount:
        order.catering.guestCount,
    };
  }

  /*
   * -------------------------------------------
   * 6. Refunded
   * -------------------------------------------
   */

  if (
    order.paymentStatus ===
    "refunded"
  ) {
    return {
      orderId:
        order._id.toString(),

      status:
        "refunded",

      total:
        order.total,

      eventDate:
        order.catering.eventDate.toISOString(),

      guestCount:
        order.catering.guestCount,
    };
  }

  /*
   * -------------------------------------------
   * 7. PaymentIntent must exist
   * -------------------------------------------
   */

  if (
    !order.stripePaymentIntentId
  ) {
    redirect(
      `/account/orders/${orderId}`
    );
  }

  const paymentIntent =
    await stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );

  /*
   * -------------------------------------------
   * 8. Verify Stripe ↔ Order relationship
   * -------------------------------------------
   */

  if (
    paymentIntent.metadata
      .orderId !==
    order._id.toString()
  ) {
    throw new Error(
      "PaymentIntent order mismatch."
    );
  }

  /*
   * -------------------------------------------
   * 9. Verify amount
   * -------------------------------------------
   */

  const expectedAmount =
    Math.round(
      order.total * 100
    );

  if (
    paymentIntent.amount !==
    expectedAmount
  ) {
    throw new Error(
      "PaymentIntent amount does not match the order."
    );
  }

  if (
    paymentIntent.currency !==
    "cad"
  ) {
    throw new Error(
      "PaymentIntent currency mismatch."
    );
  }

  /*
   * -------------------------------------------
   * 10. Determine UI status
   * -------------------------------------------
   */

  let status:
    CateringPaymentCompletionStatus;

  switch (
    paymentIntent.status
  ) {
    /*
     * Stripe says payment succeeded,
     * but MongoDB hasn't been updated
     * by our webhook yet.
     */
    case "succeeded":
      status =
        "finalizing";
      break;

    /*
     * Certain payment methods may
     * take time to complete.
     */
    case "processing":
      status =
        "processing";
      break;

    /*
     * Customer may need to try payment
     * again.
     */
    case "requires_payment_method":
    case "requires_action":
    case "requires_confirmation":
      status =
        "retry";
      break;

    case "canceled":
      status =
        "failed";
      break;

    default:
      status =
        "processing";
  }

  return {
    orderId:
      order._id.toString(),

    status,

    total:
      order.total,

    eventDate:
      order.catering.eventDate.toISOString(),

    guestCount:
      order.catering.guestCount,
  };
}