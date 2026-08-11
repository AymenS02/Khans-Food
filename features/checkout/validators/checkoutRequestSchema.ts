import { z } from "zod";

const cartItemSchema = z.strictObject({
  menuItemId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid menu item."
    ),

  quantity: z
    .int()
    .min(1)
    .max(100),
});

export const checkoutRequestSchema =
  z.strictObject({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(100),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(100),

    email: z
      .string()
      .trim()
      .pipe(z.email()),

    phone: z
      .string()
      .trim()
      .min(
        7,
        "Enter a valid phone number."
      )
      .max(30),

    pickupDate: z.iso.date(),

    pickupTime: z.iso.time({
      precision: -1,
    }),

    notes: z
      .string()
      .trim()
      .max(500)
      .optional(),

    checkoutAttemptId:
      z.uuidv4(),

    items: z
      .array(cartItemSchema)
      .min(
        1,
        "Your cart is empty."
      )
      .max(100),
  });

export type CheckoutRequest =
  z.infer<
    typeof checkoutRequestSchema
  >;