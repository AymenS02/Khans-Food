"use server";

import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";
import CateringRequest from "@/models/CateringRequest";

import {
  customCateringRequestSchema,
  type CustomCateringRequestInput,
} from "@/features/catering/validators/customCateringRequestSchema";

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
     * Reject duplicate item IDs.
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
     * Validate the event date.
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
        error: "Invalid event date.",
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

    await connectToDatabase();

    /*
     * Load the REAL catering items.
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
          $in: cateringItemIds,
        },

        available: true,
      }).lean();

    /*
     * If one of the IDs is missing,
     * deleted, or unavailable, stop.
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

    let estimatedSubtotal = 0;

    const customItems =
      items.map((selected) => {
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
         * Calculate using DATABASE price,
         * never browser price.
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
         * Snapshot the item information.
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
      });

    estimatedSubtotal =
      Number(
        estimatedSubtotal.toFixed(2)
      );

    /*
     * Link to logged-in customer
     * when possible.
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