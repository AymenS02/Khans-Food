"use server";

import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import User from "@/models/User";
import Order from "@/models/Order";

export interface AdminCustomerOrder {
  id: string;

  orderType:
    | "regular"
    | "catering";

  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  total: number;

  createdAt: string;
}

export interface AdminCustomerDetail {
  id: string;

  firstName: string;
  lastName: string;

  email: string;
  phone?: string;

  isActive: boolean;
  emailVerified: boolean;

  orders: AdminCustomerOrder[];
}

export async function getAdminCustomer(
  customerId: string
): Promise<AdminCustomerDetail | null> {
  /*
   * ==========================================
   * 1. ADMIN AUTHORIZATION
   * ==========================================
   */

  const session = await auth();

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
   * 2. VALIDATE ID
   * ==========================================
   */

  if (
    !Types.ObjectId.isValid(
      customerId
    )
  ) {
    return null;
  }

  await connectToDatabase();

  /*
   * ==========================================
   * 3. LOAD CUSTOMER
   * ==========================================
   *
   * role: "customer" prevents this route
   * from being used to inspect admin accounts.
   */

  const customer =
    await User.findOne({
      _id: customerId,
      role: "customer",
    })
      .select(
        "firstName lastName email phone isActive emailVerified"
      )
      .lean();

  if (!customer) {
    return null;
  }

  /*
   * ==========================================
   * 4. LOAD ORDER HISTORY
   * ==========================================
   *
   * Both regular and authenticated catering
   * orders use Order.customer.
   */

  const orders =
    await Order.find({
      customer:
        customer._id,
    })
      .select(
        "orderType orderStatus paymentStatus total createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

  /*
   * ==========================================
   * 5. SAFE ADMIN DTO
   * ==========================================
   */

  return {
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

    orders:
      orders.map(
        (order) => ({
          id:
            order._id.toString(),

          orderType:
            order.orderType,

          orderStatus:
            order.orderStatus,

          paymentStatus:
            order.paymentStatus,

          total:
            order.total,

          createdAt:
            order.createdAt.toISOString(),
        })
      ),
  };
}