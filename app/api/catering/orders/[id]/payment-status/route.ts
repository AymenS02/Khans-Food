import {
  NextResponse,
} from "next/server";

import {
  Types,
} from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import Order from "@/models/Order";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const session =
    await auth();

  /*
   * API routes should return a 401
   * rather than redirecting HTML.
   */
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error:
          "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const { id } =
    await context.params;

  if (
    !Types.ObjectId.isValid(
      id
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid order.",
      },
      {
        status: 400,
      }
    );
  }

  await connectToDatabase();

  /*
   * SECURITY:
   *
   * User can only read payment status
   * for their own catering Order.
   */
  const order =
    await Order.findOne({
      _id: id,

      customer:
        session.user.id,

      orderType:
        "catering",
    })
      .select({
        paymentStatus: 1,
      })
      .lean();

  if (!order) {
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
  });
}