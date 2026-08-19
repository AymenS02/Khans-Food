"use server";

import { Types } from "mongoose";
import { notFound } from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import { verifyOrderAccessToken } from "@/lib/orderAccessToken";

import Order from "@/models/Order";

export interface CheckoutSuccessOrder {
  id: string;

  firstName: string;
  lastName: string;

  items: {
    menuItem?: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  pickupDate: string;
  pickupTime: string;

  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;

  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  createdAt: string;
}

export async function getCheckoutSuccessOrder(
  orderId: string,
  accessToken: string
): Promise<CheckoutSuccessOrder> {
  /*
   * -----------------------------------------
   * 1. Validate basic input
   * -----------------------------------------
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
   * -----------------------------------------
   * 2. Load the Order
   *
   * IMPORTANT:
   * We do not return or render anything yet.
   * -----------------------------------------
   */

  const order =
    await Order.findById(
      orderId
    ).lean();

  if (!order) {
    notFound();
  }

  /*
   * -----------------------------------------
   * 3. This page is ONLY for normal checkout
   * -----------------------------------------
   */

  if (
    order.orderType !==
    "regular"
  ) {
    notFound();
  }

  /*
   * Every normal checkout Order should have
   * the attempt ID used to generate its
   * success access token.
   */
  if (
    !order.checkoutAttemptId
  ) {
    notFound();
  }

  /*
   * -----------------------------------------
   * 4. VERIFY ACCESS TOKEN
   * -----------------------------------------
   *
   * Knowing an Order ID is NOT sufficient.
   */

  const validToken =
    verifyOrderAccessToken(
      order._id.toString(),

      order.checkoutAttemptId,

      accessToken
    );

  if (!validToken) {
    notFound();
  }

  /*
   * -----------------------------------------
   * 5. Regular checkout requires pickup data
   * -----------------------------------------
   */

  if (
    !order.pickupDate ||
    !order.pickupTime
  ) {
    throw new Error(
      "Regular order is missing pickup information."
    );
  }

  /*
   * -----------------------------------------
   * 6. Return ONLY data the success page needs
   * -----------------------------------------
   */

  return {
    id:
      order._id.toString(),

    firstName:
      order.firstName,

    lastName:
      order.lastName,

    items:
      order.items.map(
        (item) => ({
          menuItem:
            item.menuItem?.toString(),

          name:
            item.name,

          price:
            item.price,

          quantity:
            item.quantity,
        })
      ),

    pickupDate:
      order.pickupDate.toISOString(),

    pickupTime:
      order.pickupTime,

    subtotal:
      order.subtotal,

    taxRate:
      order.taxRate,

    tax:
      order.tax,

    total:
      order.total,

    orderStatus:
      order.orderStatus,

    paymentStatus:
      order.paymentStatus,

    createdAt:
      order.createdAt.toISOString(),
  };
}