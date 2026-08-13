"use client";

import {
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

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
  ] =
    useState<string | null>(
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
      <div
        role="status"
        className="rounded-2xl border border-secondary/20 bg-secondary/10 p-6"
      >
        <h2 className="text-xl font-bold text-foreground">
          Request Submitted
        </h2>

        <p className="mt-3 text-sm leading-6 text-foreground/70">
          Your catering request has been
          received and is waiting for
          review.
        </p>

        <div className="mt-4 rounded-xl bg-white/70 p-3">
          <p className="text-xs text-foreground/50">
            Request ID
          </p>

          <p className="mt-1 break-all font-mono text-xs font-semibold">
            {submittedRequestId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-5"
    >
      <input
        type="hidden"
        {...register("packageId")}
      />

      {/* Contact */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold"
          >
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            {...register(
              "firstName"
            )}
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
          />

          {errors.firstName && (
            <p className="mt-2 text-sm text-accent">
              {
                errors.firstName
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold"
          >
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            {...register(
              "lastName"
            )}
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
          />

          {errors.lastName && (
            <p className="mt-2 text-sm text-accent">
              {
                errors.lastName
                  .message
              }
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
        />

        {errors.email && (
          <p className="mt-2 text-sm text-accent">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold"
        >
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
        />

        {errors.phone && (
          <p className="mt-2 text-sm text-accent">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Event */}
      <div>
        <label
          htmlFor="eventDate"
          className="block text-sm font-semibold"
        >
          Event Date
        </label>

        <input
          id="eventDate"
          type="date"
          {...register(
            "eventDate"
          )}
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
        />

        {errors.eventDate && (
          <p className="mt-2 text-sm text-accent">
            {
              errors.eventDate
                .message
            }
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="guestCount"
          className="block text-sm font-semibold"
        >
          Guest Count
        </label>

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
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
        />

        {(minimumGuests ||
          maximumGuests) && (
          <p className="mt-2 text-xs text-foreground/50">
            {formatGuestRequirement(
              minimumGuests,
              maximumGuests
            )}
          </p>
        )}

        {errors.guestCount && (
          <p className="mt-2 text-sm text-accent">
            {
              errors.guestCount
                .message
            }
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-semibold"
        >
          Event Notes
        </label>

        <textarea
          id="notes"
          rows={4}
          {...register("notes")}
          placeholder="Tell us anything we should know about your event."
          className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
        />

        {errors.notes && (
          <p className="mt-2 text-sm text-accent">
            {errors.notes.message}
          </p>
        )}
      </div>

      {/* Server error */}
      {errors.root?.message && (
        <div
          role="alert"
          className="rounded-xl border border-accent/20 bg-accent/10 px-4 py-3"
        >
          <p className="text-sm font-medium text-accent">
            {
              errors.root
                .message
            }
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Submitting..."
          : "Submit Catering Request"}
      </button>

      <p className="text-center text-xs leading-5 text-foreground/50">
        Submitting a request does not
        require payment. The request
        will be reviewed before it is
        approved.
      </p>
    </form>
  );
}

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