"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import User from "@/models/User";

export interface AdminCustomer {
  id: string;

  firstName: string;
  lastName: string;

  email: string;

  phone?: string;

  isActive: boolean;

  emailVerified: boolean;
}

export async function getAdminCustomers(): Promise<
  AdminCustomer[]
> {
  /*
   * ==========================================
   * 1. AUTHORIZATION
   * ==========================================
   */

  const session =
    await auth();

  if (
    !session?.user ||
    session.user.role !== "admin"
  ) {
    throw new Error(
      "Unauthorized."
    );
  }

  /*
   * ==========================================
   * 2. DATABASE
   * ==========================================
   */

  await connectToDatabase();

  /*
   * Only customer accounts belong in this
   * directory.
   *
   * Never expose passwords, password hashes,
   * or other authentication data.
   */

  const customers =
    await User.find({
      role: "customer",
    })
      .select(
        "firstName lastName email phone isActive emailVerified"
      )
      .sort({
        lastName: 1,
        firstName: 1,
      })
      .lean();

  /*
   * ==========================================
   * 3. ADMIN DTO
   * ==========================================
   */

  return customers.map(
    (customer) => ({
      id:
        customer._id.toString(),

      firstName:
        customer.firstName,

      lastName:
        customer.lastName,

      email:
        customer.email,

      phone:
        customer.phone,

      isActive:
        customer.isActive,

      emailVerified:
        Boolean(
          customer.emailVerified
        ),
    })
  );
}