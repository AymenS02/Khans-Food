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
import CateringRequest from "@/models/CateringRequest";

export interface CustomerCateringPaymentData {
  orderId: string;

  clientSecret: string;

  total: number;

  eventDate: string;
  guestCount: number;
}

export async function getCustomerCateringPayment(
  orderId: string
): Promise<CustomerCateringPaymentData> {
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
   * 2. Validate ID
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
   * 3. SECURITY:
   *
   * This Order must:
   *
   * - exist
   * - belong to this customer
   * - be a catering order
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
   * 4. Don't allow payment on cancelled orders
   * -------------------------------------------
   */

  if (
    order.orderStatus ===
    "cancelled"
  ) {
    redirect(
      `/account/orders/${orderId}`
    );
  }

  /*
   * -------------------------------------------
   * 5. Already paid
   * -------------------------------------------
   */

  if (
    order.paymentStatus ===
    "paid"
  ) {
    redirect(
      `/account/orders/${orderId}`
    );
  }

  /*
   * -------------------------------------------
   * 6. Catering metadata must exist
   * -------------------------------------------
   */

  if (
    !order.catering?.requestId ||
    !order.catering.eventDate
  ) {
    throw new Error(
      "Catering order information is missing."
    );
  }

  /*
   * -------------------------------------------
   * 7. Verify approved CateringRequest
   * -------------------------------------------
   */

  const cateringRequest =
    await CateringRequest.findOne({
      _id:
        order.catering.requestId,

      order:
        order._id,

      status:
        "approved",
    }).lean();

  if (!cateringRequest) {
    throw new Error(
      "This catering request is not approved for payment."
    );
  }

  /*
   * -------------------------------------------
   * 8. PaymentIntent must already exist
   *
   * prepareCateringPayment() creates this.
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
   * 9. Stripe already succeeded?
   *
   * The webhook may simply not have updated
   * MongoDB yet.
   * -------------------------------------------
   */

  if (
    paymentIntent.status ===
    "succeeded"
  ) {
    redirect(
      `/account/orders/${orderId}`
    );
  }

  /*
   * -------------------------------------------
   * 10. Verify PaymentIntent belongs to Order
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
   * 11. Verify Stripe amount
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
      "PaymentIntent amount does not match the order total."
    );
  }

  /*
   * We created catering payments in CAD.
   */
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
   * 12. Client secret is required by Elements
   * -------------------------------------------
   */

  if (
    !paymentIntent.client_secret
  ) {
    throw new Error(
      "PaymentIntent is missing a client secret."
    );
  }

  return {
    orderId:
      order._id.toString(),

    clientSecret:
      paymentIntent.client_secret,

    total:
      order.total,

    eventDate:
      order.catering.eventDate.toISOString(),

    guestCount:
      order.catering.guestCount,
  };
}