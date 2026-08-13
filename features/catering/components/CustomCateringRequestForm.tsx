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

import { createCustomCateringRequest } from "@/actions/catering/createCustomCateringRequest";

import {
  customCateringContactSchema,
  type CustomCateringContactData,
} from "../validators/customCateringRequestSchema";

interface SelectedItem {
  id: string;
  quantity: number;
}

interface CustomCateringRequestFormProps {
  guestCount: number;
  selectedItems: SelectedItem[];
}

export default function CustomCateringRequestForm({
  guestCount,
  selectedItems,
}: CustomCateringRequestFormProps) {
  const [
    submittedRequest,
    setSubmittedRequest,
  ] = useState<{
    id: string;
    estimatedSubtotal?: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setError,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<CustomCateringContactData>({
      resolver:
        zodResolver(
          customCateringContactSchema
        ),

      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eventDate: "",
        notes: "",
      },
    });

  async function onSubmit(
    data: CustomCateringContactData
  ) {
    const result =
      await createCustomCateringRequest({
        ...data,

        guestCount,

        items:
          selectedItems.map(
            (item) => ({
              cateringItemId:
                item.id,

              quantity:
                item.quantity,
            })
          ),
      });

    if (
      !result.success ||
      !result.requestId
    ) {
      setError("root", {
        type: "server",

        message:
          result.error ??
          "Unable to submit catering request.",
      });

      return;
    }

    setSubmittedRequest({
      id:
        result.requestId,

      estimatedSubtotal:
        result.estimatedSubtotal,
    });
  }

  if (submittedRequest) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-secondary/20 bg-secondary/10 p-6"
      >
        <h2 className="text-2xl font-bold text-foreground">
          Request Submitted
        </h2>

        <p className="mt-3 text-foreground/70">
          Your custom catering request
          has been received and is
          waiting for review.
        </p>

        {submittedRequest.estimatedSubtotal !==
          undefined && (
          <div className="mt-5 rounded-xl bg-white/70 p-4">
            <p className="text-sm text-foreground/50">
              Estimated Subtotal
            </p>

            <p className="mt-1 text-2xl font-bold text-primary">
              $
              {submittedRequest.estimatedSubtotal.toFixed(
                2
              )}
            </p>

            <p className="mt-1 text-xs text-foreground/50">
              Final pricing will be
              confirmed after review.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-xl bg-white/70 p-4">
          <p className="text-xs text-foreground/50">
            Request ID
          </p>

          <p className="mt-1 break-all font-mono text-xs font-semibold">
            {submittedRequest.id}
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
      <div className="grid gap-5 sm:grid-cols-2">
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
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
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
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
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
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
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
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
        />

        {errors.phone && (
          <p className="mt-2 text-sm text-accent">
            {errors.phone.message}
          </p>
        )}
      </div>

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
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
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
          className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3"
        />

        {errors.notes && (
          <p className="mt-2 text-sm text-accent">
            {errors.notes.message}
          </p>
        )}
      </div>

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

      <p className="text-center text-xs text-foreground/50">
        No payment is required until
        your request has been reviewed
        and approved.
      </p>
    </form>
  );
}