import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/mongodb";

import { sendRegularOrderConfirmationEmail } from "@/features/email/services/sendRegularOrderConfirmationEmail";

export async function POST(request: Request) {
  const body = await request.text();

  const signature = request.headers.get(
    "stripe-signature"
  );

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "Missing STRIPE_WEBHOOK_SECRET"
    );

    return NextResponse.json(
      { error: "Webhook configuration error." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        const orderId =
          paymentIntent.metadata.orderId;

        if (!orderId) {
          console.error(
            "PaymentIntent missing orderId:",
            paymentIntent.id
          );

          break;
        }

        const order = await Order.findById(
          orderId
        );

        if (!order) {
          console.error(
            `Order ${orderId} not found.`
          );

          break;
        }

        const expectedAmount = Math.round(
          order.total * 100
        );

        if (
          paymentIntent.amount !== expectedAmount
        ) {
          console.error(
            `Payment amount mismatch for order ${orderId}.`
          );

          break;
        }

        if (order.paymentStatus === "paid") {
          break;
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";

        await order.save();

        try {
          await sendRegularOrderConfirmationEmail(
            orderId
          );
        } catch (error) {
          console.error(
            "Order was paid, but confirmation email failed:",
            error
          );
        }

        console.log(
          `Order ${orderId} marked as paid.`
        );

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        const orderId =
          paymentIntent.metadata.orderId;

        if (!orderId) {
          console.error(
            "Failed PaymentIntent missing orderId:",
            paymentIntent.id
          );

          break;
        }

        const order = await Order.findById(
          orderId
        );

        if (!order) {
          console.error(
            `Order ${orderId} not found.`
          );

          break;
        }

        order.paymentStatus = "failed";

        await order.save();

        console.log(
          `Payment failed for order ${orderId}.`
        );

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}