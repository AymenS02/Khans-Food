import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";

import Order from "@/models/Order";

import { createOrderAccessToken } from "@/lib/orderAccessToken";

import { validateOrderItems } from "@/features/checkout/services/validateOrderItems";
import { validatePickup } from "@/features/checkout/services/validatePickup";
import { getBusinessHoursForDate } from "@/features/checkout/services/getBusinessHoursForDate";

import type { CheckoutRequest } from "@/features/checkout/validators/checkoutRequestSchema";

import { getClientIp } from "@/lib/getClientIp";
import { checkRateLimit } from "@/lib/rateLimit";

type CreateCheckoutInput =
  CheckoutRequest & {
    customerId?: string;
  };

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

    /*
     * Every browser checkout attempt gets
     * a UUID so retries can reuse the same
     * Order instead of creating duplicates.
     */
    if (
      typeof checkoutAttemptId !==
        "string" ||
      !checkoutAttemptId.trim()
    ) {
      throw new Error(
        "Invalid checkout attempt."
      );
    }

    await connectToDatabase();

    /*
     * Check whether this checkout attempt
     * already created an Order.
     *
     * This allows a retry to reuse:
     *
     * checkoutAttemptId
     *        ↓
     * existing Order
     *        ↓
     * existing Stripe PaymentIntent
     */
    let order =
      await Order.findOne({
        checkoutAttemptId,
      });

    /*
     * Only validate and create an Order
     * when this is a new checkout attempt.
     *
     * If the Order already exists, we do
     * not re-run pickup validation because
     * the original checkout may have been
     * valid before a cutoff passed.
     */
    if (!order) {
      /*
       * 1. Load the business hours for the
       * requested pickup date.
       */
      const {
        businessHours,
        timeZone,
      } =
        await getBusinessHoursForDate(
          pickupDate
        );

      /*
       * 2. Validate the requested pickup
       * date/time against:
       *
       * - opening hours
       * - closing hours
       * - same-day cutoff
       * - current business timezone
       */
      const pickupValidation =
        validatePickup({
          pickupDate,
          pickupTime,

          businessHours,
          timeZone,
        });

      if (
        !pickupValidation.valid
      ) {
        return {
          success: false,

          error:
            pickupValidation.error ??
            "Invalid pickup time.",
        };
      }

      const clientIp =
        await getClientIp();

      const rateLimit =
        await checkRateLimit({
          scope:
            "regular-checkout",

          identifier:
            clientIp,

          limit:
            10,

          windowMs:
            10 * 60 * 1000,
        });

      if (!rateLimit.allowed) {
        return {
          success: false,

          error:
            "Too many checkout attempts. Please wait a few minutes and try again.",
        };
      }

      /*
       * 3. Validate the cart against the
       * database.
       *
       * This recalculates prices from
       * MenuItem instead of trusting the
       * browser.
       */
      const validated =
        await validateOrderItems(
          items
        );

      /*
       * Temporary Ontario tax rate.
       *
       * We can move this into business
       * settings later.
       */
      const taxRate =
        0.13;

      const tax =
        Number(
          (
            validated.subtotal *
            taxRate
          ).toFixed(2)
        );

      const total =
        Number(
          (
            validated.subtotal +
            tax
          ).toFixed(2)
        );

      /*
       * 4. Create the regular pickup Order.
       */
      order =
        await Order.create({
          customer:
            customerId
              ? new Types.ObjectId(
                  customerId
                )
              : undefined,

          checkoutAttemptId,

          orderType:
            "regular",

          items:
            validated.items,

          firstName,
          lastName,
          email,
          phone,

          pickupDate:
            new Date(
              pickupDate
            ),

          pickupTime,

          notes,

          subtotal:
            validated.subtotal,

          taxRate,
          tax,
          total,

          orderStatus:
            "pending",

          paymentStatus:
            "pending",
        });
    }

    /*
     * If Stripe already created a
     * PaymentIntent for this Order,
     * retrieve it.
     *
     * Otherwise create one.
     */
    let paymentIntent;

    if (
      order.stripePaymentIntentId
    ) {
      paymentIntent =
        await stripe.paymentIntents.retrieve(
          order.stripePaymentIntentId
        );
    } else {
      paymentIntent =
        await stripe.paymentIntents.create(
          {
            /*
             * Stripe expects the smallest
             * currency unit.
             *
             * CAD $10.00 → 1000 cents
             */
            amount:
              Math.round(
                order.total *
                  100
              ),

            currency:
              "cad",

            metadata: {
              orderId:
                order._id.toString(),
            },

            receipt_email:
              order.email,

            automatic_payment_methods:
              {
                enabled:
                  true,
              },
          },

          /*
           * Stripe-level idempotency.
           *
           * Even if this creation call is
           * retried, Stripe should reuse the
           * same PaymentIntent for this
           * Order.
           */
          {
            idempotencyKey:
              `order-${order._id.toString()}`,
          }
        );

      /*
       * Save the Stripe PaymentIntent ID
       * on the Order so future retries can
       * retrieve it directly.
       */
      order.stripePaymentIntentId =
        paymentIntent.id;

      await order.save();
    }

    /*
     * PaymentElement requires a client
     * secret.
     */
    if (
      !paymentIntent.client_secret
    ) {
      throw new Error(
        "PaymentIntent is missing a client secret."
      );
    }

    /*
     * createCheckout() is ONLY for normal
     * menu pickup orders.
     *
     * Order itself now supports catering,
     * which means pickupDate/pickupTime are
     * optional at the model level.
     *
     * Here, however, they must exist.
     */
    if (
      order.orderType !==
        "regular" ||
      !order.pickupDate ||
      !order.pickupTime
    ) {
      throw new Error(
        "Regular checkout order is missing pickup details."
      );
    }

    const successAccessToken =
      createOrderAccessToken(
        order._id.toString(),
        checkoutAttemptId
      );

    /*
     * Because of the check immediately
     * above, TypeScript now knows that:
     *
     * order.pickupDate = Date
     * order.pickupTime = string
     *
     * So we do NOT need optional chaining.
     */
    return {
      success: true,

      orderId:
        order._id.toString(),

      clientSecret:
        paymentIntent.client_secret,

      successAccessToken,
      
      items:
        order.items,

      subtotal:
        order.subtotal,

      tax:
        order.tax,

      total:
        order.total,

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
      error:
        "Unable to process checkout.",
    };
  }
}