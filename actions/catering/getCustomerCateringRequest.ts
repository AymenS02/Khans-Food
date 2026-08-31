"use server";

import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringRequest from "@/models/CateringRequest";

export type CustomerCateringRequestDetailStatus =
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "cancelled";

export interface CustomerCateringRequestDetail {
  id: string;

  status:
    CustomerCateringRequestDetailStatus;

  eventDate: string;

  guestCount: number;

  adminNotes?: string;

  orderId?: string;

  createdAt: string;
  updatedAt: string;
}

export async function getCustomerCateringRequest(
  requestId: string
): Promise<CustomerCateringRequestDetail | null> {
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
    return null;
  }

  /*
   * ==========================================
   * 2. VALIDATE REQUEST ID
   * ==========================================
   */

  if (
    !Types.ObjectId.isValid(
      requestId
    )
  ) {
    return null;
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 3. OWNERSHIP CHECK
   * ==========================================
   *
   * We perform ownership enforcement
   * directly in the MongoDB query.
   *
   * This is better than:
   *
   * findById()
   * ↓
   * then check owner
   *
   * because an unauthorized request is
   * never returned from MongoDB at all.
   */

  const request =
    await CateringRequest.findOne({
      _id:
        requestId,

      customer:
        session.user.id,
    }).lean();

  if (!request) {
    return null;
  }

  /*
   * ==========================================
   * 4. DTO
   * ==========================================
   */

  return {
    id:
      request._id.toString(),

    status:
      request.status,

    eventDate:
      request.eventDate.toISOString(),

    guestCount:
      request.guestCount,

    adminNotes:
      request.adminNotes,

    orderId:
      request.order
        ? request.order.toString()
        : undefined,

    createdAt:
      request.createdAt.toISOString(),

    updatedAt:
      request.updatedAt.toISOString(),
  };
}