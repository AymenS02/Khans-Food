"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerCustomer } from "@/actions/auth/registerCustomer";
import { registerSchema, type RegisterInput } from "@/validators/auth.validator";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);

    const result = await registerCustomer(data);

    if (!result.success) {
      if (result.fieldErrors) {
        const entries = Object.entries(result.fieldErrors) as [keyof RegisterInput, string[] | undefined][];

        entries.forEach(([fieldName, fieldErrors]) => {
          if (fieldErrors?.[0]) {
            setError(fieldName, { type: "server", message: fieldErrors[0] });
          }
        });
      }

      setServerError(result.message);
      return;
    }

    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-8 shadow-md">
        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
        <p className="mt-2 text-sm text-foreground/60">Register a customer account to track your orders and catering requests.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" id="firstName" error={errors.firstName?.message}>
              <input id="firstName" type="text" autoComplete="given-name" {...register("firstName")} className={inputClassName} />
            </Field>
            <Field label="Last name" id="lastName" error={errors.lastName?.message}>
              <input id="lastName" type="text" autoComplete="family-name" {...register("lastName")} className={inputClassName} />
            </Field>
          </div>

          <Field label="Email" id="email" error={errors.email?.message}>
            <input id="email" type="email" autoComplete="email" {...register("email")} className={inputClassName} />
          </Field>

          <Field label="Phone (optional)" id="phone" error={errors.phone?.message}>
            <input id="phone" type="tel" autoComplete="tel" {...register("phone")} className={inputClassName} />
          </Field>

          <Field label="Password" id="password" error={errors.password?.message}>
            <input id="password" type="password" autoComplete="new-password" {...register("password")} className={inputClassName} />
          </Field>

          <Field label="Confirm password" id="confirmPassword" error={errors.confirmPassword?.message}>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={inputClassName}
            />
          </Field>

          {serverError && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-foreground/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

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
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

const inputClassName = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary";
