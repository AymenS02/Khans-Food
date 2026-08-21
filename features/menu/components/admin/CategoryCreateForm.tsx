"use client";

import {
  useActionState,
  useEffect,
  useRef,
} from "react";

import {
  createCategory,
  type CategoryActionState,
} from "@/actions/menu/createCategory";

const initialState:
  CategoryActionState = {
    success: false,
    message: "",
  };

export default function CategoryCreateForm() {
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
      createCategory,
      initialState
    );

  /*
   * Clear the form only after a
   * successful database operation.
   */
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [
    state.success,
    state.message,
  ]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-foreground">
        Add Category
      </h2>

      <p className="mt-2 text-sm text-foreground/60">
        Create a category that
        menu items can be assigned
        to.
      </p>

      <div className="mt-5">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-foreground"
        >
          Category Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Example: Mains"
          disabled={pending}
          className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary disabled:opacity-50"
        />

        {state.fieldErrors
          ?.name?.[0] && (
          <p className="mt-2 text-sm text-accent">
            {
              state
                .fieldErrors
                .name[0]
            }
          </p>
        )}
      </div>

      {state.message && (
        <div
          role={
            state.success
              ? "status"
              : "alert"
          }
          className="mt-4 rounded-xl bg-background px-4 py-3"
        >
          <p className="text-sm font-medium">
            {state.message}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending
          ? "Creating..."
          : "Add Category"}
      </button>
    </form>
  );
}