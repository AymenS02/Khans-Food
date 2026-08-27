import { z } from "zod";

const packageItemSchema =
  z.object({
    cateringItemId: z
      .string()
      .trim()
      .min(
        1,
        "Invalid catering item."
      ),

    quantity: z.coerce
      .number()
      .int(
        "Quantity must be a whole number."
      )
      .min(
        1,
        "Quantity must be at least 1."
      )
      .max(
        100,
        "Quantity is too large."
      ),
  });

export const cateringPackageSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(
          2,
          "Package name must be at least 2 characters."
        )
        .max(
          100,
          "Package name cannot exceed 100 characters."
        ),

      description: z
        .string()
        .trim()
        .max(
          1000,
          "Description cannot exceed 1000 characters."
        )
        .optional(),

      price: z.coerce
        .number()
        .finite()
        .positive(
          "Price must be greater than $0."
        )
        .max(
          50000,
          "Price is too large."
        ),

      pricingType: z.enum([
        "flat",
        "per_person",
      ]),

      minimumGuests: z.coerce
        .number()
        .int()
        .min(
          1,
          "Minimum guests must be at least 1."
        )
        .max(10000),

      maximumGuests: z.preprocess(
        (value) =>
          value === "" ||
          value === null ||
          value === undefined
            ? undefined
            : value,

        z.coerce
          .number()
          .int()
          .min(
            1,
            "Maximum guests must be at least 1."
          )
          .max(10000)
          .optional()
      ),

      displayOrder: z.coerce
        .number()
        .int()
        .min(
          0,
          "Display order cannot be negative."
        )
        .max(10000),

      items: z
        .array(
          packageItemSchema
        )
        .min(
          1,
          "Select at least one catering item."
        )
        .max(100),
    })
    .superRefine(
      (data, ctx) => {
        if (
          data.maximumGuests !==
            undefined &&
          data.maximumGuests <
            data.minimumGuests
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "maximumGuests",
            ],

            message:
              "Maximum guests cannot be less than minimum guests.",
          });
        }

        const ids =
          data.items.map(
            (item) =>
              item.cateringItemId
          );

        if (
          new Set(ids).size !==
          ids.length
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: ["items"],

            message:
              "A catering item cannot be added twice.",
          });
        }
      }
    );