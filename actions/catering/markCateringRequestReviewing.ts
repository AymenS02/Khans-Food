"use server";

import { Types } from "mongoose";
import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import CateringRequest from "@/models/CateringRequest";

export async function markCateringRequestReviewing(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (
    session.user.role !== "admin"
  ) {
    redirect("/");
  }

  const requestId =
    formData.get("requestId");

  if (
    typeof requestId !== "string" ||
    !Types.ObjectId.isValid(
      requestId
    )
  ) {
    throw new Error(
      "Invalid catering request."
    );
  }

  await connectToDatabase();

  const request =
    await CateringRequest.findById(
      requestId
    );

  if (!request) {
    throw new Error(
      "Catering request not found."
    );
  }

  /*
   * Only submitted requests can
   * move into reviewing.
   */
  if (
    request.status !==
    "submitted"
  ) {
    throw new Error(
      `Cannot move a ${request.status} request into reviewing.`
    );
  }

  request.status =
    "reviewing";

  await request.save();

  revalidatePath(
    "/admin/catering"
  );

  revalidatePath(
    `/admin/catering/${requestId}`
  );
}