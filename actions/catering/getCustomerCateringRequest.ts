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

  selectionType:
    | "package"
    | "custom";

  eventDate: string;

  guestCount: number;

  notes?: string;

  adminNotes?: string;

  package?: {
    packageId: string;

    name: string;

    price: number;

    pricingType:
      | "flat"
      | "per_person";
  };

  customItems: {
    cateringItem: string;

    name: string;

    price: number;

    pricingType:
      | "flat"
      | "per_person";

    quantity: number;
  }[];

  quotedSubtotal?: number;

  taxRate?: number;

  tax?: number;

  quotedTotal?: number;

  orderId?: string;

  createdAt: string;

  updatedAt: string;
}

export async function getCustomerCateringRequest(
  requestId: string
): Promise<
  CustomerCateringRequestDetail | null
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
   * 3. LOAD OWNED REQUEST
   * ==========================================
   *
   * Ownership is enforced in MongoDB.
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
   * 4. BUILD SAFE CUSTOMER DTO
   * ==========================================
   */

  return {
    id:
      request._id.toString(),

    status:
      request.status,

    selectionType:
      request.selectionType,

    eventDate:
      request.eventDate.toISOString(),

    guestCount:
      request.guestCount,

    notes:
      request.notes,

    adminNotes:
      request.adminNotes,

    package:
      request.package
        ? {
            packageId:
              request.package.packageId.toString(),

            name:
              request.package.name,

            price:
              request.package.price,

            pricingType:
              request.package.pricingType,
          }
        : undefined,

    customItems:
      request.customItems.map(
        (item) => ({
          cateringItem:
            item.cateringItem.toString(),

          name:
            item.name,

          price:
            item.price,

          pricingType:
            item.pricingType,

          quantity:
            item.quantity,
        })
      ),

    quotedSubtotal:
      request.quotedSubtotal,

    taxRate:
      request.taxRate,

    tax:
      request.tax,

    quotedTotal:
      request.quotedTotal,

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