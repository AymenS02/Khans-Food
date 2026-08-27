"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import Category from "@/models/Category";

import { categorySchema } from "@/features/menu/validators/categorySchema";
import { createSlug } from "@/lib/utils/createSlug";

export interface UpdateCategoryActionState {
  success: boolean;
  message: string;

  fieldErrors?: {
    name?: string[];
  };
}

export async function updateCategory(
  _previousState:
    UpdateCategoryActionState,

  formData: FormData
): Promise<UpdateCategoryActionState> {
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
        "You are not authorized to update categories.",
    };
  }

  /*
   * ==========================================
   * 2. CATEGORY ID
   * ==========================================
   */

  const categoryId =
    formData.get(
      "categoryId"
    );

  if (
    typeof categoryId !==
      "string" ||
    !Types.ObjectId.isValid(
      categoryId
    )
  ) {
    return {
      success: false,
      message:
        "Invalid category.",
    };
  }

  /*
   * ==========================================
   * 3. VALIDATE NEW NAME
   * ==========================================
   */

  const parsed =
    categorySchema.safeParse({
      name:
        formData.get(
          "name"
        ),
    });

  if (!parsed.success) {
    return {
      success: false,

      message:
        "Please fix the category information.",

      fieldErrors:
        parsed.error.flatten()
          .fieldErrors,
    };
  }

  const name =
    parsed.data.name;

  const slug =
    createSlug(name);

  if (!slug) {
    return {
      success: false,
      message:
        "Unable to create a valid category slug.",
    };
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 4. CATEGORY MUST EXIST
   * ==========================================
   */

  const category =
    await Category.findById(
      categoryId
    );

  if (!category) {
    return {
      success: false,
      message:
        "Category not found.",
    };
  }

  /*
   * ==========================================
   * 5. NO-OP UPDATE
   * ==========================================
   */

  if (
    category.name === name &&
    category.slug === slug
  ) {
    return {
      success: true,
      message:
        "No changes were needed.",
    };
  }

  /*
   * ==========================================
   * 6. CHECK FOR SLUG COLLISION
   * ==========================================
   *
   * Ignore the category we're currently
   * editing.
   */

  const duplicateCategory =
    await Category.findOne({
      slug,

      _id: {
        $ne: category._id,
      },
    })
      .select("_id")
      .lean();

  if (duplicateCategory) {
    return {
      success: false,

      message:
        "Another category with this name already exists.",
    };
  }

  /*
   * ==========================================
   * 7. UPDATE
   * ==========================================
   */

  category.name =
    name;

  category.slug =
    slug;

  try {
    await category.save();
  } catch (error) {
    if (
      isDuplicateKeyError(
        error
      )
    ) {
      return {
        success: false,

        message:
          "Another category with this name already exists.",
      };
    }

    console.error(
      "Unable to update category:",
      error
    );

    return {
      success: false,
      message:
        "Unable to update category.",
    };
  }

  /*
   * ==========================================
   * 8. REVALIDATE
   * ==========================================
   */

  revalidatePath(
    "/admin/menu/categories"
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