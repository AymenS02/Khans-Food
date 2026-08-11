"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order, {
  type OrderStatus,
} from "@/models/Order";

import { orderStatusTransitions } from "@/features/orders/constants/orderStatusTransitions";

const allowedStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export async function updateOrderStatus(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const orderId = formData.get("orderId");
  const status = formData.get("status");

  if (
    typeof orderId !== "string" ||
    !Types.ObjectId.isValid(orderId)
  ) {
    throw new Error("Invalid order ID.");
  }

  if (
    typeof status !== "string" ||
    !allowedStatuses.includes(
      status as OrderStatus
    )
  ) {
    throw new Error("Invalid order status.");
  }

  await connectToDatabase();

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const currentStatus = order.orderStatus;

  const allowedNextStatuses =
    orderStatusTransitions[currentStatus];

  if (
    !allowedNextStatuses.includes(
      status as OrderStatus
    )
  ) {
    throw new Error(
      `Cannot change order from ${currentStatus} to ${status}.`
    );
  }

  order.orderStatus =
    status as OrderStatus;

  await order.save();

  revalidatePath("/admin/orders");
  revalidatePath(
    `/admin/orders/${orderId}`
  );
  revalidatePath("/account/orders");
  revalidatePath(
    `/account/orders/${orderId}`
  );
}