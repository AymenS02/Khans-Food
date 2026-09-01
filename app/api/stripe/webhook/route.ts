import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/mongodb";

import { sendPaidOrderConfirmationEmail } from "@/features/email/services/sendPaidOrderConfirmationEmail";

const STRIPE_ORDER_CURRENCY = "cad";

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

        if (
          !order.stripePaymentIntentId ||
          order.stripePaymentIntentId !==
            paymentIntent.id
        ) {
          console.error(
            `PaymentIntent mismatch for order ${orderId}. Expected ${order.stripePaymentIntentId ?? "none"}, received ${paymentIntent.id}.`
          );

          break;
        }

        if (
          paymentIntent.currency !==
          STRIPE_ORDER_CURRENCY
        ) {
          console.error(
            `Payment currency mismatch for order ${orderId}. Expected ${STRIPE_ORDER_CURRENCY}, got ${paymentIntent.currency}.`
          );

          break;
        }

        const expectedAmount = Math.round(
          order.total * 100
        );

        if (
          paymentIntent.amount_received !==
          expectedAmount
        ) {
          console.error(
            `Payment amount mismatch for order ${orderId}. Expected ${expectedAmount}, got ${paymentIntent.amount_received}.`
          );

          break;
        }

        if (order.paymentStatus === "paid") {
          break;
        }

        if (
          order.orderStatus ===
          "cancelled"
        ) {
          order.paymentStatus = "paid";
          await order.save();

          console.error(
            `Cancelled order ${orderId} received successful payment ${paymentIntent.id}. Order remains cancelled for manual investigation.`
          );

          break;
        }

        order.paymentStatus = "paid";

        if (
          order.orderStatus ===
          "pending"
        ) {
          order.orderStatus = "confirmed";
        }

        await order.save();

        try {
          await sendPaidOrderConfirmationEmail(
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

        if (
          !order.stripePaymentIntentId ||
          order.stripePaymentIntentId !==
            paymentIntent.id
        ) {
          console.error(
            `Failed PaymentIntent mismatch for order ${orderId}. Expected ${order.stripePaymentIntentId ?? "none"}, received ${paymentIntent.id}.`
          );

          break;
        }

        if (order.paymentStatus === "paid") {
          console.log(
            `Ignoring failed payment event for already-paid order ${orderId}.`
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