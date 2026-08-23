"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import MenuItem from "@/models/MenuItem";
import Order from "@/models/Order";

import { deleteMenuItemImage } from "@/features/menu/services/deleteMenuItemImage";

export interface DeleteMenuItemActionState {
  success: boolean;
  message: string;
}

export async function deleteMenuItem(
  _previousState:
    DeleteMenuItemActionState,

  formData: FormData
): Promise<DeleteMenuItemActionState> {
  /*
   * ==========================================
   * 1. AUTH
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
        "You are not authorized to delete menu items.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE ID
   * ==========================================
   */

  const menuItemId =
    formData.get(
      "menuItemId"
    );

  if (
    typeof menuItemId !==
      "string" ||
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

  await connectToDatabase();

  /*
   * ==========================================
   * 3. ITEM MUST EXIST
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
   * 4. CHECK ORDER HISTORY
   * ==========================================
   *
   * Order.items is an array.
   *
   * Mongo can search inside that array using:
   *
   * "items.menuItem"
   */

  const historicalOrder =
    await Order.exists({
      "items.menuItem":
        menuItem._id,
    });

  if (historicalOrder) {
    return {
      success: false,

      message:
        `"${menuItem.name}" appears in order history and cannot be permanently deleted. Hide it instead.`,
    };
  }

  /*
   * ==========================================
   * 5. DELETE
   * ==========================================
   */

  /*
  * Remember the Cloudinary ID before
  * deleting the MongoDB document.
  */

  const imagePublicId =
    menuItem.imagePublicId;

  /*
  * Delete MongoDB first.
  */

  await menuItem.deleteOne();

  /*
  * Then clean up Cloudinary.
  */

  if (imagePublicId) {
    try {
      await deleteMenuItemImage(
        imagePublicId
      );
    } catch (error) {
      console.error(
        "Unable to delete menu item image:",
        error
      );
    }
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
      `${menuItem.name} was deleted.`,
  };
}