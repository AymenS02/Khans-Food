"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";

import { menuItemSchema } from "@/features/menu/validators/menuItemSchema";
import { createSlug } from "@/features/menu/utils/createSlug";

export interface UpdateMenuItemActionState {
  success: boolean;
  message: string;

  fieldErrors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    categoryId?: string[];
    displayOrder?: string[];
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
   * 2. ITEM ID
   * ==========================================
   */

  const menuItemId =
    formData.get("menuItemId");

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
   * 3. VALIDATE FORM
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

  await connectToDatabase();

  /*
   * ==========================================
   * 4. ITEM MUST EXIST
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
   * 5. CATEGORY MUST EXIST
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
   * 6. PREVENT DUPLICATE SLUG
   * ==========================================
   */

  const duplicate =
    await MenuItem.findOne({
      slug,

      _id: {
        $ne: menuItem._id,
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
   * ==========================================
   * 7. UPDATE
   * ==========================================
   */

  menuItem.name =
    name;

  menuItem.slug =
    slug;

  menuItem.description =
    description || undefined;

  menuItem.price =
    price;

  menuItem.categoryId =
    category._id;

  menuItem.displayOrder =
    displayOrder;

  try {
    await menuItem.save();
  } catch (error) {
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