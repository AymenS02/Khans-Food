import { z } from "zod";

export const categorySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Category name must be at least 2 characters."
      )
      .max(
        60,
        "Category name cannot exceed 60 characters."
      ),
  });

export type CategoryFormData =
  z.infer<
    typeof categorySchema
  >;