"use server";

import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";
import CateringRequest from "@/models/CateringRequest";

import { sendCateringRequestReceivedEmail } from "@/features/email/services/sendCateringRequestReceivedEmail";

import {
  customCateringRequestSchema,
  type CustomCateringRequestInput,
} from "@/features/catering/validators/customCateringRequestSchema";

import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit } from "@/lib/rateLimit";

interface CreateCustomCateringRequestResult {
  success: boolean;
  requestId?: string;
  estimatedSubtotal?: number;
  error?: string;
}

export async function createCustomCateringRequest(
  input: CustomCateringRequestInput
): Promise<CreateCustomCateringRequestResult> {
  try {
    /*
     * ==========================================
     * 1. VALIDATE INPUT
     * ==========================================
     */

    const parsed =
      customCateringRequestSchema.safeParse(
        input
      );

    if (!parsed.success) {
      return {
        success: false,

        error:
          parsed.error.issues[0]
            ?.message ??
          "Invalid catering request.",
      };
    }

    const clientIp =
      await getClientIp();

    const rateLimit =
      await checkRateLimit({
        scope:
          "catering-request",

        identifier:
          clientIp,

        limit:
          5,

        windowMs:
          10 * 60 * 1000,
      });

    if (!rateLimit.allowed) {
      return {
        success: false,

        error:
          "Too many catering requests. Please try again in a few minutes.",
      };
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      eventDate,
      guestCount,
      notes,
      items,
    } = parsed.data;

    /*
     * ==========================================
     * 2. REJECT DUPLICATE ITEM IDS
     * ==========================================
     */

    const uniqueItemIds =
      new Set(
        items.map(
          (item) =>
            item.cateringItemId
        )
      );

    if (
      uniqueItemIds.size !==
      items.length
    ) {
      return {
        success: false,

        error:
          "Duplicate catering items are not allowed.",
      };
    }

    /*
     * ==========================================
     * 3. VALIDATE EVENT DATE
     * ==========================================
     */

    const requestedDate =
      new Date(
        `${eventDate}T00:00:00.000Z`
      );

    if (
      Number.isNaN(
        requestedDate.getTime()
      )
    ) {
      return {
        success: false,

        error:
          "Invalid event date.",
      };
    }

    const today =
      new Date();

    const todayUtc =
      new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate()
        )
      );

    if (
      requestedDate <
      todayUtc
    ) {
      return {
        success: false,

        error:
          "Event date cannot be in the past.",
      };
    }

    /*
     * ==========================================
     * 4. DATABASE
     * ==========================================
     */

    await connectToDatabase();

    /*
     * ==========================================
     * 5. LOAD REAL CATERING ITEMS
     * ==========================================
     *
     * Never trust item names, prices, or
     * availability from the browser.
     */

    const cateringItemIds =
      items.map(
        (item) =>
          new Types.ObjectId(
            item.cateringItemId
          )
      );

    const databaseItems =
      await CateringItem.find({
        _id: {
          $in:
            cateringItemIds,
        },

        available:
          true,
      }).lean();

    /*
     * If one item disappeared or became
     * unavailable, reject the request.
     */

    if (
      databaseItems.length !==
      items.length
    ) {
      return {
        success: false,

        error:
          "One or more catering items are no longer available.",
      };
    }

    /*
     * ==========================================
     * 6. BUILD SNAPSHOTS + ESTIMATE
     * ==========================================
     */

    let estimatedSubtotal =
      0;

    const customItems =
      items.map(
        (selected) => {
          const cateringItem =
            databaseItems.find(
              (item) =>
                item._id.toString() ===
                selected.cateringItemId
            );

          if (!cateringItem) {
            throw new Error(
              "Catering item not found."
            );
          }

          const minimumQuantity =
            cateringItem.minimumQuantity ??
            1;

          if (
            selected.quantity <
            minimumQuantity
          ) {
            throw new Error(
              `${cateringItem.name} requires a minimum quantity of ${minimumQuantity}.`
            );
          }

          /*
           * Calculate using DATABASE price.
           */

          if (
            cateringItem.pricingType ===
            "per_person"
          ) {
            estimatedSubtotal +=
              cateringItem.price *
              guestCount *
              selected.quantity;
          } else {
            estimatedSubtotal +=
              cateringItem.price *
              selected.quantity;
          }

          /*
           * Snapshot the current item
           * information onto the request.
           */

          return {
            cateringItem:
              cateringItem._id,

            name:
              cateringItem.name,

            price:
              cateringItem.price,

            pricingType:
              cateringItem.pricingType,

            quantity:
              selected.quantity,
          };
        }
      );

    estimatedSubtotal =
      Number(
        estimatedSubtotal.toFixed(
          2
        )
      );

    /*
     * ==========================================
     * 7. LINK AUTHENTICATED CUSTOMER
     * ==========================================
     *
     * Guests are still allowed.
     */

    const session =
      await auth();

    const customer =
      session?.user?.id &&
      Types.ObjectId.isValid(
        session.user.id
      )
        ? new Types.ObjectId(
            session.user.id
          )
        : undefined;

    /*
     * ==========================================
     * 8. CREATE CATERING REQUEST
     * ==========================================
     */

    const cateringRequest =
      await CateringRequest.create({
        customer,

        firstName,
        lastName,
        email,
        phone,

        eventDate:
          requestedDate,

        guestCount,

        selectionType:
          "custom",

        customItems,

        notes,

        status:
          "submitted",
      });

    /*
     * ==========================================
     * 9. SEND CONFIRMATION EMAIL
     * ==========================================
     *
     * The catering request already exists.
     *
     * Email failure must NOT cause this action
     * to report the request as failed.
     */

    try {
      await sendCateringRequestReceivedEmail({
        requestId:
          cateringRequest._id.toString(),

        recipientEmail:
          email,

        customerName:
          firstName,

        eventDate:
          requestedDate,

        guestCount,

        selectionType:
          "custom",
      });
    } catch (emailError) {
      console.error(
        "Catering request was created, but confirmation email failed:",
        emailError
      );
    }

    /*
     * ==========================================
     * 10. SUCCESS
     * ==========================================
     */

    return {
      success: true,

      requestId:
        cateringRequest._id.toString(),

      estimatedSubtotal,
    };
  } catch (error) {
    console.error(
      "Create custom catering request error:",
      error
    );

    return {
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Unable to submit catering request.",
    };
  }
}