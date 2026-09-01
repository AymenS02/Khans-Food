import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { verifyOrderAccessToken } from "@/lib/orderAccessToken";

import Order from "@/models/Order";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  /*
   * ==========================================
   * 1. READ ROUTE PARAMS
   * ==========================================
   */

  const { id } =
    await context.params;

  const url =
    new URL(request.url);

  const token =
    url.searchParams.get(
      "token"
    );

  /*
   * ==========================================
   * 2. BASIC ACCESS VALIDATION
   * ==========================================
   *
   * Return the same response we use for
   * unauthorized/nonexistent orders.
   *
   * We don't need to tell a caller whether
   * the ID format or token was specifically
   * incorrect.
   */

  if (
    !Types.ObjectId.isValid(
      id
    ) ||
    !token
  ) {
    return orderNotFoundResponse();
  }

  /*
   * ==========================================
   * 3. DATABASE
   * ==========================================
   */

  await connectToDatabase();

  /*
   * ==========================================
   * 4. LOAD ONLY REQUIRED FIELDS
   * ==========================================
   *
   * Do not return or even load unnecessary
   * customer/payment information.
   */

  const order =
    await Order.findById(
      id
    )
      .select({
        orderType:
          1,

        checkoutAttemptId:
          1,

        paymentStatus:
          1,

        orderStatus:
          1,
      })
      .lean();

  /*
   * ==========================================
   * 5. VERIFY THIS IS A REGULAR ORDER
   * ==========================================
   */

  if (
    !order ||
    order.orderType !==
      "regular" ||
    !order.checkoutAttemptId
  ) {
    return orderNotFoundResponse();
  }

  /*
   * ==========================================
   * 6. VERIFY HMAC ACCESS TOKEN
   * ==========================================
   *
   * Knowing the MongoDB order ID alone is
   * NOT sufficient to access order state.
   */

  const validToken =
    verifyOrderAccessToken(
      order._id.toString(),
      order.checkoutAttemptId,
      token
    );

  if (!validToken) {
    return orderNotFoundResponse();
  }

  /*
   * ==========================================
   * 7. RETURN SAFE STATUS DTO
   * ==========================================
   *
   * This is intentionally NOT the complete
   * Order document.
   */

  return NextResponse.json(
    {
      paymentStatus:
        order.paymentStatus,

      orderStatus:
        order.orderStatus,
    },
    {
      headers: {
        /*
         * Payment state changes asynchronously
         * after Stripe webhooks arrive.
         *
         * Never allow an intermediary/browser
         * cache to serve an old status.
         */
        "Cache-Control":
          "no-store, max-age=0",
      },
    }
  );
}

/*
 * ============================================
 * GENERIC NOT-FOUND RESPONSE
 * ============================================
 *
 * Use the same response for:
 *
 * - malformed ID
 * - missing token
 * - nonexistent order
 * - wrong order type
 * - invalid token
 *
 * This reveals as little as possible about
 * which orders exist.
 */

function orderNotFoundResponse() {
  return NextResponse.json(
    {
      error:
        "Order not found.",
    },
    {
      status:
        404,

      headers: {
        "Cache-Control":
          "no-store, max-age=0",
      },
    }
  );
}