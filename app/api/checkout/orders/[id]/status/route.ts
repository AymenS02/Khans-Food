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
  const { id } =
    await context.params;

  const url =
    new URL(request.url);

  const token =
    url.searchParams.get("token");

  if (
    !Types.ObjectId.isValid(id) ||
    !token
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid order access.",
      },
      {
        status: 400,
      }
    );
  }

  await connectToDatabase();

  const order =
    await Order.findById(id)
      .select({
        orderType: 1,
        checkoutAttemptId: 1,
        paymentStatus: 1,
        orderStatus: 1,
      })
      .lean();

  if (
    !order ||
    order.orderType !==
      "regular" ||
    !order.checkoutAttemptId
  ) {
    return NextResponse.json(
      {
        error:
          "Order not found.",
      },
      {
        status: 404,
      }
    );
  }

  const validToken =
    verifyOrderAccessToken(
      order._id.toString(),
      order.checkoutAttemptId,
      token
    );

  if (!validToken) {
    return NextResponse.json(
      {
        error:
          "Order not found.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    paymentStatus:
      order.paymentStatus,

    orderStatus:
      order.orderStatus,
  });
}