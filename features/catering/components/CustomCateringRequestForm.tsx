"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  } = useForm<CustomCateringContactData>({
    resolver: zodResolver(
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

        items: selectedItems.map(
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

  /* ============================================
     SUCCESS STATE
  ============================================ */

  if (submittedRequest) {
    return (
      <section
        role="status"
        className="border-y border-secondary/30 bg-secondary/[0.08] py-8 sm:px-6 sm:py-10"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-secondary font-sans text-sm font-bold text-white">
            ✓
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Request Received
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
              Your Feast Is in Review.
            </h2>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px w-14 bg-foreground/20" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="max-w-xl font-sans text-sm leading-6 text-foreground/60 sm:text-base">
              Your custom catering
              request has been received.
              Khans Food will review the
              details and confirm final
              pricing before payment is
              required.
            </p>

            {/* ESTIMATED SUBTOTAL */}

            {submittedRequest.estimatedSubtotal !==
              undefined && (
              <div className="mt-8 border-t border-foreground/15 pt-6">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                  Estimated Subtotal
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {submittedRequest.estimatedSubtotal.toFixed(
                    2
                  )}
                </p>

                <p className="mt-2 max-w-md font-sans text-xs leading-5 text-foreground/45">
                  This is an estimate
                  only. Final pricing
                  will be confirmed
                  after your request is
                  reviewed.
                </p>
              </div>
            )}

            {/* REQUEST ID */}

            <div className="mt-6 border-t border-foreground/15 pt-6">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                Request ID
              </p>

              <p className="mt-2 break-all font-mono text-xs font-semibold leading-5 text-foreground/65">
                {
                  submittedRequest.id
                }
              </p>
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
      {/* =========================================
          CONTACT DETAILS
      ========================================= */}

      <section>
        <div className="mb-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Your Details
          </p>

          <h3 className="mt-2 font-rye text-2xl text-foreground sm:text-3xl">
            Who Should We Contact?
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* FIRST NAME */}

          <Field
            label="First Name"
            id="firstName"
            error={
              errors.firstName
                ?.message
            }
          >
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register(
                "firstName"
              )}
              className={
                inputClassName
              }
            />
          </Field>

          {/* LAST NAME */}

          <Field
            label="Last Name"
            id="lastName"
            error={
              errors.lastName
                ?.message
            }
          >
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register(
                "lastName"
              )}
              className={
                inputClassName
              }
            />
          </Field>

          {/* EMAIL */}

          <Field
            label="Email"
            id="email"
            error={
              errors.email
                ?.message
            }
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register(
                "email"
              )}
              className={
                inputClassName
              }
            />
          </Field>

          {/* PHONE */}

          <Field
            label="Phone"
            id="phone"
            error={
              errors.phone
                ?.message
            }
          >
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register(
                "phone"
              )}
              className={
                inputClassName
              }
            />
          </Field>
        </div>
      </section>

      {/* =========================================
          EVENT DETAILS
      ========================================= */}

      <section className="border-t border-foreground/15 pt-8">
        <div className="mb-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Your Event
          </p>

          <h3 className="mt-2 font-rye text-2xl text-foreground sm:text-3xl">
            Tell Us the Details.
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* EVENT DATE */}

          <Field
            label="Event Date"
            id="eventDate"
            error={
              errors.eventDate
                ?.message
            }
          >
            <input
              id="eventDate"
              type="date"
              {...register(
                "eventDate"
              )}
              className={
                inputClassName
              }
            />
          </Field>

          {/* GUEST COUNT */}

          <div>
            <p className={labelClassName}>
              Guest Count
            </p>

            <div className="mt-2 flex min-h-12 items-center border border-foreground/15 bg-foreground/[0.025] px-4">
              <span className="font-rye text-xl text-primary">
                {guestCount}
              </span>

              <span className="ml-2 font-sans text-xs text-foreground/40">
                guests
              </span>
            </div>
          </div>
        </div>

        {/* NOTES */}

        <div className="mt-6">
          <Field
            label="Event Notes"
            id="notes"
            error={
              errors.notes
                ?.message
            }
          >
            <textarea
              id="notes"
              rows={5}
              {...register(
                "notes"
              )}
              placeholder="Tell us anything we should know about your event."
              className={`${inputClassName} min-h-32 resize-y`}
            />
          </Field>
        </div>
      </section>

      {/* =========================================
          REQUEST SUMMARY
      ========================================= */}

      <section className="border-y border-foreground/15 py-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className={labelClassName}>
              Guests
            </p>

            <p className="mt-2 font-rye text-2xl text-foreground">
              {guestCount}
            </p>
          </div>

          <div>
            <p className={labelClassName}>
              Selected Dishes
            </p>

            <p className="mt-2 font-rye text-2xl text-foreground">
              {selectedItems.length}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          SERVER ERROR
      ========================================= */}

      {errors.root?.message && (
        <div
          role="alert"
          className="border border-accent/30 bg-accent/10 px-4 py-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-accent/30 font-sans text-xs font-bold text-accent">
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

      <div>
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
              : "Submit Catering Request"}
          </span>

          {!isSubmitting && (
            <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        <div className="mt-4 flex items-start justify-center gap-2">
          <span className="mt-0.5 text-[10px] text-primary">
            ◆
          </span>

          <p className="max-w-md text-center font-sans text-xs leading-5 text-foreground/45">
            No payment is required
            until your request has
            been reviewed and
            approved.
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
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={
          labelClassName
        }
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
   STYLES
============================================= */

const labelClassName =
  "block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45";

const inputClassName =
  "min-h-12 w-full border border-foreground/20 bg-transparent px-4 py-3 font-sans text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";