"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import User from "@/models/User";

export interface ToggleCustomerActiveState {
  success: boolean;
  message: string;
}

export async function toggleCustomerActive(
  _previousState:
    ToggleCustomerActiveState,

  formData: FormData
): Promise<ToggleCustomerActiveState> {
  /*
   * ==========================================
   * 1. ADMIN AUTHORIZATION
   * ==========================================
   */

  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    return {
      success: false,

      message:
        "You are not authorized to manage customers.",
    };
  }

  /*
   * ==========================================
   * 2. VALIDATE CUSTOMER ID
   * ==========================================
   */

  const customerId =
    formData.get(
      "customerId"
    );

  if (
    typeof customerId !== "string" ||
    !Types.ObjectId.isValid(
      customerId
    )
  ) {
    return {
      success: false,

      message:
        "Invalid customer.",
    };
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 3. LOAD CUSTOMER ONLY
   * ==========================================
   *
   * role: "customer" is important.
   *
   * This action must never deactivate an admin.
   */

  const customer =
    await User.findOne({
      _id:
        customerId,

      role:
        "customer",
    });

  if (!customer) {
    return {
      success: false,

      message:
        "Customer not found.",
    };
  }

  /*
   * ==========================================
   * 4. FLIP DATABASE STATE
   * ==========================================
   */

  customer.isActive =
    !customer.isActive;

  await customer.save();

  /*
   * ==========================================
   * 5. REVALIDATE
   * ==========================================
   */

  revalidatePath(
    "/admin/customers"
  );

  revalidatePath(
    `/admin/customers/${customerId}`
  );

  return {
    success: true,

    message:
      customer.isActive
        ? `${customer.firstName}'s account is now active.`
        : `${customer.firstName}'s account has been deactivated.`,
  };
}