"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringPackage from "@/models/CateringPackage";
import CateringRequest from "@/models/CateringRequest";

export interface DeleteCateringPackageActionState {
  success: boolean;
  message: string;
}

export async function deleteCateringPackage(
  _previousState:
    DeleteCateringPackageActionState,

  formData: FormData
): Promise<DeleteCateringPackageActionState> {
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
        "You are not authorized to delete catering packages.",
    };
  }

  const packageId =
    formData.get(
      "packageId"
    );

  if (
    typeof packageId !== "string" ||
    !Types.ObjectId.isValid(
      packageId
    )
  ) {
    return {
      success: false,
      message:
        "Invalid catering package.",
    };
  }

  await connectToDatabase();

  const pkg =
    await CateringPackage.findById(
      packageId
    );

  if (!pkg) {
    return {
      success: false,
      message:
        "Catering package not found.",
    };
  }

  /*
   * Protect historical catering requests.
   *
   * IMPORTANT:
   * This assumes your CateringRequest package
   * snapshot stores the original package ID as:
   *
   * package.packageId
   */

  const historicalRequest =
    await CateringRequest.exists({
      "package.packageId":
        pkg._id,
    });

  if (historicalRequest) {
    return {
      success: false,

      message:
        `"${pkg.name}" appears in catering request history and cannot be permanently deleted. Hide it instead.`,
    };
  }

  await pkg.deleteOne();

  revalidatePath(
    "/admin/catering/packages"
  );

  revalidatePath(
    "/catering"
  );

  return {
    success: true,

    message:
      `${pkg.name} was deleted.`,
  };
}