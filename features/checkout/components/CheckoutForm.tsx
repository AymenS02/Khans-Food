"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCartStore } from "@/stores/cartStore";

import {
  checkoutSchema,
  CheckoutFormData,
} from "../validators/checkoutSchema";

import { formatPickupTime } from "../utils/formatPickupTime";

export default function CheckoutForm() {
  const router =
    useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    watch,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(
      checkoutSchema
    ),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pickupDate: "",
      pickupTime: "",
      notes: "",
    },
  });

  const pickupDate =
    watch("pickupDate");

  const [
    availablePickupTimes,
    setAvailablePickupTimes,
  ] =
    useState<string[]>([]);

  const [
    isLoadingPickupTimes,
    setIsLoadingPickupTimes,
  ] =
    useState(false);

  const [
    pickupTimesError,
    setPickupTimesError,
  ] =
    useState<
      string | null
    >(null);

  const items =
    useCartStore(
      (state) =>
        state.items
    );

  /*
   * ==========================================
   * LOAD PICKUP TIMES
   * ==========================================
   */

  useEffect(() => {
    if (!pickupDate) {
      setAvailablePickupTimes(
        []
      );

      setPickupTimesError(
        null
      );

      setValue(
        "pickupTime",
        ""
      );

      return;
    }

    const controller =
      new AbortController();

    async function loadPickupTimes() {
      try {
        setIsLoadingPickupTimes(
          true
        );

        setPickupTimesError(
          null
        );

        /*
         * Clear the previously selected
         * time whenever the date changes.
         */
        setValue(
          "pickupTime",
          ""
        );

        const response =
          await fetch(
            `/api/pickup-times?date=${encodeURIComponent(
              pickupDate
            )}`,
            {
              signal:
                controller.signal,
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          setAvailablePickupTimes(
            []
          );

          setPickupTimesError(
            result.error ??
              "Unable to load pickup times."
          );

          return;
        }

        setAvailablePickupTimes(
          result.times
        );

        if (
          result.times.length ===
          0
        ) {
          setPickupTimesError(
            result.message ??
              "No pickup times are available."
          );
        }
      } catch (error) {
        if (
          error instanceof
            DOMException &&
          error.name ===
            "AbortError"
        ) {
          return;
        }

        console.error(
          "Unable to load pickup times:",
          error
        );

        setAvailablePickupTimes(
          []
        );

        setPickupTimesError(
          "Unable to load pickup times."
        );
      } finally {
        setIsLoadingPickupTimes(
          false
        );
      }
    }

    loadPickupTimes();

    return () => {
      controller.abort();
    };
  }, [
    pickupDate,
    setValue,
  ]);

  /*
   * ==========================================
   * SUBMIT
   * ==========================================
   */

  const onSubmit =
    async (
      data: CheckoutFormData
    ) => {
      clearErrors(
        "root"
      );

      /*
       * Convert Zustand cart items into the
       * structure expected by our checkout API.
       */
      const cartItems =
        items.map(
          (item) => ({
            menuItemId:
              item.id,

            quantity:
              item.quantity,
          })
        );

      if (
        cartItems.length ===
        0
      ) {
        setError(
          "root",
          {
            type: "server",

            message:
              "Your cart is empty.",
          }
        );

        return;
      }

      /*
       * Represents the exact checkout the
       * customer is currently trying to make.
       */
      const checkoutPayload =
        {
          ...data,
          items:
            cartItems,
        };

      /*
       * Used to detect whether the checkout
       * contents changed since the last submit.
       */
      const checkoutSignature =
        JSON.stringify(
          checkoutPayload
        );

      /*
       * Look for a previous checkout attempt.
       */
      const storedAttempt =
        sessionStorage.getItem(
          "checkoutAttempt"
        );

      let checkoutAttemptId:
        string;

      if (
        storedAttempt
      ) {
        try {
          const parsed =
            JSON.parse(
              storedAttempt
            );

          if (
            parsed.signature ===
              checkoutSignature &&
            typeof parsed.id ===
              "string"
          ) {
            /*
             * Exact same checkout:
             * reuse the attempt ID.
             */
            checkoutAttemptId =
              parsed.id;
          } else {
            /*
             * Checkout changed:
             * create a new attempt.
             */
            checkoutAttemptId =
              crypto.randomUUID();
          }
        } catch {
          /*
           * Invalid stored data:
           * start a new attempt.
           */
          checkoutAttemptId =
            crypto.randomUUID();
        }
      } else {
        /*
         * First checkout attempt.
         */
        checkoutAttemptId =
          crypto.randomUUID();
      }

      /*
       * Save the checkout ATTEMPT here.
       */
      sessionStorage.setItem(
        "checkoutAttempt",
        JSON.stringify({
          id:
            checkoutAttemptId,

          signature:
            checkoutSignature,
        })
      );

      try {
        const response =
          await fetch(
            "/api/checkout",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    ...checkoutPayload,
                    checkoutAttemptId,
                  }
                ),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          setError(
            "root",
            {
              type:
                "server",

              message:
                result.error ??
                "Unable to create checkout.",
            }
          );

          return;
        }

        /*
         * Validate the values required by the
         * Stripe payment page and secure
         * success page.
         */
        if (
          typeof result.orderId !==
            "string" ||
          typeof result.clientSecret !==
            "string" ||
          typeof result.successAccessToken !==
            "string"
        ) {
          setError(
            "root",
            {
              type:
                "server",

              message:
                "Invalid checkout response.",
            }
          );

          return;
        }

        /*
         * Only AFTER a successful server
         * response do we save payment data.
         */
        sessionStorage.setItem(
          "checkoutPayment",
          JSON.stringify({
            orderId:
              result.orderId,

            clientSecret:
              result.clientSecret,

            successAccessToken:
              result.successAccessToken,
          })
        );

        router.push(
          "/checkout/payment"
        );
      } catch (error) {
        console.error(
          "Checkout request failed:",
          error
        );

        setError(
          "root",
          {
            type:
              "server",

            message:
              "Something went wrong. Please try again.",
          }
        );
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit(
          onSubmit
        )
      }
      className="space-y-14"
    >
      {/* =========================================
          CONTACT INFORMATION
      ========================================= */}

      <section>
        <SectionHeading
          number="01"
          eyebrow="Contact"
          title="Your Information"
          description="Tell us who this order belongs to so we can keep your pickup details connected."
        />

        <div className="mt-8 grid gap-6 border-t border-foreground/15 pt-7 sm:grid-cols-2">
          {/* FIRST NAME */}

          <Field
            label="First Name"
            id="firstName"
            error={
              errors
                .firstName
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
              errors
                .lastName
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
          PICKUP INFORMATION
      ========================================= */}

      <section>
        <SectionHeading
          number="02"
          eyebrow="Pickup"
          title="When Should It Be Ready?"
          description="Choose your pickup date first and we'll show the available times for that day."
        />

        <div className="mt-8 border-t border-foreground/15 pt-7">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* PICKUP DATE */}

            <Field
              label="Pickup Date"
              id="pickupDate"
              error={
                errors
                  .pickupDate
                  ?.message
              }
            >
              <input
                id="pickupDate"
                type="date"
                {...register(
                  "pickupDate"
                )}
                className={
                  inputClassName
                }
              />
            </Field>

            {/* PICKUP TIME */}

            <Field
              label="Pickup Time"
              id="pickupTime"
              error={
                errors
                  .pickupTime
                  ?.message
              }
            >
              <select
                id="pickupTime"
                {...register(
                  "pickupTime"
                )}
                disabled={
                  !pickupDate ||
                  isLoadingPickupTimes ||
                  availablePickupTimes.length ===
                    0
                }
                className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-foreground/[0.03] disabled:text-foreground/35`}
              >
                <option value="">
                  {isLoadingPickupTimes
                    ? "Loading times..."
                    : !pickupDate
                      ? "Select a date first"
                      : availablePickupTimes.length ===
                          0
                        ? "No times available"
                        : "Select a pickup time"}
                </option>

                {availablePickupTimes.map(
                  (
                    time
                  ) => (
                    <option
                      key={
                        time
                      }
                      value={
                        time
                      }
                    >
                      {formatPickupTime(
                        time
                      )}
                    </option>
                  )
                )}
              </select>

              {pickupTimesError && (
                <p className="mt-2 font-sans text-xs font-medium leading-5 text-accent">
                  {
                    pickupTimesError
                  }
                </p>
              )}
            </Field>
          </div>

          {/* PICKUP INFORMATION */}

          <div className="mt-7 border-y border-foreground/15 py-5">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-foreground/15 font-sans text-[10px] text-primary"
              >
                ◆
              </span>

              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-foreground/60">
                  Pickup Scheduling
                </p>

                <p className="mt-1 max-w-xl font-sans text-xs leading-5 text-foreground/45 sm:text-sm sm:leading-6">
                  Available pickup
                  times are based on
                  business hours and
                  same-day ordering
                  rules for your
                  selected date.
                </p>
              </div>
            </div>
          </div>

          {/* NOTES */}

          <div className="mt-7">
            <Field
              label="Order Notes"
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
                placeholder="Anything we should know about your order?"
                className={`${inputClassName} min-h-32 resize-y`}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* =========================================
          CART INFO
      ========================================= */}

      <section className="border-y border-foreground/15 py-7">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className={
              labelClassName
            }>
              Order Items
            </p>

            <p className="mt-2 font-rye text-2xl text-foreground">
              {items.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  item.quantity,
                0
              )}
            </p>
          </div>

          <div>
            <p className={
              labelClassName
            }>
              Next Step
            </p>

            <p className="mt-2 font-rye text-2xl text-foreground">
              Secure Payment
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          ROOT ERROR
      ========================================= */}

      {errors.root
        ?.message && (
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
                errors
                  .root
                  .message
              }
            </p>
          </div>
        </div>
      )}

      {/* =========================================
          CONTINUE
      ========================================= */}

      <div>
        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="group flex min-h-14 w-full items-center justify-between bg-primary px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[260px]"
        >
          <span>
            {isSubmitting
              ? "Processing..."
              : "Continue to Payment"}
          </span>

          {!isSubmitting && (
            <span className="ml-6 text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        <p className="mt-4 max-w-xl font-sans text-xs leading-5 text-foreground/40">
          Your order is not complete
          until payment has been
          successfully processed and
          confirmed.
        </p>
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
    <div className="grid gap-4 sm:grid-cols-[48px_1fr] sm:gap-6">
      <p className="pt-1 font-sans text-[10px] font-bold text-primary">
        {number}
      </p>

      <div>
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>

        <h2 className="mt-2 font-rye text-3xl leading-tight text-foreground sm:text-4xl">
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
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
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