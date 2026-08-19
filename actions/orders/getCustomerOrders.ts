"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

import type { CustomerOrder } from "@/features/orders/types/order";

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectToDatabase();

  const orders = await Order.find({
    customer: session.user.id,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return orders.map((order) => ({
    id: order._id.toString(),

    orderType: order.orderType,

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

    createdAt: order.createdAt.toISOString(),
  }));
}