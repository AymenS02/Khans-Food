"use server";

import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

import { verifyCateringPaymentAccessToken } from "@/lib/orderAccessToken";

import Order from "@/models/Order";
import CateringRequest from "@/models/CateringRequest";

export type GuestCateringPaymentStatus =
  | "ready"
  | "paid"
  | "finalizing"
  | "processing"
  | "failed"
  | "refunded";

export interface GuestCateringPaymentData {
  orderId: string;

  status:
    GuestCateringPaymentStatus;

  clientSecret?: string;

  total: number;

  eventDate: string;
  guestCount: number;
}

export async function getGuestCateringPayment(
  orderId: string,
  accessToken: string
): Promise<GuestCateringPaymentData> {
  /*
   * --------------------------------------------------
   * 1. Validate basic input
   * --------------------------------------------------
   */

  if (
    !Types.ObjectId.isValid(
      orderId
    ) ||
    typeof accessToken !==
      "string" ||
    !accessToken
  ) {
    notFound();
  }

  await connectToDatabase();

  /*
   * --------------------------------------------------
   * 2. Load catering Order
   * --------------------------------------------------
   */

  const order =
    await Order.findOne({
      _id: orderId,

      orderType:
        "catering",
    });

  if (!order) {
    notFound();
  }

  /*
   * --------------------------------------------------
   * 3. This route is ONLY for guests
   *
   * Registered customers must use:
   *
   * /account/orders/[id]/payment
   * --------------------------------------------------
   */

  if (order.customer) {
    notFound();
  }

  /*
   * --------------------------------------------------
   * 4. Catering relationship must exist
   * --------------------------------------------------
   */

  if (
    !order.catering?.requestId ||
    !order.catering.eventDate
  ) {
    notFound();
  }

  const cateringRequestId =
    order.catering.requestId.toString();

  /*
   * --------------------------------------------------
   * 5. VERIFY THE CAPABILITY TOKEN
   *
   * Knowing the Order ID alone is NOT enough.
   * --------------------------------------------------
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
   * --------------------------------------------------
   * 6. Verify the CateringRequest itself
   * --------------------------------------------------
   */

  const cateringRequest =
    await CateringRequest.findOne({
      _id:
        order.catering.requestId,

      order:
        order._id,

      status:
        "approved",
    });

  if (!cateringRequest) {
    throw new Error(
      "This catering request is not approved for payment."
    );
  }

  /*
   * It should also be a guest request.
   */
  if (cateringRequest.customer) {
    notFound();
  }

  /*
   * --------------------------------------------------
   * 7. Cancelled orders cannot be paid
   * --------------------------------------------------
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
   * 8. Validate Order amount
   * --------------------------------------------------
   */

  if (
    !Number.isFinite(
      order.total
    ) ||
    order.total <= 0
  ) {
    throw new Error(
      "This catering order has an invalid total."
    );
  }

  /*
   * --------------------------------------------------
   * 9. MongoDB already confirms payment
   * --------------------------------------------------
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
   * --------------------------------------------------
   * 10. Reuse existing PaymentIntent
   * --------------------------------------------------
   */

  if (
    order.stripePaymentIntentId
  ) {
    const paymentIntent =
      await stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId
      );

    verifyPaymentIntent(
      paymentIntent,
      order._id.toString(),
      cateringRequestId,
      order.total
    );

    /*
     * Stripe succeeded, but perhaps our webhook
     * hasn't updated MongoDB yet.
     */
    if (
      paymentIntent.status ===
      "succeeded"
    ) {
      return createResult(
        order,
        "finalizing"
      );
    }

    if (
      paymentIntent.status ===
      "processing"
    ) {
      return createResult(
        order,
        "processing"
      );
    }

    if (
      paymentIntent.status ===
      "canceled"
    ) {
      return createResult(
        order,
        "failed"
      );
    }

    if (
      !paymentIntent.client_secret
    ) {
      throw new Error(
        "PaymentIntent is missing a client secret."
      );
    }

    return {
      ...createResult(
        order,
        "ready"
      ),

      clientSecret:
        paymentIntent.client_secret,
    };
  }

  /*
   * --------------------------------------------------
   * 11. Create the PaymentIntent
   * --------------------------------------------------
   */

  const paymentIntent =
    await stripe.paymentIntents.create(
      {
        amount:
          Math.round(
            order.total *
              100
          ),

        currency:
          "cad",

        receipt_email:
          order.email,

        /*
         * IDs only.
         *
         * Do not put personal customer
         * information into Stripe metadata.
         */
        metadata: {
          orderId:
            order._id.toString(),

          orderType:
            "catering",

          cateringRequestId,
        },

        automatic_payment_methods: {
          enabled: true,
        },
      },

      /*
       * One PaymentIntent per catering Order.
       */
      {
        idempotencyKey:
          `catering-order-${order._id.toString()}`,
      }
    );

  if (
    !paymentIntent.client_secret
  ) {
    throw new Error(
      "PaymentIntent is missing a client secret."
    );
  }

  /*
   * Save Stripe ID so refreshing the page
   * reuses this PaymentIntent.
   */
  order.stripePaymentIntentId =
    paymentIntent.id;

  await order.save();

  return {
    ...createResult(
      order,
      "ready"
    ),

    clientSecret:
      paymentIntent.client_secret,
  };
}

/*
 * ==================================================
 * HELPERS
 * ==================================================
 */

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
    GuestCateringPaymentStatus
): GuestCateringPaymentData {
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

function verifyPaymentIntent(
  paymentIntent: {
    amount: number;
    currency: string;

    metadata: {
      [key: string]:
        string;
    };
  },

  orderId: string,
  cateringRequestId: string,
  orderTotal: number
) {
  if (
    paymentIntent.metadata
      .orderId !==
    orderId
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
      orderTotal *
        100
    );

  if (
    paymentIntent.amount !==
    expectedAmount
  ) {
    throw new Error(
      "PaymentIntent amount does not match the catering order."
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
}