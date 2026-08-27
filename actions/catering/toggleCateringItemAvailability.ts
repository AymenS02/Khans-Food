"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";

export interface ToggleCateringItemActionState {
  success: boolean;
  message: string;
}

export async function toggleCateringItemAvailability(
  _previousState:
    ToggleCateringItemActionState,

  formData: FormData
): Promise<ToggleCateringItemActionState> {
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

  const cateringItemId =
    formData.get(
      "cateringItemId"
    );

  if (
    typeof cateringItemId !== "string" ||
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

  await connectToDatabase();

  const item =
    await CateringItem.findById(
      cateringItemId
    );

  if (!item) {
    return {
      success: false,
      message:
        "Catering item not found.",
    };
  }

  item.available =
    !item.available;

  await item.save();

  revalidatePath(
    "/admin/catering/items"
  );

  revalidatePath(
    "/catering"
  );

  revalidatePath(
    "/catering/custom"
  );

  return {
    success: true,

    message:
      item.available
        ? `${item.name} is now available.`
        : `${item.name} is now hidden.`,
  };
}