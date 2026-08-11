"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BusinessSettings from "@/models/BusinessSettings";

import { businessSettingsSchema } from "@/features/business/validators/businessSettingsSchema";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export async function updateBusinessSettings(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const weeklyHours = Object.fromEntries(
    days.map((day) => [
      day,
      {
        isOpen:
          formData.get(
            `${day}.isOpen`
          ) === "on",

        openingTime:
          formData.get(
            `${day}.openingTime`
          ),

        closingTime:
          formData.get(
            `${day}.closingTime`
          ),
      },
    ])
  );

  const parsed =
    businessSettingsSchema.safeParse({
      businessName:
        formData.get("businessName"),

      timezone:
        formData.get("timezone"),

      sameDayCutoffTime:
        formData.get(
          "sameDayCutoffTime"
        ),

      weeklyHours,
    });

  if (!parsed.success) {
    console.error(
      "Business settings validation:",
      parsed.error.flatten()
    );

    throw new Error(
      "Invalid business settings."
    );
  }

  /*
   * Make sure an open day has a
   * sensible opening/closing range.
   */
  for (const day of days) {
    const hours =
      parsed.data.weeklyHours[day];

    if (
      hours.isOpen &&
      hours.openingTime >=
        hours.closingTime
    ) {
      throw new Error(
        `${formatDay(
          day
        )}: closing time must be after opening time.`
      );
    }
  }

  await connectToDatabase();

  const settings =
    await BusinessSettings.findOne();

  if (!settings) {
    throw new Error(
      "Business settings have not been configured."
    );
  }

  settings.businessName =
    parsed.data.businessName;

  settings.timezone =
    parsed.data.timezone;

  settings.sameDayCutoffTime =
    parsed.data.sameDayCutoffTime;

  settings.weeklyHours =
    parsed.data.weeklyHours;

  await settings.save();

  revalidatePath(
    "/admin/settings"
  );

  redirect(
    "/admin/settings?saved=1"
  );
}

function formatDay(
  day: string
) {
  return (
    day.charAt(0).toUpperCase() +
    day.slice(1)
  );
}