"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";

export interface DeleteCategoryActionState {
  success: boolean;
  message: string;
}

export async function deleteCategory(
  _previousState:
    DeleteCategoryActionState,

  formData: FormData
): Promise<DeleteCategoryActionState> {
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
        "You are not authorized to delete categories.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE ID
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

  await connectToDatabase();

  /*
   * ==========================================
   * 3. CATEGORY MUST EXIST
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
   * 4. PROTECT MENU REFERENCES
   * ==========================================
   *
   * MenuItem.categoryId points to Category.
   *
   * We refuse deletion if anything still
   * references this category.
   */

  const attachedMenuItem =
    await MenuItem.exists({
      categoryId:
        category._id,
    });

  if (attachedMenuItem) {
    return {
      success: false,

      message:
        `You cannot delete "${category.name}" because it still contains menu items.`,
    };
  }

  /*
   * ==========================================
   * 5. DELETE
   * ==========================================
   */

  await category.deleteOne();

  /*
   * ==========================================
   * 6. REVALIDATE
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
      `${category.name} was deleted.`,
  };
}