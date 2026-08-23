"use client";

import {
  useActionState,
  useEffect,
  useRef,
} from "react";

import {
  createMenuItem,
  type CreateMenuItemActionState,
} from "@/actions/menu/createMenuItem";

interface MenuItemCreateFormProps {
  categories: {
    id: string;
    name: string;
  }[];
}

const initialState:
  CreateMenuItemActionState = {
    success: false,
    message: "",
  };

export default function MenuItemCreateForm({
  categories,
}: MenuItemCreateFormProps) {
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
      createMenuItem,
      initialState
    );

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
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Add Menu Item
        </h2>

        <p className="mt-2 text-sm text-foreground/60">
          Add a product to the
          customer menu.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {/* Name */}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            disabled={pending}
            placeholder="Chicken Shawarma"
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
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

        {/* Price */}

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold"
          >
            Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            disabled={pending}
            placeholder="14.99"
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
          />

          {state.fieldErrors
            ?.price?.[0] && (
            <p className="mt-2 text-sm text-accent">
              {
                state
                  .fieldErrors
                  .price[0]
              }
            </p>
          )}
        </div>

        {/* Category */}

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-semibold"
          >
            Category
          </label>

          <select
            id="categoryId"
            name="categoryId"
            disabled={
              pending ||
              categories.length === 0
            }
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option
              value=""
              disabled
            >
              Select a category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {
                    category.name
                  }
                </option>
              )
            )}
          </select>

          {state.fieldErrors
            ?.categoryId?.[0] && (
            <p className="mt-2 text-sm text-accent">
              {
                state
                  .fieldErrors
                  .categoryId[0]
              }
            </p>
          )}
        </div>

        {/* Display Order */}

        <div>
          <label
            htmlFor="displayOrder"
            className="block text-sm font-semibold"
          >
            Display Order
          </label>

          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min="0"
            step="1"
            defaultValue="0"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
          />

          {state.fieldErrors
            ?.displayOrder?.[0] && (
            <p className="mt-2 text-sm text-accent">
              {
                state
                  .fieldErrors
                  .displayOrder[0]
              }
            </p>
          )}

          <p className="mt-2 text-xs text-foreground/50">
            Lower numbers appear
            first.
          </p>
        </div>
      </div>

      {/* Description */}

      <div className="mt-5">
        <label
          htmlFor="description"
          className="block text-sm font-semibold"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={4}
          disabled={pending}
          placeholder="Describe the menu item..."
          className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus:border-primary"
        />

        {state.fieldErrors
          ?.description?.[0] && (
          <p className="mt-2 text-sm text-accent">
            {
              state
                .fieldErrors
                .description[0]
            }
          </p>
        )}
      </div>

      {/* Image */}

      <div className="mt-5">
        <label
          htmlFor="image"
          className="block text-sm font-semibold"
        >
          Food Image
        </label>

        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className="mt-2 block w-full rounded-xl border border-black/10 bg-background px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white disabled:opacity-50"
        />

        <p className="mt-2 text-xs text-foreground/50">
          JPEG, PNG, or WebP.
          Maximum 5 MB.
        </p>

        {state.fieldErrors
          ?.image?.[0] && (
          <p className="mt-2 text-sm text-accent">
            {
              state
                .fieldErrors
                .image[0]
            }
          </p>
        )}
      </div>
      
      {/* Available */}

      <label className="mt-5 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="available"
          defaultChecked
          disabled={pending}
          className="h-4 w-4"
        />

        <span className="text-sm font-semibold">
          Available to customers
        </span>
      </label>

      {/* Result */}

      {state.message && (
        <div
          role={
            state.success
              ? "status"
              : "alert"
          }
          className="mt-5 rounded-xl bg-background px-4 py-3"
        >
          <p
            className={
              state.success
                ? "text-sm font-medium"
                : "text-sm font-medium text-accent"
            }
          >
            {state.message}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          pending ||
          categories.length === 0
        }
        className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending
          ? "Creating..."
          : "Add Menu Item"}
      </button>

      {categories.length ===
        0 && (
        <p className="mt-3 text-sm text-accent">
          Create a category before
          adding menu items.
        </p>
      )}
    </form>
  );
}