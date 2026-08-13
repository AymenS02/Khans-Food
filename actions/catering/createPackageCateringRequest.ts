"use server";

import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringPackage from "@/models/CateringPackage";
import CateringRequest from "@/models/CateringRequest";

import {
  packageCateringRequestSchema,
  type PackageCateringRequestInput,
} from "@/features/catering/validators/packageCateringRequestSchema";

interface CreatePackageCateringRequestResult {
  success: boolean;
  requestId?: string;
  error?: string;
}

export async function createPackageCateringRequest(
  input: PackageCateringRequestInput
): Promise<CreatePackageCateringRequestResult> {
  try {
    /*
     * Never trust data simply because
     * TypeScript says it has the right type.
     */
    const parsed =
      packageCateringRequestSchema.safeParse(
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
      packageId,
      firstName,
      lastName,
      email,
      phone,
      eventDate,
      guestCount,
      notes,
    } = parsed.data;

    /*
     * Catering events cannot be
     * scheduled in the past.
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

    const today = new Date();

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
     * Re-load the package from MongoDB.
     *
     * We do NOT trust package information
     * sent from the browser.
     */
    const cateringPackage =
      await CateringPackage.findOne({
        _id: packageId,
        available: true,
      }).lean();

    if (!cateringPackage) {
      return {
        success: false,
        error:
          "This catering package is no longer available.",
      };
    }

    /*
     * Enforce package guest limits.
     */
    if (
      cateringPackage.minimumGuests &&
      guestCount <
        cateringPackage.minimumGuests
    ) {
      return {
        success: false,

        error:
          `This package requires at least ${cateringPackage.minimumGuests} guests.`,
      };
    }

    if (
      cateringPackage.maximumGuests &&
      guestCount >
        cateringPackage.maximumGuests
    ) {
      return {
        success: false,

        error:
          `This package supports a maximum of ${cateringPackage.maximumGuests} guests.`,
      };
    }

    /*
     * Associate the request with the
     * logged-in customer when possible.
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
     * Snapshot package information.
     *
     * The customer does NOT provide
     * name, price, or pricingType.
     *
     * Those come from MongoDB.
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
          "package",

        package: {
          packageId:
            cateringPackage._id,

          name:
            cateringPackage.name,

          price:
            cateringPackage.price,

          pricingType:
            cateringPackage.pricingType,
        },

        customItems: [],

        notes,

        status:
          "submitted",
      });

    return {
      success: true,

      requestId:
        cateringRequest._id.toString(),
    };
  } catch (error) {
    console.error(
      "Create catering request error:",
      error
    );

    return {
      success: false,

      error:
        "Unable to submit catering request.",
    };
  }
}