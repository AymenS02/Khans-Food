"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringPackage from "@/models/CateringPackage";

export interface ToggleCateringPackageActionState {
  success: boolean;
  message: string;
}

export async function toggleCateringPackageAvailability(
  _previousState:
    ToggleCateringPackageActionState,

  formData: FormData
): Promise<ToggleCateringPackageActionState> {
  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    return {
      success: false,

      message:
        "You are not authorized to update catering packages.",
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

  pkg.available =
    !pkg.available;

  await pkg.save();

  revalidatePath(
    "/admin/catering/packages"
  );

  revalidatePath(
    "/catering"
  );

  return {
    success: true,

    message:
      pkg.available
        ? `${pkg.name} is now available.`
        : `${pkg.name} is now hidden.`,
  };
}