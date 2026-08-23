"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";

import { menuItemSchema } from "@/features/menu/validators/menuItemSchema";
import { createSlug } from "@/features/menu/utils/createSlug";

import {
  MenuImageUploadError,
  uploadMenuItemImage,
} from "@/features/menu/services/uploadMenuItemImage";

import { deleteMenuItemImage } from "@/features/menu/services/deleteMenuItemImage";

export interface CreateMenuItemActionState {
  success: boolean;

  message: string;

  fieldErrors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    categoryId?: string[];
    displayOrder?: string[];
    image?: string[];
  };
}

export async function createMenuItem(
  _previousState:
    CreateMenuItemActionState,

  formData: FormData
): Promise<CreateMenuItemActionState> {
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
        "You are not authorized to create menu items.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE FORM
   * ==========================================
   */

  const parsed =
    menuItemSchema.safeParse({
      name:
        formData.get("name"),

      description:
        formData.get(
          "description"
        ) || undefined,

      price:
        formData.get("price"),

      categoryId:
        formData.get(
          "categoryId"
        ),

      displayOrder:
        formData.get(
          "displayOrder"
        ),
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the menu item information.",

      fieldErrors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const {
    name,
    description,
    price,
    categoryId,
    displayOrder,
  } = parsed.data;

  /*
   * ==========================================
   * 3. OBJECT ID
   * ==========================================
   */

  if (
    !Types.ObjectId.isValid(
      categoryId
    )
  ) {
    return {
      success: false,

      message:
        "The selected category is invalid.",
    };
  }

  const slug =
    createSlug(name);

  if (!slug) {
    return {
      success: false,

      message:
        "Unable to create a valid menu item slug.",
    };
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 4. CATEGORY MUST EXIST
   * ==========================================
   *
   * Never trust a categoryId just because
   * it came from our <select>.
   */

  const category =
    await Category.findById(
      categoryId
    )
      .select("_id")
      .lean();

  if (!category) {
    return {
      success: false,

      message:
        "The selected category no longer exists.",
    };
  }

  /*
   * ==========================================
   * 5. CHECK SLUG
   * ==========================================
   */

  const existingItem =
    await MenuItem.findOne({
      slug,
    })
      .select("_id")
      .lean();

  if (existingItem) {
    return {
      success: false,

      message:
        "A menu item with this name already exists.",
    };
  }

  /*
   * ==========================================
   * 6. AVAILABLE CHECKBOX
   * ==========================================
   *
   * An unchecked checkbox isn't included in
   * FormData.
   */

  const available =
    formData.get(
      "available"
    ) === "on";

  const imageValue =
    formData.get("image");

  const image =
    imageValue instanceof File &&
    imageValue.size > 0
      ? imageValue
      : null;

  /*
   * ==========================================
   * 7. CREATE
   * ==========================================
   */
  

  let uploadedImage:
    {
      url: string;
      publicId: string;
    }
    | undefined;

  if (image) {
    try {
      uploadedImage =
        await uploadMenuItemImage(
          image
        );
    } catch (error) {
      if (
        error instanceof
        MenuImageUploadError
      ) {
        return {
          success: false,

          message:
            "Please fix the menu item image.",

          fieldErrors: {
            image: [
              error.message,
            ],
          },
        };
      }

      console.error(
        "Unable to upload menu image:",
        error
      );

      return {
        success: false,

        message:
          "Unable to upload the image.",
      };
    }
  }

  try {
    await MenuItem.create({
      name,
      slug,

      description:
        description ||
        undefined,

      price,

      image:
        uploadedImage?.url,

      imagePublicId:
        uploadedImage
          ?.publicId,

      categoryId:
        category._id,

      available,

      displayOrder,
    });
  } catch (error) {

    try {
  await MenuItem.create({
    name,
    slug,

    description:
      description ||
      undefined,

    price,

    image:
      uploadedImage?.url,

    imagePublicId:
      uploadedImage
        ?.publicId,

    categoryId:
      category._id,

    available,

    displayOrder,
  });
} catch (error) {
    /*
    * Cloudinary succeeded but MongoDB failed.
    * Remove the orphaned asset.
    */
    if (
      uploadedImage
        ?.publicId
    ) {
      try {
        await deleteMenuItemImage(
          uploadedImage.publicId
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Unable to clean up uploaded image:",
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
          "A menu item with this name already exists.",
      };
    }

    console.error(
      "Unable to create menu item:",
      error
    );

    return {
      success: false,

      message:
        "Unable to create menu item.",
    };
  }
    if (
      isDuplicateKeyError(
        error
      )
    ) {
      return {
        success: false,

        message:
          "A menu item with this name already exists.",
      };
    }

    console.error(
      "Unable to create menu item:",
      error
    );

    return {
      success: false,

      message:
        "Unable to create menu item.",
    };
  }

  revalidatePath(
    "/admin/menu/items"
  );

  revalidatePath(
    "/menu"
  );

  return {
    success: true,

    message:
      `${name} was created successfully.`,
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