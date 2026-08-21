"use server";

import { Types } from "mongoose";
import {
  notFound,
  redirect,
} from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import { verifyCateringPaymentAccessToken } from "@/lib/orderAccessToken";

import Order from "@/models/Order";
import CateringRequest from "@/models/CateringRequest";

export type GuestCateringCompletionStatus =
  | "paid"
  | "finalizing"
  | "processing"
  | "retry"
  | "failed"
  | "refunded";

export interface GuestCateringCompletionData {
  orderId: string;

  status:
    GuestCateringCompletionStatus;

  total: number;

  eventDate: string;
  guestCount: number;
}

export async function getGuestCateringPaymentCompletion(
  orderId: string,
  accessToken: string
): Promise<GuestCateringCompletionData> {
  if (
    !Types.ObjectId.isValid(
      orderId
    ) ||
    !accessToken
  ) {
    notFound();
  }

  await connectToDatabase();

  /*
   * Guest catering order only.
   */
  const order =
    await Order.findOne({
      _id: orderId,
      orderType: "catering",
    });

  if (!order) {
    notFound();
  }

  /*
   * Registered customers must not use
   * the guest payment route.
   */
  if (order.customer) {
    notFound();
  }

  if (
    !order.catering?.requestId ||
    !order.catering.eventDate
  ) {
    notFound();
  }

  const cateringRequestId =
    order.catering.requestId.toString();

  /*
   * Verify guest capability token.
   */
  const validToken =
    verifyCateringPaymentAccessToken(
      order._id.toString(),
      cateringRequestId,
      accessToken
    );

  if (!validToken) {
    notFound();
  }

  /*
   * Verify Request ↔ Order relationship.
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

  if (
    !cateringRequest ||
    cateringRequest.customer
  ) {
    notFound();
  }

  /*
   * MongoDB already confirms payment.
   *
   * This means the webhook completed.
   */
  if (
    order.paymentStatus ===
    "paid"
  ) {
    return createResult(
      order,
      "paid"
    );
  }

  if (
    order.paymentStatus ===
    "refunded"
  ) {
    return createResult(
      order,
      "refunded"
    );
  }

  /*
   * There should already be a PaymentIntent
   * because the guest visited /catering/pay/[id].
   */
  if (
    !order.stripePaymentIntentId
  ) {
    redirect(
      `/catering/pay/${orderId}?token=${encodeURIComponent(
        accessToken
      )}`
    );
  }

  const paymentIntent =
    await stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );

  /*
   * Verify Stripe ↔ Order relationship.
   */
  if (
    paymentIntent.metadata.orderId !==
    order._id.toString()
  ) {
    throw new Error(
      "PaymentIntent order mismatch."
    );
  }

  if (
    paymentIntent.metadata
      .cateringRequestId !==
    cateringRequestId
  ) {
    throw new Error(
      "PaymentIntent catering request mismatch."
    );
  }

  const expectedAmount =
    Math.round(
      order.total * 100
    );

  if (
    paymentIntent.amount !==
    expectedAmount
  ) {
    throw new Error(
      "PaymentIntent amount mismatch."
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

  let status:
    GuestCateringCompletionStatus;

  switch (
    paymentIntent.status
  ) {
    /*
     * Stripe finished, but webhook may
     * not have updated MongoDB yet.
     */
    case "succeeded":
      status =
        "finalizing";
      break;

    case "processing":
      status =
        "processing";
      break;

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

  return createResult(
    order,
    status
  );
}

function createResult(
  order: {
    _id: Types.ObjectId;

    total: number;

    catering?: {
      eventDate: Date;
      guestCount: number;
    };
  },

  status:
    GuestCateringCompletionStatus
): GuestCateringCompletionData {
  if (
    !order.catering?.eventDate
  ) {
    throw new Error(
      "Catering event information is missing."
    );
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