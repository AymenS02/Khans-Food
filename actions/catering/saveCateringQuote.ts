"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import CateringRequest from "@/models/CateringRequest";

export async function saveCateringQuote(
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

  const quotedSubtotalValue =
    formData.get("quotedSubtotal");

  const adminNotesValue =
    formData.get("adminNotes");

  if (
    typeof requestId !== "string" ||
    !Types.ObjectId.isValid(requestId)
  ) {
    throw new Error(
      "Invalid catering request."
    );
  }

  if (
    typeof quotedSubtotalValue !==
    "string"
  ) {
    throw new Error(
      "Invalid quote amount."
    );
  }

  const quotedSubtotal =
    Number(quotedSubtotalValue);

  if (
    !Number.isFinite(
      quotedSubtotal
    ) ||
    quotedSubtotal < 0
  ) {
    throw new Error(
      "Quote subtotal must be a valid positive amount."
    );
  }

  const adminNotes =
    typeof adminNotesValue ===
    "string"
      ? adminNotesValue.trim()
      : "";

  if (
    adminNotes.length > 2000
  ) {
    throw new Error(
      "Admin notes cannot exceed 2000 characters."
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
   * Quotes can only be edited
   * while the request is reviewing.
   */
  if (
    request.status !==
    "reviewing"
  ) {
    throw new Error(
      "Only reviewing requests can be quoted."
    );
  }

  const taxRate = 0.13;

  const normalizedSubtotal =
    Number(
      quotedSubtotal.toFixed(2)
    );

  const tax =
    Number(
      (
        normalizedSubtotal *
        taxRate
      ).toFixed(2)
    );

  const quotedTotal =
    Number(
      (
        normalizedSubtotal +
        tax
      ).toFixed(2)
    );

  request.quotedSubtotal =
    normalizedSubtotal;

  request.taxRate =
    taxRate;

  request.tax =
    tax;

  request.quotedTotal =
    quotedTotal;

  request.adminNotes =
    adminNotes || undefined;

  await request.save();

  revalidatePath(
    "/admin/catering"
  );

  revalidatePath(
    `/admin/catering/${requestId}`
  );
}