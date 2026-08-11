import { NextResponse } from "next/server";

import { getBusinessHoursForDate } from "@/features/checkout/services/getBusinessHoursForDate";
import { validatePickup } from "@/features/checkout/services/validatePickup";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const pickupDate =
      searchParams.get("date");

    if (!pickupDate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Pickup date is required.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      businessHours,
      timeZone,
    } =
      await getBusinessHoursForDate(
        pickupDate
      );

    if (!businessHours.isOpen) {
      return NextResponse.json({
        success: true,
        times: [],
        message:
          "The restaurant is closed on this day.",
      });
    }

    const possibleTimes =
      generateTimeSlots(
        businessHours.openingTime,
        businessHours.closingTime,
        30
      );

    const validTimes =
      possibleTimes.filter(
        (pickupTime) => {
          const result =
            validatePickup({
              pickupDate,
              pickupTime,
              businessHours,
              timeZone,
            });

          return result.valid;
        }
      );

    return NextResponse.json({
      success: true,
      times: validTimes,
      message:
        validTimes.length === 0
          ? "No pickup times are available for this day."
          : undefined,
    });
  } catch (error) {
    console.error(
      "Pickup times error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load pickup times.",
      },
      {
        status: 500,
      }
    );
  }
}

function generateTimeSlots(
  openingTime: string,
  closingTime: string,
  intervalMinutes: number
): string[] {
  const openingMinutes =
    timeToMinutes(openingTime);

  const closingMinutes =
    timeToMinutes(closingTime);

  const times: string[] = [];

  for (
    let minutes = openingMinutes;
    minutes <= closingMinutes;
    minutes += intervalMinutes
  ) {
    times.push(
      minutesToTime(minutes)
    );
  }

  return times;
}

function timeToMinutes(
  time: string
) {
  const [hours, minutes] =
    time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(
  totalMinutes: number
) {
  const hours = Math.floor(
    totalMinutes / 60
  );

  const minutes =
    totalMinutes % 60;

  return `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}