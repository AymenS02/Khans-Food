"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPackageCateringRequest } from "@/actions/catering/createPackageCateringRequest";

import {
  packageCateringRequestSchema,
  type PackageCateringRequestInput,
} from "../validators/packageCateringRequestSchema";

interface PackageCateringRequestFormProps {
  packageId: string;
  minimumGuests?: number;
  maximumGuests?: number;
}

export default function PackageCateringRequestForm({
  packageId,
  minimumGuests,
  maximumGuests,
}: PackageCateringRequestFormProps) {
  const [
    submittedRequestId,
    setSubmittedRequestId,
  ] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setError,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<PackageCateringRequestInput>({
      resolver:
        zodResolver(
          packageCateringRequestSchema
        ),

      defaultValues: {
        packageId,

        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        eventDate: "",

        guestCount:
          minimumGuests ?? 1,

        notes: "",
      },
    });

  async function onSubmit(
    data: PackageCateringRequestInput
  ) {
    const result =
      await createPackageCateringRequest(
        data
      );

    if (!result.success) {
      setError("root", {
        type: "server",

        message:
          result.error ??
          "Unable to submit catering request.",
      });

      return;
    }

    if (!result.requestId) {
      setError("root", {
        type: "server",

        message:
          "Unable to create catering request.",
      });

      return;
    }

    setSubmittedRequestId(
      result.requestId
    );
  }

  /*
   * Replace the form with confirmation
   * after successful submission.
   */
  if (submittedRequestId) {
    return (
      <section
        role="status"
        className="border-y border-secondary/30 bg-secondary/[0.08] py-7 sm:px-5 sm:py-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-secondary font-sans text-sm font-bold text-white">
            ✓
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              Request Received
            </p>

            <h2 className="mt-2 font-rye text-2xl leading-tight text-foreground sm:text-3xl">
              Request Submitted
            </h2>

            <p className="mt-4 font-sans text-sm leading-6 text-foreground/60">
              Your catering request
              has been received and is
              waiting for review.
            </p>

            <div className="mt-6 border-t border-foreground/15 pt-5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                Request ID
              </p>

              <p className="mt-2 break-all font-mono text-xs font-semibold leading-5 text-foreground/65">
                {
                  submittedRequestId
                }
              </p>
            </div>

            <div className="mt-6 border-t border-foreground/15 pt-5">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 text-xs text-primary"
                >
                  ◆
                </span>

                <p className="font-sans text-xs leading-5 text-foreground/45">
                  No payment is required
                  until your request has
                  been reviewed and
                  approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-8"
    >
      <input
        type="hidden"
        {...register("packageId")}
      />

      {/* =========================================
          CONTACT
      ========================================= */}

      <section>
        <div className="mb-6">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Your Details
          </p>

          <h3 className="mt-2 font-rye text-2xl text-background">
            Who Should We Contact?
          </h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Field
            label="First Name"
            id="firstName"
            error={
              errors.firstName
                ?.message
            }
            dark
          >
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register(
                "firstName"
              )}
              className={
                darkInputClassName
              }
            />
          </Field>

          <Field
            label="Last Name"
            id="lastName"
            error={
              errors.lastName
                ?.message
            }
            dark
          >
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register(
                "lastName"
              )}
              className={
                darkInputClassName
              }
            />
          </Field>
        </div>

        <div className="mt-5 space-y-5">
          <Field
            label="Email"
            id="email"
            error={
              errors.email
                ?.message
            }
            dark
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register(
                "email"
              )}
              className={
                darkInputClassName
              }
            />
          </Field>

          <Field
            label="Phone"
            id="phone"
            error={
              errors.phone
                ?.message
            }
            dark
          >
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register(
                "phone"
              )}
              className={
                darkInputClassName
              }
            />
          </Field>
        </div>
      </section>

      {/* =========================================
          EVENT
      ========================================= */}

      <section className="border-t border-background/15 pt-7">
        <div className="mb-6">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            Your Event
          </p>

          <h3 className="mt-2 font-rye text-2xl text-background">
            Tell Us the Details.
          </h3>
        </div>

        <div className="space-y-5">
          {/* EVENT DATE */}

          <Field
            label="Event Date"
            id="eventDate"
            error={
              errors.eventDate
                ?.message
            }
            dark
          >
            <input
              id="eventDate"
              type="date"
              {...register(
                "eventDate"
              )}
              className={
                darkInputClassName
              }
            />
          </Field>

          {/* GUEST COUNT */}

          <Field
            label="Guest Count"
            id="guestCount"
            error={
              errors.guestCount
                ?.message
            }
            dark
          >
            <input
              id="guestCount"
              type="number"
              min={
                minimumGuests ?? 1
              }
              max={
                maximumGuests
              }
              {...register(
                "guestCount",
                {
                  valueAsNumber: true,
                }
              )}
              className={
                darkInputClassName
              }
            />

            {(minimumGuests ||
              maximumGuests) && (
              <p className="mt-2 font-sans text-xs leading-5 text-background/40">
                {formatGuestRequirement(
                  minimumGuests,
                  maximumGuests
                )}
              </p>
            )}
          </Field>

          {/* NOTES */}

          <Field
            label="Event Notes"
            id="notes"
            error={
              errors.notes
                ?.message
            }
            dark
          >
            <textarea
              id="notes"
              rows={5}
              {...register(
                "notes"
              )}
              placeholder="Tell us anything we should know about your event."
              className={`${darkInputClassName} min-h-32 resize-y`}
            />
          </Field>
        </div>
      </section>

      {/* =========================================
          SERVER ERROR
      ========================================= */}

      {errors.root?.message && (
        <div
          role="alert"
          className="border border-accent/40 bg-accent/10 px-4 py-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-accent/40 font-sans text-xs font-bold text-accent">
              !
            </span>

            <p className="font-sans text-sm leading-6 text-accent">
              {
                errors.root
                  .message
              }
            </p>
          </div>
        </div>
      )}

      {/* =========================================
          SUBMIT
      ========================================= */}

      <div className="border-t border-background/15 pt-6">
        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="group flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>
            {isSubmitting
              ? "Submitting..."
              : "Submit Request"}
          </span>

          {!isSubmitting && (
            <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        <div className="mt-4 flex items-start justify-center gap-2">
          <span
            aria-hidden="true"
            className="mt-0.5 text-[9px] text-primary"
          >
            ◆
          </span>

          <p className="max-w-xs text-center font-sans text-xs leading-5 text-background/40">
            No payment is required
            until your request has been
            reviewed and approved.
          </p>
        </div>
      </div>
    </form>
  );
}

/* =============================================
   FIELD
============================================= */

function Field({
  label,
  id,
  error,
  dark = false,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] ${
          dark
            ? "text-background/45"
            : "text-foreground/45"
        }`}
      >
        {label}
      </label>

      <div className="mt-2">
        {children}
      </div>

      {error && (
        <p className="mt-2 font-sans text-xs font-medium leading-5 text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

/* =============================================
   HELPERS
============================================= */

function formatGuestRequirement(
  minimum?: number,
  maximum?: number
) {
  if (
    minimum &&
    maximum
  ) {
    return `${minimum}–${maximum} guests`;
  }

  if (minimum) {
    return `Minimum ${minimum} guests`;
  }

  if (maximum) {
    return `Maximum ${maximum} guests`;
  }

  return "";
}

const darkInputClassName =
  "min-h-12 w-full border border-background/20 bg-transparent px-4 py-3 font-sans text-sm text-background outline-none transition placeholder:text-background/25 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40";