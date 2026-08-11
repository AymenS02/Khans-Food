"use server";

import { Types } from "mongoose";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

import type { CustomerOrder } from "@/features/orders/types/order";

export async function getCustomerOrderById(
  orderId: string
): Promise<CustomerOrder> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!Types.ObjectId.isValid(orderId)) {
    notFound();
  }

  await connectToDatabase();

  const order = await Order.findOne({
    _id: orderId,
    customer: session.user.id,
  }).lean();

  if (!order) {
    notFound();
  }

  return {
    id: order._id.toString(),

    orderType: order.orderType,

    items: order.items.map((item) => ({
      menuItem: item.menuItem.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),

    pickupDate: order.pickupDate.toISOString(),
    pickupTime: order.pickupTime,

    subtotal: order.subtotal,
    taxRate: order.taxRate,
    tax: order.tax,
    total: order.total,

    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,

    createdAt: order.createdAt.toISOString(),
  };
}