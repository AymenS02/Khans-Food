"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import CateringRequest from "@/models/CateringRequest";

export async function rejectCateringRequest(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const requestId =
    formData.get("requestId");

  if (
    typeof requestId !== "string" ||
    !Types.ObjectId.isValid(requestId)
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
   * Admin must review the request
   * before rejecting it.
   */
  if (request.status !== "reviewing") {
    throw new Error(
      `Cannot reject a ${request.status} catering request.`
    );
  }

  /*
   * Once an Order exists, this request
   * is already financially committed
   * to the order workflow.
   */
  if (request.order) {
    throw new Error(
      "This catering request already has an order."
    );
  }

  request.status = "rejected";

  await request.save();

  revalidatePath(
    "/admin/catering"
  );

  revalidatePath(
    `/admin/catering/${requestId}`
  );
}