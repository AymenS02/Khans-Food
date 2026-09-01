"use client";

import Image from "next/image";

import { useActionState } from "react";

import {
  updateCateringItem,
  type UpdateCateringItemActionState,
} from "@/actions/catering/updateCateringItem";

import {
  toggleCateringItemAvailability,
  type ToggleCateringItemActionState,
} from "@/actions/catering/toggleCateringItemAvailability";

import {
  deleteCateringItem,
  type DeleteCateringItemActionState,
} from "@/actions/catering/deleteCateringItem";

interface CateringItemRowActionsProps {
  item: {
    id: string;
    name: string;
    description?: string;
    price: number;

    image?: string;

    pricingType:
      | "flat"
      | "per_person";

    category?: string;

    available: boolean;

    displayOrder: number;
  };
}

const initialUpdateState:
  UpdateCateringItemActionState = {
    success: false,
    message: "",
  };

const initialToggleState:
  ToggleCateringItemActionState = {
    success: false,
    message: "",
  };

const initialDeleteState:
  DeleteCateringItemActionState = {
    success: false,
    message: "",
  };

export default function CateringItemRowActions({
  item,
}: CateringItemRowActionsProps) {
  const [
    updateState,
    updateAction,
    updatePending,
  ] =
    useActionState(
      updateCateringItem,
      initialUpdateState
    );

  const [
    toggleState,
    toggleAction,
    togglePending,
  ] =
    useActionState(
      toggleCateringItemAvailability,
      initialToggleState
    );

  const [
    deleteState,
    deleteAction,
    deletePending,
  ] =
    useActionState(
      deleteCateringItem,
      initialDeleteState
    );

  const pending =
    updatePending ||
    togglePending ||
    deletePending;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {/* Availability */}

        <form
          action={
            toggleAction
          }
        >
          <input
            type="hidden"
            name="cateringItemId"
            value={item.id}
          />

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-black/10 bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary disabled:opacity-50"
          >
            {togglePending
              ? "Updating..."
              : item.available
                ? "Hide"
                : "Make Available"}
          </button>
        </form>

        {/* Edit */}

        <details>
          <summary className="cursor-pointer list-none rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">
            Edit
          </summary>

          <div className="mt-4 rounded-xl border border-black/10 bg-background p-4">
            <form
              action={
                updateAction
              }
              className="space-y-4"
            >
              <input
                type="hidden"
                name="cateringItemId"
                value={item.id}
              />

              {/* Name */}

              <div>
                <label className="block text-sm font-semibold">
                  Name
                </label>

                <input
                  name="name"
                  type="text"
                  defaultValue={
                    item.name
                  }
                  disabled={pending}
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                />

                {updateState
                  .fieldErrors
                  ?.name?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .name[0]
                    }
                  </p>
                )}
              </div>

              {/* Price */}

              <div>
                <label className="block text-sm font-semibold">
                  Price
                </label>

                <input
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  defaultValue={
                    item.price
                  }
                  disabled={pending}
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                />

                {updateState
                  .fieldErrors
                  ?.price?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .price[0]
                    }
                  </p>
                )}
              </div>

              {/* Pricing Type */}

              <div>
                <label className="block text-sm font-semibold">
                  Pricing Type
                </label>

                <select
                  name="pricingType"
                  defaultValue={
                    item.pricingType
                  }
                  disabled={pending}
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                >
                  <option value="flat">
                    Flat Price
                  </option>

                  <option value="per_person">
                    Per Person
                  </option>
                </select>

                {updateState
                  .fieldErrors
                  ?.pricingType?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .pricingType[0]
                    }
                  </p>
                )}
              </div>

              {/* Category */}

              <div>
                <label className="block text-sm font-semibold">
                  Category
                </label>

                <input
                  name="category"
                  type="text"
                  defaultValue={
                    item.category ??
                    ""
                  }
                  disabled={pending}
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                />

                {updateState
                  .fieldErrors
                  ?.category?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .category[0]
                    }
                  </p>
                )}
              </div>

              {/* Display Order */}

              <div>
                <label className="block text-sm font-semibold">
                  Display Order
                </label>

                <input
                  name="displayOrder"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    item.displayOrder
                  }
                  disabled={pending}
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                />

                {updateState
                  .fieldErrors
                  ?.displayOrder?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .displayOrder[0]
                    }
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-sm font-semibold">
                  Image
                </p>

                {item.image ? (
                  <div className="mt-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={176}
                      height={128}
                      className="h-32 w-44 rounded-lg object-cover"
                    />

                    <p className="mt-2 text-xs text-foreground/50">
                      Current image
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-foreground/50">
                    No image currently uploaded.
                  </p>
                )}

                <div className="mt-4">
                  <label className="block text-xs font-semibold">
                    Replace Image
                  </label>

                  <input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={pending}
                    className="mt-2 block w-full text-sm"
                  />

                  <p className="mt-1 text-xs text-foreground/50">
                    JPEG, PNG, or WebP.
                    Maximum 5 MB.
                  </p>
                </div>

                {item.image && (
                  <label className="mt-4 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="removeImage"
                      disabled={pending}
                    />

                    Remove current image
                  </label>
                )}

                {updateState
                  .fieldErrors
                  ?.image?.[0] && (
                  <p className="mt-2 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .image[0]
                    }
                  </p>
                )}
              </div>

              {/* Description */}

              <div>
                <label className="block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  defaultValue={
                    item.description ??
                    ""
                  }
                  disabled={pending}
                  className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                />

                {updateState
                  .fieldErrors
                  ?.description?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .description[0]
                    }
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {updatePending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </form>

            {updateState.message && (
              <p
                className={`mt-3 text-xs ${
                  updateState.success
                    ? "text-foreground/60"
                    : "text-accent"
                }`}
              >
                {
                  updateState.message
                }
              </p>
            )}
          </div>
        </details>

        {/* Delete */}

        <form
          action={
            deleteAction
          }
          onSubmit={(event) => {
            const confirmed =
              window.confirm(
                `Permanently delete "${item.name}"?`
              );

            if (!confirmed) {
              event.preventDefault();
            }
          }}
        >
          <input
            type="hidden"
            name="cateringItemId"
            value={item.id}
          />

          <button
            type="submit"
            disabled={pending}
            className="text-sm font-semibold text-accent hover:underline disabled:opacity-50"
          >
            {deletePending
              ? "Deleting..."
              : "Delete"}
          </button>
        </form>
      </div>

      {toggleState.message && (
        <p
          className={`mt-2 text-xs ${
            toggleState.success
              ? "text-foreground/60"
              : "text-accent"
          }`}
        >
          {
            toggleState.message
          }
        </p>
      )}

      {deleteState.message && (
        <p
          className={`mt-2 text-xs ${
            deleteState.success
              ? "text-foreground/60"
              : "text-accent"
          }`}
        >
          {
            deleteState.message
          }
        </p>
      )}
    </div>
  );
}