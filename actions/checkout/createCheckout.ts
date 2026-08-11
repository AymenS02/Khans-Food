import { Types } from "mongoose";

import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

import {
  validateOrderItems,
  type CartItemInput,
} from "@/features/checkout/services/validateOrderItems";

interface CreateCheckoutInput {
  items: CartItemInput[];

  pickupDate: string;
  pickupTime: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  notes?: string;

  customerId?: string;
}

export async function createCheckout(
  input: CreateCheckoutInput
) {
  try {
    const {
      items,
      pickupDate,
      pickupTime,
      firstName,
      lastName,
      email,
      phone,
      notes,
      customerId,
    } = input;

    const validated =
      await validateOrderItems(items);

    const taxRate = 0.13;

    const tax = Number(
      (validated.subtotal * taxRate).toFixed(2)
    );

    const total = Number(
      (validated.subtotal + tax).toFixed(2)
    );

    await connectToDatabase();

    const order = await Order.create({
      customer: customerId
        ? new Types.ObjectId(customerId)
        : undefined,

      orderType: "regular",

      items: validated.items,

      firstName,
      lastName,
      email,
      phone,

      pickupDate: new Date(pickupDate),
      pickupTime,

      notes,

      subtotal: validated.subtotal,
      taxRate,
      tax,
      total,

      orderStatus: "pending",
      paymentStatus: "pending",
    });

    const paymentIntent =
      await stripe.paymentIntents.create(
        {
          amount: Math.round(total * 100),
          currency: "cad",

          metadata: {
            orderId: order._id.toString(),
          },

          receipt_email: email,

          automatic_payment_methods: {
            enabled: true,
          },
        },
        {
          idempotencyKey: `order-${order._id.toString()}`,
        }
      );

    order.stripePaymentIntentId =
      paymentIntent.id;

    await order.save();

    return {
      success: true,

      orderId: order._id.toString(),

      clientSecret:
        paymentIntent.client_secret,

      items: validated.items,

      subtotal: validated.subtotal,
      tax,
      total,

      pickupDate,
      pickupTime,
    };
  } catch (error) {
    console.error(
      "Checkout error:",
      error
    );

    return {
      success: false,
      error: "Unable to process checkout.",
    };
  }
}