"use client";

import { useState } from "react";

import { updateBusinessSettings } from "@/actions/business/updateBusinessSettings";

import type {
  BusinessSettingsData,
  DayHours,
} from "../types/businessSettings";

interface BusinessSettingsFormProps {
  settings: BusinessSettingsData;
}

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type DayName =
  (typeof days)[number];

export default function BusinessSettingsForm({
  settings,
}: BusinessSettingsFormProps) {
  const [weeklyHours, setWeeklyHours] =
    useState(settings.weeklyHours);

  function updateDay(
    day: DayName,
    updates: Partial<DayHours>
  ) {
    setWeeklyHours(
      (current) => ({
        ...current,

        [day]: {
          ...current[day],
          ...updates,
        },
      })
    );
  }

  return (
    <form
      action={updateBusinessSettings}
      className="mt-10 space-y-6"
    >
      {/* General Settings */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">
          Business
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-semibold"
            >
              Business Name
            </label>

            <input
              id="businessName"
              name="businessName"
              type="text"
              defaultValue={
                settings.businessName
              }
              required
              className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-semibold"
            >
              Timezone
            </label>

            <input
              id="timezone"
              name="timezone"
              type="text"
              defaultValue={
                settings.timezone
              }
              required
              className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
            />

            <p className="mt-2 text-xs text-foreground/50">
              Example: America/Toronto
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Hours */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">
          Weekly Hours
        </h2>

        <div className="mt-6 divide-y divide-black/10">
          {days.map((day) => {
            const hours =
              weeklyHours[day];

            return (
              <div
                key={day}
                className="grid gap-4 py-5 first:pt-0 sm:grid-cols-[160px_110px_1fr_1fr] sm:items-end"
              >
                {/* Day */}
                <div>
                  <p className="font-semibold">
                    {formatDay(day)}
                  </p>
                </div>

                {/* Open */}
                <label className="flex items-center gap-2 pb-3">
                  <input
                    type="checkbox"
                    name={`${day}.isOpen`}
                    checked={
                      hours.isOpen
                    }
                    onChange={(event) =>
                      updateDay(day, {
                        isOpen:
                          event.target
                            .checked,
                      })
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm">
                    Open
                  </span>
                </label>

                {/* Opening */}
                <div>
                  <label
                    htmlFor={`${day}-opening`}
                    className="block text-sm font-semibold"
                  >
                    Opens
                  </label>

                  <input
                    id={`${day}-opening`}
                    name={`${day}.openingTime`}
                    type="time"
                    value={
                      hours.openingTime
                    }
                    onChange={(event) =>
                      updateDay(day, {
                        openingTime:
                          event.target
                            .value,
                      })
                    }
                    disabled={
                      !hours.isOpen
                    }
                    required={
                      hours.isOpen
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary disabled:opacity-40"
                  />

                  {!hours.isOpen && (
                    <input
                      type="hidden"
                      name={`${day}.openingTime`}
                      value={
                        hours.openingTime
                      }
                    />
                  )}
                </div>

                {/* Closing */}
                <div>
                  <label
                    htmlFor={`${day}-closing`}
                    className="block text-sm font-semibold"
                  >
                    Closes
                  </label>

                  <input
                    id={`${day}-closing`}
                    name={`${day}.closingTime`}
                    type="time"
                    value={
                      hours.closingTime
                    }
                    onChange={(event) =>
                      updateDay(day, {
                        closingTime:
                          event.target
                            .value,
                      })
                    }
                    disabled={
                      !hours.isOpen
                    }
                    required={
                      hours.isOpen
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary disabled:opacity-40"
                  />

                  {!hours.isOpen && (
                    <input
                      type="hidden"
                      name={`${day}.closingTime`}
                      value={
                        hours.closingTime
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Same-day cutoff */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">
          Same-Day Orders
        </h2>

        <div className="mt-5 max-w-sm">
          <label
            htmlFor="sameDayCutoffTime"
            className="block text-sm font-semibold"
          >
            Same-Day Cutoff
          </label>

          <input
            id="sameDayCutoffTime"
            name="sameDayCutoffTime"
            type="time"
            defaultValue={
              settings.sameDayCutoffTime
            }
            required
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
          />

          <p className="mt-2 text-sm text-foreground/50">
            Same-day pickup orders cannot
            be created after this time.
          </p>
        </div>
      </section>

      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-white transition hover:opacity-90 sm:w-auto"
      >
        Save Business Settings
      </button>
    </form>
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