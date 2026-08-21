"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import MenuItem from "@/models/MenuItem";

export interface ToggleMenuItemActionState {
  success: boolean;
  message: string;
}

export async function toggleMenuItemAvailability(
  _previousState:
    ToggleMenuItemActionState,

  formData: FormData
): Promise<ToggleMenuItemActionState> {
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
   * We read the real current value
   * from MongoDB instead of trusting
   * a value sent by the browser.
   */

  menuItem.available =
    !menuItem.available;

  await menuItem.save();

  revalidatePath(
    "/admin/menu/items"
  );

  revalidatePath(
    "/menu"
  );

  return {
    success: true,

    message:
      menuItem.available
        ? `${menuItem.name} is now available.`
        : `${menuItem.name} is now hidden.`,
  };
}