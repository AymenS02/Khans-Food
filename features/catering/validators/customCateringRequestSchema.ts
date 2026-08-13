import { z } from "zod";

export const customCateringContactSchema =
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
      .email("Enter a valid email address."),

    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number.")
      .max(30),

    eventDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Enter a valid event date."
      ),

    notes: z
      .string()
      .trim()
      .max(
        1000,
        "Notes cannot exceed 1000 characters."
      )
      .optional(),
  });

const selectedItemSchema =
  z.strictObject({
    cateringItemId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid catering item."
      ),

    quantity: z
      .number()
      .int()
      .min(1)
      .max(1000),
  });

export const customCateringRequestSchema =
  customCateringContactSchema.extend({
    guestCount: z
      .number()
      .int()
      .min(1)
      .max(10000),

    items: z
      .array(selectedItemSchema)
      .min(
        1,
        "Select at least one catering item."
      )
      .max(100),
  });

export type CustomCateringContactData =
  z.infer<
    typeof customCateringContactSchema
  >;

export type CustomCateringRequestInput =
  z.infer<
    typeof customCateringRequestSchema
  >;