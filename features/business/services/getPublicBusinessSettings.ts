import { connection } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import BusinessSettings from "@/models/BusinessSettings";

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export interface PublicBusinessSettings {
  businessName: string;
  timezone: string;
  sameDayCutoffTime: string;
  today: {
    day: (typeof dayNames)[number];
    isOpen: boolean;
    openingTime: string;
    closingTime: string;
  };
  sameDayOrderingAvailable: boolean;
}

export async function getPublicBusinessSettings(): Promise<PublicBusinessSettings> {
  await connection();
  await connectToDatabase();

  const settings = await BusinessSettings.findOne().lean();

  if (!settings) {
    throw new Error("Business settings have not been configured.");
  }

  const timezone = settings.timezone ?? "America/Toronto";
  const today = getTodayInTimezone(timezone);
  const dayHours = settings.weeklyHours[today];

  return {
    businessName: settings.businessName,
    timezone,
    sameDayCutoffTime: settings.sameDayCutoffTime,
    today: {
      day: today,
      isOpen: dayHours.isOpen,
      openingTime: dayHours.openingTime,
      closingTime: dayHours.closingTime,
    },
    sameDayOrderingAvailable:
      dayHours.isOpen &&
      getCurrentMinutesInTimezone(timezone) <
        timeToMinutes(settings.sameDayCutoffTime),
  };
}

function getTodayInTimezone(
  timezone: string
): (typeof dayNames)[number] {
  const dayName = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: timezone,
  })
    .format(new Date())
    .toLowerCase();

  if (dayNames.includes(dayName as (typeof dayNames)[number])) {
    return dayName as (typeof dayNames)[number];
  }

  return "monday";
}

function getCurrentMinutesInTimezone(timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: timezone,
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");

  return hour * 60 + minute;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
