import { z } from "zod";

export const cateringItemSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Name must be at least 2 characters."
      )
      .max(
        100,
        "Name cannot exceed 100 characters."
      ),

    description: z
      .string()
      .trim()
      .max(
        500,
        "Description cannot exceed 500 characters."
      )
      .optional(),

    price: z.coerce
      .number()
      .finite()
      .positive(
        "Price must be greater than $0."
      )
      .max(
        10000,
        "Price is too large."
      ),

    pricingType: z.enum([
      "flat",
      "per_person",
    ]),

    category: z
      .string()
      .trim()
      .max(
        60,
        "Category cannot exceed 60 characters."
      )
      .optional(),

    displayOrder: z.coerce
      .number()
      .int(
        "Display order must be a whole number."
      )
      .min(
        0,
        "Display order cannot be negative."
      )
      .max(
        10000,
        "Display order is too large."
      ),
  });

export type CateringItemFormData =
  z.infer<
    typeof cateringItemSchema
  >;