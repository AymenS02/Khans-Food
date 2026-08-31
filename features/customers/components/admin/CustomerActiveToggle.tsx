"use client";

import { useActionState } from "react";

import {
  toggleCustomerActive,
  type ToggleCustomerActiveState,
} from "@/actions/customers/toggleCustomerActive";

interface CustomerActiveToggleProps {
  customerId: string;

  customerName: string;

  isActive: boolean;
}

const initialState:
  ToggleCustomerActiveState = {
    success: false,
    message: "",
  };

export default function CustomerActiveToggle({
  customerId,
  customerName,
  isActive,
}: CustomerActiveToggleProps) {
  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      toggleCustomerActive,
      initialState
    );

  return (
    <div>
      <form
        action={formAction}
        onSubmit={(
          event
        ) => {
          const message =
            isActive
              ? `Deactivate ${customerName}'s account?`
              : `Reactivate ${customerName}'s account?`;

          if (
            !window.confirm(
              message
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <input
          type="hidden"
          name="customerId"
          value={
            customerId
          }
        />

        <button
          type="submit"
          disabled={
            pending
          }
          className={
            isActive
              ? "rounded-xl border border-accent/20 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/5 disabled:opacity-50"
              : "rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          }
        >
          {pending
            ? "Updating..."
            : isActive
              ? "Deactivate Account"
              : "Reactivate Account"}
        </button>
      </form>

      {state.message && (
        <p
          className={`mt-3 text-sm ${
            state.success
              ? "text-foreground/60"
              : "text-accent"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}