"use client";

import {
  useActionState,
  useRef,
} from "react";

import {
  sendContactMessage,
  type ContactFormActionState,
} from "@/actions/contact/sendContactMessage";

const initialState:
  ContactFormActionState = {
    success: false,
    message: "",
  };

export default function ContactForm() {
  const formRef =
    useRef<HTMLFormElement>(
      null
    );

  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      async (
        previousState:
          ContactFormActionState,
        formData:
          FormData
      ) => {
        const result =
          await sendContactMessage(
            previousState,
            formData
          );

        if (
          result.success
        ) {
          formRef.current?.reset();
        }

        return result;
      },
      initialState
    );

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full"
    >
      {/* =========================================
          HONEYPOT
      ========================================= */}

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="website">
          Website
        </label>

        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* =========================================
          NAME + EMAIL
      ========================================= */}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your Name"
          error={
            state
              .fieldErrors
              ?.name?.[0]
          }
        >
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={
              pending
            }
            placeholder="Your name"
            className={
              inputClassName
            }
          />
        </Field>

        <Field
          label="Email Address"
          error={
            state
              .fieldErrors
              ?.email?.[0]
          }
        >
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={
              pending
            }
            placeholder="you@example.com"
            className={
              inputClassName
            }
          />
        </Field>
      </div>

      {/* =========================================
          PHONE + TYPE
      ========================================= */}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone"
          optional
          error={
            state
              .fieldErrors
              ?.phone?.[0]
          }
        >
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            disabled={
              pending
            }
            placeholder="(905) 555-0123"
            className={
              inputClassName
            }
          />
        </Field>

        <Field
          label="How Can We Help?"
          error={
            state
              .fieldErrors
              ?.inquiryType?.[0]
          }
        >
          <select
            id="contact-inquiry"
            name="inquiryType"
            defaultValue="general"
            required
            disabled={
              pending
            }
            className={
              inputClassName
            }
          >
            <option value="general">
              General Question
            </option>

            <option value="order">
              Order Question
            </option>

            <option value="catering">
              Catering Question
            </option>

            <option value="feedback">
              Feedback
            </option>
          </select>
        </Field>
      </div>

      {/* =========================================
          ORDER NUMBER
      ========================================= */}

      <div className="mt-5">
        <Field
          label="Order Number"
          optional
          error={
            state
              .fieldErrors
              ?.orderNumber?.[0]
          }
        >
          <input
            id="contact-order-number"
            name="orderNumber"
            type="text"
            disabled={
              pending
            }
            placeholder="If your question is about an existing order"
            className={
              inputClassName
            }
          />
        </Field>
      </div>

      {/* =========================================
          MESSAGE
      ========================================= */}

      <div className="mt-5">
        <Field
          label="Message"
          error={
            state
              .fieldErrors
              ?.message?.[0]
          }
        >
          <textarea
            id="contact-message"
            name="message"
            rows={7}
            required
            disabled={
              pending
            }
            maxLength={
              3000
            }
            placeholder="Tell us how we can help..."
            className={`${inputClassName} min-h-44 resize-y`}
          />
        </Field>
      </div>

      {/* =========================================
          RESULT
      ========================================= */}

      {state.message && (
        <div
          role={
            state.success
              ? "status"
              : "alert"
          }
          className={`mt-6 border px-4 py-4 ${
            state.success
              ? "border-secondary/30 bg-secondary/10"
              : "border-accent/30 bg-accent/10"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={`mt-0.5 text-xs ${
                state.success
                  ? "text-secondary"
                  : "text-accent"
              }`}
            >
              ◆
            </span>

            <p
              className={`font-sans text-sm leading-6 ${
                state.success
                  ? "text-foreground"
                  : "text-accent"
              }`}
            >
              {
                state.message
              }
            </p>
          </div>
        </div>
      )}

      {/* =========================================
          SUBMIT
      ========================================= */}

      <div className="mt-7 border-t border-foreground/15 pt-6">
        <button
          type="submit"
          disabled={
            pending
          }
          className="group flex min-h-14 w-full items-center justify-between bg-primary px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
        >
          <span>
            {pending
              ? "Sending..."
              : "Send Message"}
          </span>

          {!pending && (
            <span className="ml-6 text-lg transition-transform group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        <p className="mt-4 max-w-md font-sans text-[10px] leading-5 text-foreground/35">
          By sending this form,
          you&apos;re providing
          your information so we
          can respond to your
          inquiry.
        </p>
      </div>
    </form>
  );
}

/* =============================================
   FIELD
============================================= */

function Field({
  label,
  optional = false,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children:
    React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className={
          labelClassName
        }>
          {label}
        </label>

        {optional && (
          <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-foreground/30">
            Optional
          </span>
        )}
      </div>

      <div className="mt-2">
        {children}
      </div>

      {error && (
        <p className="mt-2 font-sans text-xs leading-5 text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

/* =============================================
   SHARED STYLES
============================================= */

const labelClassName =
  "block font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45";

const inputClassName =
  "min-h-12 w-full border border-foreground/20 bg-background px-4 py-3 font-sans text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";