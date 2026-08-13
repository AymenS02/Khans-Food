"use server";

import { Types } from "mongoose";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

import type { AdminOrder } from "@/features/orders/types/order";

export async function getAdminOrderById(
  orderId: string
): Promise<AdminOrder> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  if (!Types.ObjectId.isValid(orderId)) {
    notFound();
  }

  await connectToDatabase();

  const order = await Order.findById(orderId).lean();

  if (!order) {
    notFound();
  }

  return {
    id: order._id.toString(),

    orderType: order.orderType,

    customer: order.customer?.toString(),

    firstName: order.firstName,
    lastName: order.lastName,
    email: order.email,
    phone: order.phone,

    items: order.items.map((item) => ({
      menuItem: item.menuItem?.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),

    pickupDate: order.pickupDate?.toISOString(),
    pickupTime: order.pickupTime,

    subtotal: order.subtotal,
    taxRate: order.taxRate,
    tax: order.tax,
    total: order.total,

    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,

    notes: order.notes,

    createdAt: order.createdAt.toISOString(),
  };
}