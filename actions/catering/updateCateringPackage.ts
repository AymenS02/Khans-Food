"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";
import CateringPackage from "@/models/CateringPackage";

import { cateringPackageSchema } from "@/features/catering/validators/cateringPackageSchema";

import {
  CateringPackageImageUploadError,
  deleteCateringPackageImage,
  uploadCateringPackageImage,
} from "@/features/catering/services/cateringPackageImage";

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
    image?: string[];
  };
}

export async function updateCateringPackage(
  _previousState: UpdateCateringPackageActionState,
  formData: FormData
): Promise<UpdateCateringPackageActionState> {
  /*
   * ==========================================
   * 1. AUTHORIZATION
   * ==========================================
   */

  const session = await auth();

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

  /*
   * ==========================================
   * 2. VALIDATE PACKAGE ID
   * ==========================================
   */

  const packageId =
    formData.get("packageId");

  if (
    typeof packageId !== "string" ||
    !Types.ObjectId.isValid(packageId)
  ) {
    return {
      success: false,

      message:
        "Invalid catering package.",
    };
  }

  /*
   * ==========================================
   * 3. PARSE PACKAGE ITEMS
   * ==========================================
   *
   * The client sends:
   *
   * [
   *   {
   *     cateringItemId: "...",
   *     quantity: 2
   *   }
   * ]
   */

  const itemsJson =
    formData.get("itemsJson");

  let items: {
    cateringItemId: string;
    quantity: number;
  }[] = [];

  if (
    typeof itemsJson === "string"
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

  /*
   * ==========================================
   * 4. VALIDATE FORM DATA
   * ==========================================
   */

  const parsed =
    cateringPackageSchema.safeParse({
      name:
        formData.get("name"),

      description:
        formData.get("description") ||
        undefined,

      price:
        formData.get("price"),

      pricingType:
        formData.get("pricingType"),

      minimumGuests:
        formData.get("minimumGuests"),

      maximumGuests:
        formData.get("maximumGuests"),

      displayOrder:
        formData.get("displayOrder"),

      items,
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the catering package information.",

      fieldErrors:
        parsed.error.flatten().fieldErrors,
    };
  }

  const data =
    parsed.data;

  /*
   * ==========================================
   * 5. READ IMAGE INSTRUCTIONS
   * ==========================================
   */

  const imageValue =
    formData.get("image");

  const replacementImage =
    imageValue instanceof File &&
    imageValue.size > 0
      ? imageValue
      : undefined;

  const removeImage =
    formData.get("removeImage") ===
    "on";

  /*
   * We don't allow:
   *
   * Replace image ☑
   * Remove image  ☑
   *
   * at the same time.
   */

  if (
    replacementImage &&
    removeImage
  ) {
    return {
      success: false,

      message:
        "Choose either a replacement image or remove the current image, not both.",

      fieldErrors: {
        image: [
          "Choose either replacement or removal.",
        ],
      },
    };
  }

  /*
   * ==========================================
   * 6. VALIDATE CATERING ITEM IDS
   * ==========================================
   */

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

  /*
   * ==========================================
   * 7. CREATE SLUG
   * ==========================================
   */

  const slug =
    createSlug(data.name);

  if (!slug) {
    return {
      success: false,

      message:
        "Unable to create a valid package slug.",
    };
  }

  /*
   * ==========================================
   * 8. CONNECT TO DATABASE
   * ==========================================
   */

  await connectToDatabase();

  /*
   * ==========================================
   * 9. LOAD PACKAGE
   * ==========================================
   */

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
   * Store these before changing anything.
   *
   * oldSlug:
   * Allows us to revalidate the old public URL
   * if the package was renamed.
   *
   * oldImagePublicId:
   * Allows us to remove the old Cloudinary
   * asset AFTER MongoDB safely saves.
   */

  const oldSlug =
    pkg.slug;

  const oldImagePublicId =
    pkg.imagePublicId;

  /*
   * ==========================================
   * 10. DUPLICATE SLUG CHECK
   * ==========================================
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
   * ==========================================
   * 11. RELOAD CATERING ITEMS FROM DATABASE
   * ==========================================
   *
   * Never trust names supplied by the browser.
   *
   * Browser controls:
   * - CateringItem ID
   * - quantity
   *
   * MongoDB controls:
   * - actual item
   * - actual name
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

  /*
   * ==========================================
   * 12. BUILD ITEM LOOKUP
   * ==========================================
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

  /*
   * ==========================================
   * 13. BUILD PACKAGE ITEM SNAPSHOTS
   * ==========================================
   */

  const packageItems =
    data.items.map(
      (selected) => {
        const item =
          itemMap.get(
            selected.cateringItemId
          );

        if (!item) {
          /*
           * This should be impossible because
           * we checked the DB result count above.
           */
          throw new Error(
            "Catering item unexpectedly missing."
          );
        }

        return {
          cateringItem:
            item._id,

          /*
           * Snapshot the current item name.
           */
          name:
            item.name,

          quantity:
            selected.quantity,
        };
      }
    );

  /*
   * ==========================================
   * 14. UPLOAD REPLACEMENT IMAGE
   * ==========================================
   *
   * IMPORTANT:
   *
   * We upload the NEW image before changing
   * MongoDB.
   *
   * We do NOT delete the OLD image yet.
   */

  let uploadedImage:
    | {
        url: string;
        publicId: string;
      }
    | undefined;

  if (replacementImage) {
    try {
      uploadedImage =
        await uploadCateringPackageImage(
          replacementImage
        );
    } catch (error) {
      if (
        error instanceof
        CateringPackageImageUploadError
      ) {
        return {
          success: false,

          message:
            "Please fix the catering package image.",

          fieldErrors: {
            image: [
              error.message,
            ],
          },
        };
      }

      console.error(
        "Unable to upload replacement package image:",
        error
      );

      return {
        success: false,

        message:
          "Unable to upload replacement package image.",
      };
    }
  }

  /*
   * ==========================================
   * 15. APPLY NORMAL FIELD CHANGES
   * ==========================================
   */

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

  /*
   * ==========================================
   * 16. APPLY IMAGE CHANGES
   * ==========================================
   */

  if (removeImage) {
    pkg.image =
      undefined;

    pkg.imagePublicId =
      undefined;
  }

  if (uploadedImage) {
    pkg.image =
      uploadedImage.url;

    pkg.imagePublicId =
      uploadedImage.publicId;
  }

  /*
   * ==========================================
   * 17. SAVE PACKAGE
   * ==========================================
   */

  try {
    await pkg.save();
  } catch (error) {
    /*
     * If the replacement image uploaded but
     * MongoDB rejected the update, remove the
     * NEW image.
     *
     * The old image is still untouched.
     */

    if (uploadedImage) {
      try {
        await deleteCateringPackageImage(
          uploadedImage.publicId
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Unable to clean replacement package image after failed update:",
          cleanupError
        );
      }
    }

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

  /*
   * ==========================================
   * 18. CLEAN UP OLD CLOUDINARY IMAGE
   * ==========================================
   *
   * MongoDB has successfully saved.
   *
   * We can now safely delete the previous
   * Cloudinary image if it was replaced or
   * removed.
   */

  const imageChanged =
    removeImage ||
    Boolean(uploadedImage);

  if (
    imageChanged &&
    oldImagePublicId
  ) {
    try {
      await deleteCateringPackageImage(
        oldImagePublicId
      );
    } catch (error) {
      /*
       * Do not report the whole update as failed.
       *
       * The package is already correct in MongoDB.
       * This is only an asset-cleanup issue.
       */

      console.error(
        "Package updated, but old Cloudinary image cleanup failed:",
        error
      );
    }
  }

  /*
   * ==========================================
   * 19. REVALIDATE PAGES
   * ==========================================
   */

  revalidatePath(
    "/admin/catering/packages"
  );

  revalidatePath(
    "/catering"
  );

  /*
   * Revalidate the previous slug.
   *
   * This matters if:
   *
   * Family Package
   * ↓ rename
   * Large Family Package
   */

  revalidatePath(
    `/catering/${oldSlug}`
  );

  /*
   * Revalidate the current/new slug too.
   */

  revalidatePath(
    `/catering/${slug}`
  );

  /*
   * ==========================================
   * 20. SUCCESS
   * ==========================================
   */

  return {
    success: true,

    message:
      `${data.name} was updated successfully.`,
  };
}

/*
 * ============================================
 * DUPLICATE KEY HELPER
 * ============================================
 */

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