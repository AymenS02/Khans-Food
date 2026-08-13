"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringRequest from "@/models/CateringRequest";
import Order from "@/models/Order";

export async function approveCateringRequest(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const requestId =
    formData.get("requestId");

  if (
    typeof requestId !== "string" ||
    !Types.ObjectId.isValid(requestId)
  ) {
    throw new Error(
      "Invalid catering request."
    );
  }

  await connectToDatabase();

  const request =
    await CateringRequest.findById(
      requestId
    );

  if (!request) {
    throw new Error(
      "Catering request not found."
    );
  }

  /*
   * Make an already-completed approval
   * safe to retry.
   */
  if (
    request.status === "approved" &&
    request.order
  ) {
    revalidatePath(
      "/admin/catering"
    );

    revalidatePath(
      `/admin/catering/${requestId}`
    );

    return;
  }

  if (request.status !== "reviewing") {
    throw new Error(
      `Cannot approve a ${request.status} catering request.`
    );
  }

  /*
   * Approval requires an official quote.
   */
  if (
    request.quotedSubtotal ===
      undefined ||
    request.taxRate === undefined ||
    request.tax === undefined ||
    request.quotedTotal === undefined
  ) {
    throw new Error(
      "Save an official quote before approving this request."
    );
  }

  if (
    request.quotedSubtotal < 0 ||
    request.tax < 0 ||
    request.quotedTotal <= 0
  ) {
    throw new Error(
      "The catering quote is invalid."
    );
  }

  /*
   * Defensive check:
   *
   * If a previous approval attempt created
   * an Order but failed before updating the
   * CateringRequest, recover that Order.
   */
  let order =
    await Order.findOne({
      "catering.requestId":
        request._id,
    });

  if (!order) {
    try {
      order =
        await Order.create({
          customer:
            request.customer,

          orderType:
            "catering",

          /*
           * The detailed package/custom
           * selections remain on the
           * CateringRequest.
           *
           * The Order records the approved
           * financial snapshot.
           */
          items: [
            {
              name:
                request.selectionType ===
                  "package" &&
                request.package?.name
                  ? request.package.name
                  : "Custom Catering",

              price:
                request.quotedSubtotal,

              quantity: 1,
            },
          ],

          firstName:
            request.firstName,

          lastName:
            request.lastName,

          email:
            request.email,

          phone:
            request.phone,

          notes:
            request.notes,

          subtotal:
            request.quotedSubtotal,

          taxRate:
            request.taxRate,

          tax:
            request.tax,

          total:
            request.quotedTotal,

          orderStatus:
            "pending",

          paymentStatus:
            "pending",

          catering: {
            requestId:
              request._id,

            eventDate:
              request.eventDate,

            guestCount:
              request.guestCount,

            notes:
              request.notes,
          },
        });
    } catch (error) {
      /*
       * Two approval requests can theoretically
       * race:
       *
       * Request A finds no Order.
       * Request B finds no Order.
       *
       * Both try to create one.
       *
       * Our unique index on
       * catering.requestId allows only one.
       */
      if (
        !isDuplicateKeyError(
          error
        )
      ) {
        throw error;
      }

      order =
        await Order.findOne({
          "catering.requestId":
            request._id,
        });

      if (!order) {
        throw new Error(
          "Unable to recover catering order after duplicate creation."
        );
      }
    }
  }

  /*
   * Only after an Order definitely exists
   * do we mark the request approved.
   */
  request.status =
    "approved";

  request.order =
    order._id;

  await request.save();

  revalidatePath(
    "/admin/catering"
  );

  revalidatePath(
    `/admin/catering/${requestId}`
  );

  revalidatePath(
    "/admin/orders"
  );

  revalidatePath(
    `/admin/orders/${order._id.toString()}`
  );
}

function isDuplicateKeyError(
  error: unknown
): error is {
  code: number;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown })
      .code === 11000
  );
}