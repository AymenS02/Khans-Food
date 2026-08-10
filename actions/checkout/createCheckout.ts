"use server";

import { validatePickup } from "@/features/checkout/services/validatePickup";
import { validateOrderItems } from "@/features/checkout/services/validateOrderItems";
import { calculateOrderTotal } from "@/features/checkout/services/calculateOrderTotal";

interface CreateCheckoutInput {
  items: {
    menuItemId: string;
    quantity: number;
  }[];

  pickupDate: string;
  pickupTime: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  notes?: string;
}

export async function createCheckout(
  input: CreateCheckoutInput
) {
  try {
    /*
     * Temporary business hours.
     *
     * Later these will come from
     * the BusinessSettings model.
     */
    const businessHours = {
      isOpen: true,
      openingTime: "11:00",
      closingTime: "19:00",
      cutoffTime: "16:00",
    };

    /*
     * Validate pickup date and time.
     */
    const pickupValidation = validatePickup({
      pickupDate: input.pickupDate,
      pickupTime: input.pickupTime,
      businessHours,
    });

    if (!pickupValidation.valid) {
      return {
        success: false,
        error: pickupValidation.error,
      };
    }

    /*
     * Validate menu items against MongoDB.
     *
     * This ensures the browser cannot
     * manipulate prices or availability.
     */
    const validatedItems =
      await validateOrderItems(input.items);

    /*
     * Calculate the real order total.
     */
    const orderTotal = calculateOrderTotal({
      subtotal: validatedItems.subtotal,
      taxRate: 0.13,
    });

    /*
     * Stripe will eventually be created here.
     *
     * We are intentionally NOT doing that yet.
     */

    return {
      success: true,

      items: validatedItems.items,

      subtotal: orderTotal.subtotal,
      tax: orderTotal.tax,
      total: orderTotal.total,

      pickupDate: input.pickupDate,
      pickupTime: input.pickupTime,
    };
  } catch (error) {
    console.error("Checkout error:", error);

    return {
      success: false,
      error: "Unable to process checkout.",
    };
  }
}