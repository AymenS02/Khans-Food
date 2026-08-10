import { z } from "zod";

export const checkoutSchema = z.object({
  pickupDate: z
    .string()
    .min(1, "Pickup date is required."),

  pickupTime: z
    .string()
    .min(1, "Pickup time is required."),

  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name is too long."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number is too long."),

  notes: z
    .string()
    .trim()
    .max(
      500,
      "Notes cannot exceed 500 characters."
    )
    .optional(),
});

export type CheckoutFormData =
  z.infer<typeof checkoutSchema>;