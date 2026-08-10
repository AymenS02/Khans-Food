"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  checkoutSchema,
  CheckoutFormData,
} from "../validators/checkoutSchema";

export default function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Checkout data:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
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
                {errors.firstName.message}
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
                {errors.lastName.message}
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
              {...register("pickupDate")}
              className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
            />

            {errors.pickupDate && (
              <p className="mt-2 text-sm text-accent">
                {errors.pickupDate.message}
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

            <input
              id="pickupTime"
              type="time"
              {...register("pickupTime")}
              className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
            />

            {errors.pickupTime && (
              <p className="mt-2 text-sm text-accent">
                {errors.pickupTime.message}
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

      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-white transition hover:opacity-90"
      >
        Continue to Payment
      </button>
    </form>
  );
}