"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";

import { cateringItemSchema } from "@/features/catering/validators/cateringItemSchema";

import { createSlug } from "@/lib/utils/createSlug";

import {
  CateringItemImageUploadError,
  deleteCateringItemImage,
  uploadCateringItemImage,
} from "@/features/catering/services/cateringItemImage";

export interface UpdateCateringItemActionState {
  success: boolean;

  message: string;

  fieldErrors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    pricingType?: string[];
    category?: string[];
    displayOrder?: string[];
    image?: string[];
  };
}

export async function updateCateringItem(
  _previousState: UpdateCateringItemActionState,
  formData: FormData
): Promise<UpdateCateringItemActionState> {
  /*
   * ==========================================
   * 1. AUTHORIZATION
   * ==========================================
   */

  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    return {
      success: false,

      message:
        "You are not authorized to update catering items.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE ITEM ID
   * ==========================================
   */

  const cateringItemId =
    formData.get(
      "cateringItemId"
    );

  if (
    typeof cateringItemId !==
      "string" ||
    !Types.ObjectId.isValid(
      cateringItemId
    )
  ) {
    return {
      success: false,

      message:
        "Invalid catering item.",
    };
  }

  /*
   * ==========================================
   * 3. VALIDATE NORMAL FORM FIELDS
   * ==========================================
   */

  const parsed =
    cateringItemSchema.safeParse({
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

      category:
        formData.get(
          "category"
        ) || undefined,

      displayOrder:
        formData.get(
          "displayOrder"
        ),
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the catering item information.",

      fieldErrors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const {
    name,
    description,
    price,
    pricingType,
    category,
    displayOrder,
  } = parsed.data;

  /*
   * ==========================================
   * 4. IMAGE INSTRUCTIONS
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
    formData.get(
      "removeImage"
    ) === "on";

  /*
   * Admin cannot request both operations.
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
   * 5. CREATE SLUG
   * ==========================================
   */

  const slug =
    createSlug(name);

  if (!slug) {
    return {
      success: false,

      message:
        "Unable to create a valid catering item slug.",
    };
  }

  /*
   * ==========================================
   * 6. DATABASE
   * ==========================================
   */

  await connectToDatabase();

  const cateringItem =
    await CateringItem.findById(
      cateringItemId
    );

  if (!cateringItem) {
    return {
      success: false,

      message:
        "Catering item not found.",
    };
  }

  /*
   * Save this before changing anything.
   *
   * We may need to delete the old Cloudinary
   * asset after MongoDB successfully updates.
   */

  const oldImagePublicId =
    cateringItem.imagePublicId;

  /*
   * ==========================================
   * 7. DUPLICATE SLUG CHECK
   * ==========================================
   */

  const duplicate =
    await CateringItem.findOne({
      slug,

      _id: {
        $ne:
          cateringItem._id,
      },
    })
      .select("_id")
      .lean();

  if (duplicate) {
    return {
      success: false,

      message:
        "Another catering item with this name already exists.",
    };
  }

  /*
   * ==========================================
   * 8. UPLOAD REPLACEMENT IMAGE
   * ==========================================
   *
   * Upload first.
   *
   * Do NOT delete the old image yet.
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
        await uploadCateringItemImage(
          replacementImage
        );
    } catch (error) {
      if (
        error instanceof
        CateringItemImageUploadError
      ) {
        return {
          success: false,

          message:
            "Please fix the catering item image.",

          fieldErrors: {
            image: [
              error.message,
            ],
          },
        };
      }

      console.error(
        "Unable to upload replacement catering image:",
        error
      );

      return {
        success: false,

        message:
          "Unable to upload replacement image.",
      };
    }
  }

  /*
   * ==========================================
   * 9. APPLY NORMAL FIELD CHANGES
   * ==========================================
   */

  cateringItem.name =
    name;

  cateringItem.slug =
    slug;

  cateringItem.description =
    description ||
    undefined;

  cateringItem.price =
    price;

  cateringItem.pricingType =
    pricingType;

  cateringItem.category =
    category ||
    undefined;

  cateringItem.displayOrder =
    displayOrder;

  /*
   * ==========================================
   * 10. APPLY IMAGE CHANGES
   * ==========================================
   */

  if (removeImage) {
    cateringItem.image =
      undefined;

    cateringItem.imagePublicId =
      undefined;
  }

  if (uploadedImage) {
    cateringItem.image =
      uploadedImage.url;

    cateringItem.imagePublicId =
      uploadedImage.publicId;
  }

  /*
   * ==========================================
   * 11. SAVE MONGODB
   * ==========================================
   */

  try {
    await cateringItem.save();
  } catch (error) {
    /*
     * If we uploaded a new Cloudinary
     * image but MongoDB rejected the update,
     * remove the newly uploaded image.
     *
     * The OLD image remains untouched.
     */

    if (uploadedImage) {
      try {
        await deleteCateringItemImage(
          uploadedImage.publicId
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Unable to clean replacement image after failed catering item update:",
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
          "Another catering item with this name already exists.",
      };
    }

    console.error(
      "Unable to update catering item:",
      error
    );

    return {
      success: false,

      message:
        "Unable to update catering item.",
    };
  }

  /*
   * ==========================================
   * 12. DELETE OLD CLOUDINARY IMAGE
   * ==========================================
   *
   * MongoDB is now safely updated.
   *
   * If an image was replaced or removed,
   * the previous Cloudinary asset is no
   * longer needed.
   */

  const imageChanged =
    removeImage ||
    Boolean(
      uploadedImage
    );

  if (
    imageChanged &&
    oldImagePublicId
  ) {
    try {
      await deleteCateringItemImage(
        oldImagePublicId
      );
    } catch (error) {
      /*
       * Don't fail the whole update.
       *
       * MongoDB already contains the correct
       * state. This is now a cleanup problem,
       * not a failed item update.
       */

      console.error(
        "Catering item updated, but old Cloudinary image cleanup failed:",
        error
      );
    }
  }

  /*
   * ==========================================
   * 13. REVALIDATE
   * ==========================================
   */

  revalidateCatering();

  return {
    success: true,

    message:
      `${name} was updated successfully.`,
  };
}

function revalidateCatering() {
  revalidatePath(
    "/admin/catering/items"
  );

  revalidatePath(
    "/catering"
  );

  revalidatePath(
    "/catering/custom"
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