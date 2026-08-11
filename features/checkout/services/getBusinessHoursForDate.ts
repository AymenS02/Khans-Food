import BusinessSettings from "@/models/BusinessSettings";
import { connectToDatabase } from "@/lib/mongodb";

import type { BusinessHours } from "../types/businessHours";

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export async function getBusinessHoursForDate(
  pickupDate: string
): Promise<{
  businessHours: BusinessHours;
  timeZone: string;
}> {
  await connectToDatabase();

  const settings =
    await BusinessSettings.findOne().lean();

  if (!settings) {
    throw new Error(
      "Business settings have not been configured."
    );
  }

  const dateParts =
    pickupDate.split("-").map(Number);

  if (dateParts.length !== 3) {
    throw new Error(
      "Invalid pickup date."
    );
  }

  const [year, month, day] =
    dateParts;

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !==
      month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(
      "Invalid pickup date."
    );
  }

  const dayName =
    dayNames[date.getUTCDay()];

  const dayHours =
    settings.weeklyHours[dayName];

  return {
    businessHours: {
      isOpen: dayHours.isOpen,
      openingTime:
        dayHours.openingTime,
      closingTime:
        dayHours.closingTime,
      cutoffTime:
        settings.sameDayCutoffTime,
    },

    timeZone:
      settings.timezone ??
      "America/Toronto",
  };
}