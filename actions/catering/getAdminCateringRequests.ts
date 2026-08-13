"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringRequest from "@/models/CateringRequest";

import type { AdminCateringRequest } from "@/features/catering/types/adminCatering";

export async function getAdminCateringRequests(): Promise<
  AdminCateringRequest[]
> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (
    session.user.role !== "admin"
  ) {
    redirect("/");
  }

  await connectToDatabase();

  const requests =
    await CateringRequest.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

  return requests.map(
    (request) => ({
      id:
        request._id.toString(),

      customer:
        request.customer?.toString(),

      firstName:
        request.firstName,

      lastName:
        request.lastName,

      email:
        request.email,

      phone:
        request.phone,

      eventDate:
        request.eventDate.toISOString(),

      guestCount:
        request.guestCount,

      selectionType:
        request.selectionType,

      package:
        request.package?.packageId
          ? {
              name:
                request.package
                  .name ?? "",

              price:
                request.package
                  .price ?? 0,

              pricingType:
                request.package
                  .pricingType ??
                "flat",
            }
          : undefined,

      customItems:
        request.customItems.map(
          (item) => ({
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

      notes:
        request.notes,

      adminNotes:
        request.adminNotes,

      status:
        request.status,

      quotedSubtotal:
        request.quotedSubtotal,

      taxRate:
        request.taxRate,

      tax:
        request.tax,

      quotedTotal:
        request.quotedTotal,

      order:
        request.order?.toString(),

      createdAt:
        request.createdAt.toISOString(),
    })
  );
}