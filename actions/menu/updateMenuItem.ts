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

export interface UpdateMenuItemActionState {
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

export async function updateMenuItem(
  _previousState:
    UpdateMenuItemActionState,

  formData: FormData
): Promise<UpdateMenuItemActionState> {
  /*
   * ==========================================
   * 1. AUTH
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
        "You are not authorized to update menu items.",
    };
  }

  /*
   * ==========================================
   * 2. MENU ITEM ID
   * ==========================================
   */

  const menuItemId =
    formData.get(
      "menuItemId"
    );

  if (
    typeof menuItemId !== "string" ||
    !Types.ObjectId.isValid(
      menuItemId
    )
  ) {
    return {
      success: false,
      message:
        "Invalid menu item.",
    };
  }

  /*
   * ==========================================
   * 3. STANDARD FORM VALIDATION
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

  /*
   * ==========================================
   * 4. IMAGE FORM DATA
   * ==========================================
   */

  const imageValue =
    formData.get("image");

  const image =
    imageValue instanceof File &&
    imageValue.size > 0
      ? imageValue
      : null;

  const removeImage =
    formData.get(
      "removeImage"
    ) === "on";

  /*
   * Don't allow contradictory instructions.
   */

  if (
    image &&
    removeImage
  ) {
    return {
      success: false,

      message:
        "Please choose either a replacement image or remove the current image, not both.",

      fieldErrors: {
        image: [
          "Choose either a new image or remove the existing image.",
        ],
      },
    };
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 5. LOAD EXISTING ITEM
   * ==========================================
   */

  const menuItem =
    await MenuItem.findById(
      menuItemId
    );

  if (!menuItem) {
    return {
      success: false,
      message:
        "Menu item not found.",
    };
  }

  /*
   * ==========================================
   * 6. CATEGORY MUST EXIST
   * ==========================================
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
   * 7. DUPLICATE SLUG CHECK
   * ==========================================
   */

  const duplicate =
    await MenuItem.findOne({
      slug,

      _id: {
        $ne:
          menuItem._id,
      },
    })
      .select("_id")
      .lean();

  if (duplicate) {
    return {
      success: false,

      message:
        "Another menu item with this name already exists.",
    };
  }

  /*
   * Save this before changing anything.
   *
   * We'll need it if the image gets replaced
   * or removed.
   */

  const oldImagePublicId =
    menuItem.imagePublicId;

  /*
   * ==========================================
   * 8. UPLOAD REPLACEMENT IMAGE
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
        "Unable to upload replacement menu image:",
        error
      );

      return {
        success: false,

        message:
          "Unable to upload the new image.",
      };
    }
  }

  /*
   * ==========================================
   * 9. UPDATE NORMAL FIELDS
   * ==========================================
   */

  menuItem.name =
    name;

  menuItem.slug =
    slug;

  menuItem.description =
    description ||
    undefined;

  menuItem.price =
    price;

  menuItem.categoryId =
    category._id;

  menuItem.displayOrder =
    displayOrder;

  /*
   * ==========================================
   * 10. UPDATE IMAGE FIELDS
   * ==========================================
   */

  if (removeImage) {
    menuItem.image =
      undefined;

    menuItem.imagePublicId =
      undefined;
  } else if (
    uploadedImage
  ) {
    menuItem.image =
      uploadedImage.url;

    menuItem.imagePublicId =
      uploadedImage.publicId;
  }

  /*
   * ==========================================
   * 11. SAVE MONGODB FIRST
   * ==========================================
   */

  try {
    await menuItem.save();
  } catch (error) {
    /*
     * We uploaded a replacement but MongoDB
     * rejected the update.
     *
     * Remove the NEW orphaned image.
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
          "Unable to clean up replacement image:",
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
          "Another menu item with this name already exists.",
      };
    }

    console.error(
      "Unable to update menu item:",
      error
    );

    return {
      success: false,

      message:
        "Unable to update menu item.",
    };
  }

  /*
   * ==========================================
   * 12. DELETE OLD CLOUDINARY ASSET
   * ==========================================
   *
   * Only do this AFTER MongoDB successfully
   * points to the new state.
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
      await deleteMenuItemImage(
        oldImagePublicId
      );
    } catch (error) {
      /*
       * Don't undo a successful menu update
       * just because cleanup failed.
       *
       * The menu is correct. At worst an
       * unused Cloudinary asset remains.
       */

      console.error(
        "Unable to delete old menu image:",
        error
      );
    }
  }

  /*
   * ==========================================
   * 13. REFRESH
   * ==========================================
   */

  revalidatePath(
    "/admin/menu/items"
  );

  revalidatePath(
    "/menu"
  );

  return {
    success: true,

    message:
      `${name} was updated successfully.`,
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