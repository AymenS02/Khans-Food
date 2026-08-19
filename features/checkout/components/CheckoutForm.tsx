"use client";

import {
  useEffect,
  useState,
} from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/stores/cartStore";

import {
  checkoutSchema,
  CheckoutFormData,
} from "../validators/checkoutSchema";

import { formatPickupTime } from "../utils/formatPickupTime";

export default function CheckoutForm() {
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
    resolver: zodResolver(checkoutSchema),
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
  ] = useState<string[]>([]);

  const [
    isLoadingPickupTimes,
    setIsLoadingPickupTimes,
  ] = useState(false);

  const [
    pickupTimesError,
    setPickupTimesError,
  ] = useState<string | null>(
    null
  );

  const items = useCartStore(
    (state) => state.items
  );

  useEffect(() => {
    if (!pickupDate) {
      setAvailablePickupTimes([]);
      setPickupTimesError(null);

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

        setPickupTimesError(null);

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
          result.times.length === 0
        ) {
          setPickupTimesError(
            result.message ??
              "No pickup times are available."
          );
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
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

  const onSubmit = async (
    data: CheckoutFormData
  ) => {
    clearErrors("root");

    /*
    * Convert Zustand cart items into the
    * structure expected by our checkout API.
    */
    const cartItems =
      items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      }));

    if (cartItems.length === 0) {
      setError("root", {
        type: "server",
        message:
          "Your cart is empty.",
      });

      return;
    }

    /*
    * Represents the exact checkout the
    * customer is currently trying to make.
    */
    const checkoutPayload = {
      ...data,
      items: cartItems,
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

    if (storedAttempt) {
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
    * IMPORTANT:
    *
    * Save the checkout ATTEMPT here.
    *
    * Your previous code accidentally saved
    * "checkoutPayment" here and referenced
    * result before the API request existed.
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
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                ...checkoutPayload,
                checkoutAttemptId,
              }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setError("root", {
          type: "server",

          message:
            result.error ??
            "Unable to create checkout.",
        });

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
        setError("root", {
          type: "server",
          message:
            "Invalid checkout response.",
        });

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

      window.location.href =
        "/checkout/payment";
    } catch (error) {
      console.error(
        "Checkout request failed:",
        error
      );

      setError("root", {
        type: "server",

        message:
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Customer Information */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground">
          Contact Information
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-foreground"
            >
              First Name
            </label>

            <input
              id="firstName"
              type="text"
              {...register("firstName")}
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

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-foreground"
            >
              Last Name
            </label>

            <input
              id="lastName"
              type="text"
              {...register("lastName")}
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

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-foreground"
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

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-foreground"
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
        </div>
      </section>

      {/* Pickup Information */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground">
          Pickup Information
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Date */}
          <div>
            <label
              htmlFor="pickupDate"
              className="block text-sm font-semibold text-foreground"
            >
              Pickup Date
            </label>

            <input
              id="pickupDate"
              type="date"
              {...register(
                "pickupDate"
              )}
              className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
            />

            {errors.pickupDate && (
              <p className="mt-2 text-sm text-accent">
                {
                  errors.pickupDate
                    .message
                }
              </p>
            )}
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="pickupTime"
              className="block text-sm font-semibold text-foreground"
            >
              Pickup Time
            </label>

            <select
              id="pickupTime"
              {...register("pickupTime")}
              disabled={
                !pickupDate ||
                isLoadingPickupTimes ||
                availablePickupTimes.length === 0
              }
              className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {isLoadingPickupTimes
                  ? "Loading times..."
                  : !pickupDate
                    ? "Select a date first"
                    : availablePickupTimes.length === 0
                      ? "No times available"
                      : "Select a pickup time"}
              </option>

              {availablePickupTimes.map((time) => (
                <option
                  key={time}
                  value={time}
                >
                  {formatPickupTime(time)}
                </option>
              ))}
            </select>

            {errors.pickupTime && (
              <p className="mt-2 text-sm text-accent">
                {errors.pickupTime.message}
              </p>
            )}

            {pickupTimesError && (
              <p className="mt-2 text-sm text-accent">
                {pickupTimesError}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <label
            htmlFor="notes"
            className="block text-sm font-semibold text-foreground"
          >
            Order Notes
          </label>

          <textarea
            id="notes"
            rows={4}
            {...register("notes")}
            placeholder="Anything we should know about your order?"
            className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
          />

          {errors.notes && (
            <p className="mt-2 text-sm text-accent">
              {errors.notes.message}
            </p>
          )}
        </div>
      </section>
      
      {errors.root?.message && (
        <div
          role="alert"
          className="rounded-xl border border-accent/20 bg-accent/10 px-4 py-3"
        >
          <p className="text-sm font-medium text-accent">
            {errors.root.message}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Processing..."
          : "Continue to Payment"}
      </button>
    </form>
  );
}