"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";
import CateringPackage from "@/models/CateringPackage";

import { cateringPackageSchema } from "@/features/catering/validators/cateringPackageSchema";
import { createSlug } from "@/lib/utils/createSlug";

export interface UpdateCateringPackageActionState {
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

export async function updateCateringPackage(
  _previousState:
    UpdateCateringPackageActionState,

  formData: FormData
): Promise<UpdateCateringPackageActionState> {
  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    return {
      success: false,
      message:
        "You are not authorized to update catering packages.",
    };
  }

  const packageId =
    formData.get("packageId");

  if (
    typeof packageId !== "string" ||
    !Types.ObjectId.isValid(
      packageId
    )
  ) {
    return {
      success: false,
      message:
        "Invalid catering package.",
    };
  }

  /*
   * Parse the item selection generated
   * by the client component.
   */
  const itemsJson =
    formData.get("itemsJson");

  let items: {
    cateringItemId: string;
    quantity: number;
  }[] = [];

  if (
    typeof itemsJson ===
    "string"
  ) {
    try {
      items =
        JSON.parse(itemsJson);
    } catch {
      return {
        success: false,
        message:
          "Invalid package item selection.",
      };
    }
  }

  const parsed =
    cateringPackageSchema.safeParse({
      name:
        formData.get("name"),

      description:
        formData.get(
          "description"
        ) || undefined,

      price:
        formData.get("price"),

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

  const invalidItemId =
    data.items.some(
      (item) =>
        !Types.ObjectId.isValid(
          item.cateringItemId
        )
    );

  if (invalidItemId) {
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

  const pkg =
    await CateringPackage.findById(
      packageId
    );

  if (!pkg) {
    return {
      success: false,
      message:
        "Catering package not found.",
    };
  }

  /*
   * Prevent another package from taking
   * the same slug.
   */
  const duplicate =
    await CateringPackage.findOne({
      slug,

      _id: {
        $ne: pkg._id,
      },
    })
      .select("_id")
      .lean();

  if (duplicate) {
    return {
      success: false,

      message:
        "Another catering package with this name already exists.",
    };
  }

  /*
   * Reload every CateringItem from MongoDB.
   *
   * The browser only tells us:
   *
   * ID + quantity
   *
   * It does NOT get to decide the item name.
   */
  const itemIds =
    data.items.map(
      (item) =>
        item.cateringItemId
    );

  const cateringItems =
    await CateringItem.find({
      _id: {
        $in: itemIds,
      },
    }).lean();

  if (
    cateringItems.length !==
    itemIds.length
  ) {
    return {
      success: false,

      message:
        "One or more catering items no longer exist.",
    };
  }

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

        return {
          cateringItem:
            item._id,

          /*
           * Refresh the package snapshot
           * whenever the package is edited.
           */
          name:
            item.name,

          quantity:
            selected.quantity,
        };
      }
    );

  pkg.name =
    data.name;

  pkg.slug =
    slug;

  pkg.description =
    data.description ||
    undefined;

  pkg.price =
    data.price;

  pkg.pricingType =
    data.pricingType;

  pkg.minimumGuests =
    data.minimumGuests;

  pkg.maximumGuests =
    data.maximumGuests;

  pkg.items =
    packageItems;

  pkg.displayOrder =
    data.displayOrder;

  try {
    await pkg.save();
  } catch (error) {
    if (
      isDuplicateKeyError(
        error
      )
    ) {
      return {
        success: false,

        message:
          "Another catering package with this name already exists.",
      };
    }

    console.error(
      "Unable to update catering package:",
      error
    );

    return {
      success: false,

      message:
        "Unable to update catering package.",
    };
  }

  revalidateCateringPackages();

  return {
    success: true,

    message:
      `${pkg.name} was updated successfully.`,
  };
}

function revalidateCateringPackages() {
  revalidatePath(
    "/admin/catering/packages"
  );

  revalidatePath(
    "/catering"
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
    (
      error as {
        code?: unknown;
      }
    ).code === 11000
  );
}