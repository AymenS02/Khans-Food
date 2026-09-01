import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";

import Order from "@/models/Order";

import { sendRegularOrderConfirmationEmail } from "@/features/email/services/sendRegularOrderConfirmationEmail";

import { sendCateringPaymentConfirmationEmail } from "@/features/email/services/sendCateringPaymentConfirmationEmail";

export async function sendPaidOrderConfirmationEmail(
  orderId: string
) {
  if (
    !Types.ObjectId.isValid(
      orderId
    )
  ) {
    throw new Error(
      "Invalid order ID."
    );
  }

  await connectToDatabase();

  const order =
    await Order.findById(
      orderId
    )
      .select(
        "orderType paymentStatus"
      )
      .lean();

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  /*
   * Never send a final confirmation
   * before Stripe payment is authoritative.
   */
  if (
    order.paymentStatus !==
    "paid"
  ) {
    throw new Error(
      "Cannot send confirmation for an unpaid order."
    );
  }

  if (
    order.orderType ===
    "regular"
  ) {
    await sendRegularOrderConfirmationEmail(
      orderId
    );

    return;
  }

  if (
    order.orderType ===
    "catering"
  ) {
    await sendCateringPaymentConfirmationEmail(
      orderId
    );

    return;
  }

  throw new Error(
    `Unsupported order type: ${order.orderType}`
  );
}