import { z } from "zod";

export const packageCateringRequestSchema =
  z.strictObject({
    packageId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid catering package."
      ),

    firstName: z
      .string()
      .trim()
      .min(
        1,
        "First name is required."
      )
      .max(100),

    lastName: z
      .string()
      .trim()
      .min(
        1,
        "Last name is required."
      )
      .max(100),

    email: z
      .string()
      .trim()
      .email(
        "Enter a valid email address."
      ),

    phone: z
      .string()
      .trim()
      .min(
        7,
        "Enter a valid phone number."
      )
      .max(30),

    eventDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Enter a valid event date."
      ),

    guestCount: z
      .number()
      .int(
        "Guest count must be a whole number."
      )
      .min(
        1,
        "Guest count must be at least 1."
      )
      .max(
        10000,
        "Guest count is too large."
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

export type PackageCateringRequestInput =
  z.infer<
    typeof packageCateringRequestSchema
  >;