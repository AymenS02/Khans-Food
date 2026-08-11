import { z } from "zod";

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Invalid time."
  );

const dayHoursSchema = z.object({
  isOpen: z.boolean(),
  openingTime: timeSchema,
  closingTime: timeSchema,
});

export const businessSettingsSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, "Business name is required.")
    .max(100),

  timezone: z
    .string()
    .trim()
    .min(1),

  sameDayCutoffTime: timeSchema,

  weeklyHours: z.object({
    sunday: dayHoursSchema,
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
  }),
});

export type BusinessSettingsFormData =
  z.infer<typeof businessSettingsSchema>;