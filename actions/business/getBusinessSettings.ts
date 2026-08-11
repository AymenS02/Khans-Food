"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BusinessSettings from "@/models/BusinessSettings";

import type { BusinessSettingsData } from "@/features/business/types/businessSettings";

export async function getBusinessSettings(): Promise<BusinessSettingsData> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  await connectToDatabase();

  const settings =
    await BusinessSettings.findOne().lean();

  if (!settings) {
    throw new Error(
      "Business settings have not been configured."
    );
  }

  return {
    id: settings._id.toString(),

    businessName:
      settings.businessName,

    timezone:
      settings.timezone,

    sameDayCutoffTime:
      settings.sameDayCutoffTime,

    weeklyHours: {
      sunday: {
        isOpen:
          settings.weeklyHours.sunday
            .isOpen,

        openingTime:
          settings.weeklyHours.sunday
            .openingTime,

        closingTime:
          settings.weeklyHours.sunday
            .closingTime,
      },

      monday: {
        isOpen:
          settings.weeklyHours.monday
            .isOpen,

        openingTime:
          settings.weeklyHours.monday
            .openingTime,

        closingTime:
          settings.weeklyHours.monday
            .closingTime,
      },

      tuesday: {
        isOpen:
          settings.weeklyHours.tuesday
            .isOpen,

        openingTime:
          settings.weeklyHours.tuesday
            .openingTime,

        closingTime:
          settings.weeklyHours.tuesday
            .closingTime,
      },

      wednesday: {
        isOpen:
          settings.weeklyHours.wednesday
            .isOpen,

        openingTime:
          settings.weeklyHours.wednesday
            .openingTime,

        closingTime:
          settings.weeklyHours.wednesday
            .closingTime,
      },

      thursday: {
        isOpen:
          settings.weeklyHours.thursday
            .isOpen,

        openingTime:
          settings.weeklyHours.thursday
            .openingTime,

        closingTime:
          settings.weeklyHours.thursday
            .closingTime,
      },

      friday: {
        isOpen:
          settings.weeklyHours.friday
            .isOpen,

        openingTime:
          settings.weeklyHours.friday
            .openingTime,

        closingTime:
          settings.weeklyHours.friday
            .closingTime,
      },

      saturday: {
        isOpen:
          settings.weeklyHours.saturday
            .isOpen,

        openingTime:
          settings.weeklyHours.saturday
            .openingTime,

        closingTime:
          settings.weeklyHours.saturday
            .closingTime,
      },
    },
  };
}