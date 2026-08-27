"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringItem from "@/models/CateringItem";
import CateringPackage from "@/models/CateringPackage";
import CateringRequest from "@/models/CateringRequest";

export interface DeleteCateringItemActionState {
  success: boolean;
  message: string;
}

export async function deleteCateringItem(
  _previousState:
    DeleteCateringItemActionState,

  formData: FormData
): Promise<DeleteCateringItemActionState> {
  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    return {
      success: false,
      message:
        "You are not authorized to delete catering items.",
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

  /*
   * ==========================================
   * PACKAGE REFERENCES
   * ==========================================
   *
   * A package must not silently lose an item.
   */

  const packageReference =
    await CateringPackage.exists({
      "items.cateringItem":
        item._id,
    });

  if (packageReference) {
    return {
      success: false,

      message:
        `"${item.name}" is used by a catering package. Remove it from the package before deleting it.`,
    };
  }

  /*
   * ==========================================
   * HISTORICAL REQUEST REFERENCES
   * ==========================================
   *
   * Custom requests may retain the original
   * CateringItem reference alongside their
   * name/price snapshot.
   */

  const requestReference =
    await CateringRequest.exists({
      "customItems.cateringItem":
        item._id,
    });

  if (requestReference) {
    return {
      success: false,

      message:
        `"${item.name}" appears in catering request history and cannot be permanently deleted. Hide it instead.`,
    };
  }

  await item.deleteOne();

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
      `${item.name} was deleted.`,
  };
}