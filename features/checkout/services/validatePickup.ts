import { BusinessHours } from "../types/businessHours";

interface ValidatePickupParams {
  pickupDate: string;
  pickupTime: string;
  businessHours: BusinessHours;
  timeZone: string;
  now?: Date;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePickup({
  pickupDate,
  pickupTime,
  businessHours,
  timeZone,
  now = new Date(),
}: ValidatePickupParams): ValidationResult {
  if (!businessHours.isOpen) {
    return {
      valid: false,
      error: "The restaurant is closed on this day.",
    };
  }

  if (!isValidDateString(pickupDate)) {
    return {
      valid: false,
      error: "Invalid pickup date.",
    };
  }

  const pickupMinutes =
    convertTimeToMinutes(pickupTime);

  const openingMinutes =
    convertTimeToMinutes(
      businessHours.openingTime
    );

  const closingMinutes =
    convertTimeToMinutes(
      businessHours.closingTime
    );

  if (pickupMinutes === null) {
    return {
      valid: false,
      error: "Invalid pickup time.",
    };
  }

  if (
    openingMinutes === null ||
    closingMinutes === null
  ) {
    throw new Error(
      "Business hours are configured incorrectly."
    );
  }

  const current =
    getCurrentTimeInZone(
      now,
      timeZone
    );

  /*
   * YYYY-MM-DD strings can safely
   * be compared chronologically.
   */
  if (pickupDate < current.date) {
    return {
      valid: false,
      error:
        "Pickup date cannot be in the past.",
    };
  }

  if (
    pickupMinutes < openingMinutes
  ) {
    return {
      valid: false,
      error:
        "Pickup time is before business hours.",
    };
  }

  if (
    pickupMinutes > closingMinutes
  ) {
    return {
      valid: false,
      error:
        "Pickup time is after business hours.",
    };
  }

  const isToday =
    pickupDate === current.date;

  if (isToday) {
    const cutoffMinutes =
      convertTimeToMinutes(
        businessHours.cutoffTime
      );

    if (cutoffMinutes === null) {
      throw new Error(
        "Business cutoff time is configured incorrectly."
      );
    }

    if (
      current.minutes >=
      cutoffMinutes
    ) {
      return {
        valid: false,
        error:
          "The cutoff time for same-day orders has passed.",
      };
    }

    if (
      pickupMinutes <=
      current.minutes
    ) {
      return {
        valid: false,
        error:
          "Pickup time must be later than the current time.",
      };
    }
  }

  return {
    valid: true,
  };
}

function convertTimeToMinutes(
  time: string
): number | null {
  const match =
    /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function isValidDateString(
  date: string
): boolean {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      date
    );

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const parsed = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() ===
      month - 1 &&
    parsed.getUTCDate() === day
  );
}

function getCurrentTimeInZone(
  date: Date,
  timeZone: string
) {
  const formatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }
    );

  const parts =
    formatter.formatToParts(date);

  const getPart = (
    type: Intl.DateTimeFormatPartTypes
  ) =>
    parts.find(
      (part) => part.type === type
    )?.value;

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");

  const hour = Number(
    getPart("hour")
  );

  const minute = Number(
    getPart("minute")
  );

  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    throw new Error(
      "Unable to determine current business time."
    );
  }

  return {
    date: `${year}-${month}-${day}`,
    minutes:
      hour * 60 + minute,
  };
}