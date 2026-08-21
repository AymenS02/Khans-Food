import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { verifyCateringPaymentAccessToken } from "@/lib/orderAccessToken";

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
    url.searchParams.get(
      "token"
    );

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
    await Order.findOne({
      _id: id,

      orderType:
        "catering",

      /*
       * Guest orders must not have
       * an attached customer.
       */
      customer: {
        $exists: false,
      },
    })
      .select({
        paymentStatus: 1,
        orderStatus: 1,
        catering: 1,
      })
      .lean();

  if (
    !order ||
    !order.catering?.requestId
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
    verifyCateringPaymentAccessToken(
      order._id.toString(),

      order.catering.requestId.toString(),

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