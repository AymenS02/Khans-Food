import { z } from "zod";

export const menuItemSchema =
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

    categoryId: z
      .string()
      .trim()
      .min(
        1,
        "Please select a category."
      ),

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

export type MenuItemFormData =
  z.infer<
    typeof menuItemSchema
  >;