"use server";

import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringRequest from "@/models/CateringRequest";

export type CustomerCateringRequestStatus =
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "cancelled";

export interface CustomerCateringRequestListItem {
  id: string;

  status:
    CustomerCateringRequestStatus;

  selection:
    | "package"
    | "custom";

  eventDate: string;

  guestCount: number;

  orderId?: string;

  createdAt: string;
}

export async function getCustomerCateringRequests(): Promise<
  CustomerCateringRequestListItem[]
> {
  /*
   * ==========================================
   * 1. AUTHENTICATION
   * ==========================================
   */

  const session =
    await auth();

  if (
    !session?.user?.id ||
    !Types.ObjectId.isValid(
      session.user.id
    )
  ) {
    throw new Error(
      "Unauthorized."
    );
  }

  /*
   * ==========================================
   * 2. DATABASE
   * ==========================================
   */

  await connectToDatabase();

  /*
   * Only return requests owned by the
   * currently authenticated customer.
   *
   * Never accept a customer ID from the
   * browser for this query.
   */

  const requests =
    await CateringRequest.find({
      customer:
        session.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

  /*
   * ==========================================
   * 3. PUBLIC DTO
   * ==========================================
   */

  return requests.map(
    (request) => ({
      id:
        request._id.toString(),

      status:
        request.status,

      selection:
        request.package
          ? "package"
          : "custom",

      eventDate:
        request.eventDate.toISOString(),

      guestCount:
        request.guestCount,

      orderId:
        request.order
          ? request.order.toString()
          : undefined,

      createdAt:
        request.createdAt.toISOString(),
    })
  );
}