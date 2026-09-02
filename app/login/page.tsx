"use client";

import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  loginSchema,
  type LoginInput,
} from "@/validators/auth.validator";

export default function LoginPage() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const [
    serverError,
    setServerError,
  ] =
    useState<
      string | null
    >(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<LoginInput>({
      resolver:
        zodResolver(
          loginSchema
        ),

      defaultValues: {
        email: "",
        password: "",
      },
    });

  async function onSubmit(
    data: LoginInput
  ) {
    setServerError(null);

    const result =
      await signIn(
        "credentials",
        {
          email:
            data.email,

          password:
            data.password,

          redirect:
            false,
        }
      );

    if (
      !result ||
      result.error
    ) {
      setServerError(
        "Invalid email or password."
      );

      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="overflow-hidden">
      {/* =========================================
          LOGIN
      ========================================= */}

      <section className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12">
        {/* =====================================
            BRAND / INTRO
        ===================================== */}

        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Khans Food
          </p>

          <h1 className="mt-4 max-w-xl font-rye text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Welcome
            <br />
            Back.
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="max-w-lg font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
            Sign in to view your
            orders, track catering
            requests, and manage your
            Khans Food account.
          </p>

          <div className="mt-10 hidden border-t border-foreground/15 pt-8 lg:block">
            <div className="grid max-w-lg grid-cols-2 gap-8">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  01
                </p>

                <p className="mt-3 font-rye text-xl">
                  Track Orders
                </p>

                <p className="mt-2 font-sans text-xs leading-5 text-foreground/45">
                  See pickup details
                  and order status in
                  one place.
                </p>
              </div>

              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  02
                </p>

                <p className="mt-3 font-rye text-xl">
                  Manage Catering
                </p>

                <p className="mt-2 font-sans text-xs leading-5 text-foreground/45">
                  Follow catering
                  requests, approval,
                  and payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <div className="w-full lg:ml-auto lg:max-w-xl">
          <div className="border-y border-foreground/15 py-8 sm:px-8 sm:py-10">
            <div className="mb-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                My Account
              </p>

              <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
                Sign In
              </h2>

              <p className="mt-3 font-sans text-sm leading-6 text-foreground/50">
                Enter your email and
                password to continue.
              </p>
            </div>

            {/* REGISTER SUCCESS */}

            {searchParams.get(
              "registered"
            ) === "1" && (
              <div
                role="status"
                className="mb-6 border border-secondary/30 bg-secondary/10 px-4 py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-sans text-[10px] font-bold text-white">
                    ✓
                  </span>

                  <p className="font-sans text-sm leading-6 text-foreground/65">
                    Account created
                    successfully.
                    Please sign in.
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(
                onSubmit
              )}
              className="space-y-6"
            >
              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register(
                    "email"
                  )}
                  className="mt-2 min-h-12 w-full border border-foreground/20 bg-transparent px-4 py-3 font-sans text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />

                {errors.email && (
                  <p className="mt-2 font-sans text-xs font-medium text-accent">
                    {
                      errors
                        .email
                        .message
                    }
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/55"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register(
                    "password"
                  )}
                  className="mt-2 min-h-12 w-full border border-foreground/20 bg-transparent px-4 py-3 font-sans text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />

                {errors.password && (
                  <p className="mt-2 font-sans text-xs font-medium text-accent">
                    {
                      errors
                        .password
                        .message
                    }
                  </p>
                )}
              </div>

              {/* SERVER ERROR */}

              {serverError && (
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
                        serverError
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="group flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? "Signing In..."
                    : "Sign In"}
                </span>

                {!isSubmitting && (
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {/* REGISTER */}

            <div className="mt-8 border-t border-foreground/15 pt-6">
              <p className="font-sans text-xs text-foreground/45">
                New to Khans Food?
              </p>

              <Link
                href="/register"
                className="group mt-2 inline-flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:text-primary"
              >
                Create Account

                <span className="text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}