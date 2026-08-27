"use server";

import {
  Types,
} from "mongoose";

import {
  revalidatePath,
} from "next/cache";

import { auth } from "@/auth";

import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";
import CateringPackage from "@/models/CateringPackage";

import { createSlug } from "@/lib/utils/createSlug";

import { cateringPackageSchema } from "@/features/catering/validators/cateringPackageSchema";

export interface CreateCateringPackageActionState {
  success: boolean;

  message: string;

  fieldErrors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    pricingType?: string[];
    minimumGuests?: string[];
    maximumGuests?: string[];
    displayOrder?: string[];
    items?: string[];
  };
}

export async function createCateringPackage(
  _previousState:
    CreateCateringPackageActionState,

  formData: FormData
): Promise<CreateCateringPackageActionState> {
  /*
   * ==========================================
   * 1. AUTHORIZATION
   * ==========================================
   */

  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !==
      "admin"
  ) {
    return {
      success: false,

      message:
        "You are not authorized to create catering packages.",
    };
  }

  /*
   * ==========================================
   * 2. PARSE SELECTED ITEMS
   * ==========================================
   */

  const itemsJson =
    formData.get(
      "itemsJson"
    );

  let items:
    {
      cateringItemId:
        string;

      quantity:
        number;
    }[] = [];

  if (
    typeof itemsJson ===
    "string"
  ) {
    try {
      items =
        JSON.parse(
          itemsJson
        );
    } catch {
      return {
        success: false,

        message:
          "Invalid package item selection.",
      };
    }
  }

  /*
   * ==========================================
   * 3. VALIDATION
   * ==========================================
   */

  const parsed =
    cateringPackageSchema.safeParse({
      name:
        formData.get(
          "name"
        ),

      description:
        formData.get(
          "description"
        ) || undefined,

      price:
        formData.get(
          "price"
        ),

      pricingType:
        formData.get(
          "pricingType"
        ),

      minimumGuests:
        formData.get(
          "minimumGuests"
        ),

      maximumGuests:
        formData.get(
          "maximumGuests"
        ),

      displayOrder:
        formData.get(
          "displayOrder"
        ),

      items,
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the catering package information.",

      fieldErrors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const data =
    parsed.data;

  /*
   * ==========================================
   * 4. VALIDATE OBJECT IDS
   * ==========================================
   */

  const invalidId =
    data.items.some(
      (item) =>
        !Types.ObjectId.isValid(
          item.cateringItemId
        )
    );

  if (invalidId) {
    return {
      success: false,

      message:
        "One or more selected catering items are invalid.",
    };
  }

  const slug =
    createSlug(
      data.name
    );

  if (!slug) {
    return {
      success: false,

      message:
        "Unable to create a valid package slug.",
    };
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 5. PACKAGE NAME MUST BE UNIQUE
   * ==========================================
   */

  const existingPackage =
    await CateringPackage.findOne({
      slug,
    })
      .select("_id")
      .lean();

  if (existingPackage) {
    return {
      success: false,

      message:
        "A catering package with this name already exists.",
    };
  }

  /*
   * ==========================================
   * 6. RELOAD ITEMS FROM DATABASE
   * ==========================================
   *
   * Never trust names or prices supplied
   * by the browser.
   */

  const itemIds =
    data.items.map(
      (item) =>
        item.cateringItemId
    );

  const cateringItems =
    await CateringItem.find({
      _id: {
        $in:
          itemIds,
      },

      available:
        true,
    }).lean();

  if (
    cateringItems.length !==
    itemIds.length
  ) {
    return {
      success: false,

      message:
        "One or more selected catering items are unavailable or no longer exist.",
    };
  }

  /*
   * Map database documents by ID so we can
   * preserve the quantities chosen by admin.
   */

  const itemMap =
    new Map(
      cateringItems.map(
        (item) => [
          item._id.toString(),
          item,
        ]
      )
    );

  const packageItems =
    data.items.map(
      (selected) => {
        const item =
          itemMap.get(
            selected.cateringItemId
          );

        if (!item) {
          throw new Error(
            "Catering item unexpectedly missing."
          );
        }

        /*
         * Snapshot the display name.
         *
         * If the CateringItem is renamed later,
         * this package retains what was configured
         * at this point in time until the package
         * itself is edited.
         */
        return {
          cateringItem:
            item._id,

          name:
            item.name,

          quantity:
            selected.quantity,
        };
      }
    );

  /*
   * ==========================================
   * 7. AVAILABILITY
   * ==========================================
   */

  const available =
    formData.get(
      "available"
    ) === "on";

  /*
   * ==========================================
   * 8. CREATE PACKAGE
   * ==========================================
   */

  try {
    await CateringPackage.create({
      name:
        data.name,

      slug,

      description:
        data.description ||
        undefined,

      price:
        data.price,

      pricingType:
        data.pricingType,

      minimumGuests:
        data.minimumGuests,

      maximumGuests:
        data.maximumGuests,

      items:
        packageItems,

      available,

      displayOrder:
        data.displayOrder,
    });
  } catch (error) {
    if (
      isDuplicateKeyError(
        error
      )
    ) {
      return {
        success: false,

        message:
          "A catering package with this name already exists.",
      };
    }

    console.error(
      "Unable to create catering package:",
      error
    );

    return {
      success: false,

      message:
        "Unable to create catering package.",
    };
  }

  /*
   * ==========================================
   * 9. REFRESH
   * ==========================================
   */

  revalidatePath(
    "/admin/catering/packages"
  );

  revalidatePath(
    "/catering"
  );

  return {
    success: true,

    message:
      `${data.name} was created successfully.`,
  };
}

function isDuplicateKeyError(
  error: unknown
): error is {
  code: number;
} {
  return (
    typeof error ===
      "object" &&
    error !== null &&
    "code" in error &&
    (
      error as {
        code?: unknown;
      }
    ).code === 11000
  );
}