import { BusinessHours } from "../types/businessHours";

interface ValidatePickupParams {
  pickupDate: string;
  pickupTime: string;
  businessHours: BusinessHours;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePickup({
  pickupDate,
  pickupTime,
  businessHours,
}: ValidatePickupParams): ValidationResult {
  if (!businessHours.isOpen) {
    return {
      valid: false,
      error: "The restaurant is closed on this day.",
    };
  }

  const currentDate = new Date();

  const requestedDate = new Date(`${pickupDate}T00:00:00`);

  if (Number.isNaN(requestedDate.getTime())) {
    return {
      valid: false,
      error: "Invalid pickup date.",
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (requestedDate < today) {
    return {
      valid: false,
      error: "Pickup date cannot be in the past.",
    };
  }

  const pickupMinutes = convertTimeToMinutes(pickupTime);
  const openingMinutes = convertTimeToMinutes(
    businessHours.openingTime
  );
  const closingMinutes = convertTimeToMinutes(
    businessHours.closingTime
  );

  if (pickupMinutes < openingMinutes) {
    return {
      valid: false,
      error: "Pickup time is before business hours.",
    };
  }

  if (pickupMinutes > closingMinutes) {
    return {
      valid: false,
      error: "Pickup time is after business hours.",
    };
  }

  const isToday =
    requestedDate.getTime() === today.getTime();

  if (isToday) {
    const currentMinutes =
      currentDate.getHours() * 60 +
      currentDate.getMinutes();

    const cutoffMinutes = convertTimeToMinutes(
      businessHours.cutoffTime
    );

    if (currentMinutes >= cutoffMinutes) {
      return {
        valid: false,
        error: "The cutoff time for same-day orders has passed.",
      };
    }

    if (pickupMinutes <= currentMinutes) {
      return {
        valid: false,
        error: "Pickup time must be later than the current time.",
      };
    }
  }

  return {
    valid: true,
  };
}

function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}