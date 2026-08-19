"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

import type { AdminOrder } from "@/features/orders/types/order";

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  await connectToDatabase();

  const orders = await Order.find({})
    .sort({
      createdAt: -1,
    })
    .lean();

  return orders.map((order) => ({
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

    catering:
      order.catering?.eventDate
        ? {
            requestId:
              order.catering.requestId?.toString(),

            eventDate:
              order.catering.eventDate.toISOString(),

            guestCount:
              order.catering.guestCount,

            notes:
              order.catering.notes,
          }
        : undefined,
        
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
  }));
}