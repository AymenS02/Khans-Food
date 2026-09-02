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
  const [
    weeklyHours,
    setWeeklyHours,
  ] =
    useState(
      settings.weeklyHours
    );

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
      action={
        updateBusinessSettings
      }
      className="mt-10"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
        {/* =====================================
            MAIN SETTINGS
        ===================================== */}

        <div className="min-w-0 space-y-14">
          {/* ===================================
              BUSINESS
          =================================== */}

          <section>
            <SectionHeading
              number="01"
              eyebrow="General"
              title="Business"
              description="Manage the core information used throughout the Khans Food storefront."
            />

            <div className="mt-8 grid gap-6 border-t border-foreground/15 pt-7 sm:grid-cols-2">
              <Field>
                <label
                  htmlFor="businessName"
                  className={
                    labelClassName
                  }
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
                  className={
                    inputClassName
                  }
                />
              </Field>

              <Field>
                <label
                  htmlFor="timezone"
                  className={
                    labelClassName
                  }
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
                  className={
                    inputClassName
                  }
                />

                <p className="mt-2 font-sans text-xs leading-5 text-foreground/40">
                  Example:
                  America/Toronto
                </p>
              </Field>
            </div>
          </section>

          {/* ===================================
              WEEKLY HOURS
          =================================== */}

          <section>
            <SectionHeading
              number="02"
              eyebrow="Schedule"
              title="Weekly Hours"
              description="Set the days and times customers can schedule pickup orders."
            />

            <div className="mt-8 border-t border-foreground/15">
              {days.map(
                (
                  day,
                  index
                ) => {
                  const hours =
                    weeklyHours[
                      day
                    ];

                  return (
                    <div
                      key={
                        day
                      }
                      className="border-b border-foreground/15 py-6"
                    >
                      <div className="grid gap-5 md:grid-cols-[150px_120px_1fr_1fr] md:items-end md:gap-5">
                        {/* DAY */}

                        <div className="flex items-center justify-between md:block">
                          <div>
                            <p className="font-sans text-[10px] font-bold text-primary">
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </p>

                            <p className="mt-1 font-rye text-xl text-foreground">
                              {formatDay(
                                day
                              )}
                            </p>
                          </div>

                          <p
                            className={`font-sans text-[10px] font-bold uppercase tracking-[0.14em] md:hidden ${
                              hours.isOpen
                                ? "text-secondary"
                                : "text-foreground/35"
                            }`}
                          >
                            {hours.isOpen
                              ? "Open"
                              : "Closed"}
                          </p>
                        </div>

                        {/* OPEN TOGGLE */}

                        <div>
                          <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/40">
                            Status
                          </p>

                          <label className="inline-flex min-h-12 cursor-pointer items-center gap-3 border border-foreground/15 px-4">
                            <input
                              type="checkbox"
                              name={`${day}.isOpen`}
                              checked={
                                hours.isOpen
                              }
                              onChange={(
                                event
                              ) =>
                                updateDay(
                                  day,
                                  {
                                    isOpen:
                                      event
                                        .target
                                        .checked,
                                  }
                                )
                              }
                              className="h-4 w-4 accent-primary"
                            />

                            <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em]">
                              {hours.isOpen
                                ? "Open"
                                : "Closed"}
                            </span>
                          </label>
                        </div>

                        {/* OPENING */}

                        <Field>
                          <label
                            htmlFor={`${day}-opening`}
                            className={
                              labelClassName
                            }
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
                            onChange={(
                              event
                            ) =>
                              updateDay(
                                day,
                                {
                                  openingTime:
                                    event
                                      .target
                                      .value,
                                }
                              )
                            }
                            disabled={
                              !hours.isOpen
                            }
                            required={
                              hours.isOpen
                            }
                            className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-foreground/[0.03] disabled:text-foreground/30`}
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
                        </Field>

                        {/* CLOSING */}

                        <Field>
                          <label
                            htmlFor={`${day}-closing`}
                            className={
                              labelClassName
                            }
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
                            onChange={(
                              event
                            ) =>
                              updateDay(
                                day,
                                {
                                  closingTime:
                                    event
                                      .target
                                      .value,
                                }
                              )
                            }
                            disabled={
                              !hours.isOpen
                            }
                            required={
                              hours.isOpen
                            }
                            className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-foreground/[0.03] disabled:text-foreground/30`}
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
                        </Field>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* ===================================
              SAME DAY
          =================================== */}

          <section>
            <SectionHeading
              number="03"
              eyebrow="Ordering"
              title="Same-Day Orders"
              description="Control when customers can no longer place pickup orders for the current day."
            />

            <div className="mt-8 border-y border-foreground/15 py-7">
              <div className="max-w-md">
                <label
                  htmlFor="sameDayCutoffTime"
                  className={
                    labelClassName
                  }
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
                  className={
                    inputClassName
                  }
                />

                <p className="mt-3 font-sans text-xs leading-5 text-foreground/45 sm:text-sm sm:leading-6">
                  Same-day pickup
                  orders cannot be
                  created after this
                  time.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================
            SAVE PANEL
        ===================================== */}

        <aside className="h-fit bg-foreground text-background lg:sticky lg:top-28">
          <div className="p-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Business Settings
            </p>

            <h2 className="mt-3 font-rye text-3xl">
              Save Changes
            </h2>

            <div className="my-6 h-px bg-background/15" />

            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                Business
              </p>

              <p className="mt-2 break-words font-sans text-sm font-semibold">
                {
                  settings.businessName
                }
              </p>
            </div>

            <div className="mt-6 border-t border-background/15 pt-5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                Timezone
              </p>

              <p className="mt-2 break-all font-sans text-xs leading-5 text-background/60">
                {
                  settings.timezone
                }
              </p>
            </div>

            <div className="mt-6 border-t border-background/15 pt-5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                Same-Day Cutoff
              </p>

              <p className="mt-2 font-rye text-xl text-primary">
                {formatTime(
                  settings.sameDayCutoffTime
                )}
              </p>
            </div>

            <div className="mt-7 border-t border-background/15 pt-5">
              <p className="font-sans text-xs leading-5 text-background/45">
                Changes to business
                hours and ordering
                rules affect the
                pickup options shown
                to customers.
              </p>
            </div>

            <button
              type="submit"
              className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Save Settings

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}

/* =============================================
   SECTION HEADING
============================================= */

function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[50px_1fr] sm:gap-6">
      <p className="pt-1 font-sans text-[10px] font-bold text-primary">
        {number}
      </p>

      <div>
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>

        <h2 className="mt-2 font-rye text-3xl text-foreground sm:text-4xl">
          {title}
        </h2>

        <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-foreground/50">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =============================================
   FIELD
============================================= */

function Field({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

/* =============================================
   HELPERS
============================================= */

function formatDay(
  day: string
) {
  return (
    day
      .charAt(0)
      .toUpperCase() +
    day.slice(1)
  );
}

function formatTime(
  value: string
) {
  const [
    hour,
    minute,
  ] =
    value
      .split(":")
      .map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(
    new Date(
      Date.UTC(
        2025,
        0,
        1,
        hour,
        minute
      )
    )
  );
}

const labelClassName =
  "block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45";

const inputClassName =
  "mt-2 min-h-12 w-full border border-foreground/20 bg-transparent px-4 py-3 font-sans text-sm text-foreground outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";