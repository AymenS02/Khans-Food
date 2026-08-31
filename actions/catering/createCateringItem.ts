"use server";

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

export interface CreateCateringItemActionState {
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

export async function createCateringItem(
  _previousState: CreateCateringItemActionState,
  formData: FormData
): Promise<CreateCateringItemActionState> {
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
        "You are not authorized to create catering items.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE NORMAL FORM FIELDS
   * ==========================================
   */

  const parsed =
    cateringItemSchema.safeParse({
      name:
        formData.get("name"),

      description:
        formData.get("description") ||
        undefined,

      price:
        formData.get("price"),

      pricingType:
        formData.get("pricingType"),

      category:
        formData.get("category") ||
        undefined,

      displayOrder:
        formData.get("displayOrder"),
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the catering item information.",

      fieldErrors:
        parsed.error.flatten().fieldErrors,
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
   * 3. CREATE SLUG
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
   * 4. READ OPTIONAL IMAGE
   * ==========================================
   */

  const imageValue =
    formData.get("image");

  const imageFile =
    imageValue instanceof File &&
    imageValue.size > 0
      ? imageValue
      : undefined;

  /*
   * ==========================================
   * 5. AVAILABILITY
   * ==========================================
   */

  const available =
    formData.get("available") ===
    "on";

  /*
   * ==========================================
   * 6. DATABASE
   * ==========================================
   */

  await connectToDatabase();

  /*
   * ==========================================
   * 7. DUPLICATE CHECK
   * ==========================================
   */

  const existingItem =
    await CateringItem.findOne({
      slug,
    })
      .select("_id")
      .lean();

  if (existingItem) {
    return {
      success: false,

      message:
        "A catering item with this name already exists.",
    };
  }

  /*
   * ==========================================
   * 8. UPLOAD OPTIONAL IMAGE
   * ==========================================
   *
   * We upload before MongoDB creation.
   *
   * If MongoDB creation fails afterward,
   * we clean up the uploaded image.
   */

  let uploadedImage:
    | {
        url: string;
        publicId: string;
      }
    | undefined;

  if (imageFile) {
    try {
      uploadedImage =
        await uploadCateringItemImage(
          imageFile
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
        "Unable to upload catering item image:",
        error
      );

      return {
        success: false,

        message:
          "Unable to upload catering item image.",
      };
    }
  }

  /*
   * ==========================================
   * 9. CREATE CATERING ITEM
   * ==========================================
   */

  try {
    await CateringItem.create({
      name,
      slug,

      description:
        description ||
        undefined,

      image:
        uploadedImage?.url,

      imagePublicId:
        uploadedImage?.publicId,

      price,

      pricingType,

      category:
        category ||
        undefined,

      available,

      displayOrder,
    });
  } catch (error) {
    /*
     * Cloudinary upload succeeded,
     * but MongoDB creation failed.
     *
     * Remove the now-orphaned image.
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
          "Unable to clean up catering image after failed create:",
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
          "A catering item with this name already exists.",
      };
    }

    console.error(
      "Unable to create catering item:",
      error
    );

    return {
      success: false,

      message:
        "Unable to create catering item.",
    };
  }

  /*
   * ==========================================
   * 10. REVALIDATE
   * ==========================================
   */

  revalidateCatering();

  return {
    success: true,

    message:
      `${name} was created successfully.`,
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