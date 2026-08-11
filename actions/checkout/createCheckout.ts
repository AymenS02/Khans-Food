import { Types } from "mongoose";

import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

import {
  validateOrderItems,
  type CartItemInput,
} from "@/features/checkout/services/validateOrderItems";

import { validatePickup } from "@/features/checkout/services/validatePickup";

import { getBusinessHoursForDate } from "@/features/checkout/services/getBusinessHoursForDate";

interface CreateCheckoutInput {
  items: CartItemInput[];

  pickupDate: string;
  pickupTime: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  notes?: string;
  checkoutAttemptId: string;

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
      checkoutAttemptId,
    } = input;

    // Make sure this checkout has an attempt ID.
    if (
      typeof checkoutAttemptId !== "string" ||
      !checkoutAttemptId.trim()
    ) {
      throw new Error("Invalid checkout attempt.");
    }

    await connectToDatabase();

    // Check whether this checkout attempt already
    // created an order.
    let order = await Order.findOne({
      checkoutAttemptId,
    });

    if (!order) {
      // 1. Get that day's business hours
      const {
        businessHours,
        timeZone,
      } =
        await getBusinessHoursForDate(
          pickupDate
        );

      // 2. Validate requested pickup
      const pickupValidation =
        validatePickup({
          pickupDate,
          pickupTime,
          businessHours,
          timeZone,
        });

      // 3. Stop checkout if invalid
      if (!pickupValidation.valid) {
        return {
          success: false,
          error:
            pickupValidation.error ??
            "Invalid pickup time.",
        };
      }

      // 4. Validate menu/cart
      const validated =
        await validateOrderItems(items);

      const taxRate = 0.13;

      const tax = Number(
        (
          validated.subtotal *
          taxRate
        ).toFixed(2)
      );

      const total = Number(
        (
          validated.subtotal +
          tax
        ).toFixed(2)
      );

      // 5. Create order
      order = await Order.create({
        customer: customerId
          ? new Types.ObjectId(customerId)
          : undefined,

        checkoutAttemptId,

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
    }

    // If this order already has a Stripe PaymentIntent,
    // reuse it instead of creating another one.
    let paymentIntent;

    if (order.stripePaymentIntentId) {
      paymentIntent =
        await stripe.paymentIntents.retrieve(
          order.stripePaymentIntentId
        );
    } else {
      paymentIntent =
        await stripe.paymentIntents.create(
          {
            amount: Math.round(
              order.total * 100
            ),

            currency: "cad",

            metadata: {
              orderId:
                order._id.toString(),
            },

            receipt_email: order.email,

            automatic_payment_methods: {
              enabled: true,
            },
          },
          {
            idempotencyKey:
              `order-${order._id.toString()}`,
          }
        );

      order.stripePaymentIntentId =
        paymentIntent.id;

      await order.save();
    }

    if (!paymentIntent.client_secret) {
      throw new Error(
        "PaymentIntent is missing a client secret."
      );
    }

    return {
      success: true,

      orderId: order._id.toString(),

      clientSecret:
        paymentIntent.client_secret,

      items: order.items,

      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,

      pickupDate:
        order.pickupDate.toISOString(),

      pickupTime:
        order.pickupTime,
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