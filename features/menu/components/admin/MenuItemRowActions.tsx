"use client";

import {
  useActionState,
} from "react";

import {
  updateMenuItem,
  type UpdateMenuItemActionState,
} from "@/actions/menu/updateMenuItem";

import {
  toggleMenuItemAvailability,
  type ToggleMenuItemActionState,
} from "@/actions/menu/toggleMenuItemAvailability";

import {
  deleteMenuItem,
  type DeleteMenuItemActionState,
} from "@/actions/menu/deleteMenuItem";

interface MenuItemRowActionsProps {
  item: {
    id: string;

    name: string;

    description?: string;

    image?: string;

    price: number;
  
    category: {
      id: string;
      name: string;
    };

    available: boolean;

    displayOrder: number;
  };

  categories: {
    id: string;
    name: string;
  }[];
}

const initialUpdateState:
  UpdateMenuItemActionState = {
    success: false,
    message: "",
  };

const initialToggleState:
  ToggleMenuItemActionState = {
    success: false,
    message: "",
  };

const initialDeleteState:
  DeleteMenuItemActionState = {
    success: false,
    message: "",
  };

export default function MenuItemRowActions({
  item,
  categories,
}: MenuItemRowActionsProps) {
  const [
    updateState,
    updateAction,
    updatePending,
  ] =
    useActionState(
      updateMenuItem,
      initialUpdateState
    );

  const [
    toggleState,
    toggleAction,
    togglePending,
  ] =
    useActionState(
      toggleMenuItemAvailability,
      initialToggleState
    );

  const [
    deleteState,
    deleteAction,
    deletePending,
  ] =
    useActionState(
      deleteMenuItem,
      initialDeleteState
    );

  const pending =
    updatePending ||
    togglePending ||
    deletePending;

  return (
    <div>
      {/* ====================================
          QUICK ACTIONS
      ==================================== */}

      <div className="flex flex-wrap items-center gap-3">
        {/* Availability */}

        <form
          action={
            toggleAction
          }
        >
          <input
            type="hidden"
            name="menuItemId"
            value={
              item.id
            }
          />

          <button
            type="submit"
            disabled={
              pending
            }
            className="rounded-lg border border-black/10 bg-background px-3 py-2 text-sm font-semibold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
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
                name="menuItemId"
                value={
                  item.id
                }
              />

              {/* Current Image */}

              {item.image && (
                <div>
                  <p className="block text-sm font-semibold">
                    Current Image
                  </p>

                  <div className="mt-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  </div>
                </div>
              )}
              
              {item.image && (
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="removeImage"
                    disabled={pending}
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold text-accent">
                    Remove current image
                  </span>
                </label>
              )}

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
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
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
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
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

              {/* Category */}

              <div>
                <label className="block text-sm font-semibold">
                  Category
                </label>

                <select
                  name="categoryId"
                  defaultValue={
                    item.category.id
                  }
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {categories.map(
                    (
                      category
                    ) => (
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

                {updateState
                  .fieldErrors
                  ?.categoryId?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .categoryId[0]
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
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
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
                  disabled={
                    pending
                  }
                  className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
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

              {/* Replacement Image */}

              <div>
                <label
                  htmlFor={`image-${item.id}`}
                  className="block text-sm font-semibold"
                >
                  {item.image
                    ? "Replace Image"
                    : "Add Image"}
                </label>

                <input
                  id={`image-${item.id}`}
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={pending}
                  className="mt-2 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                />

                <p className="mt-1 text-xs text-foreground/50">
                  JPEG, PNG, or WebP.
                  Maximum 5 MB.
                </p>

                {updateState
                  .fieldErrors
                  ?.image?.[0] && (
                  <p className="mt-1 text-xs text-accent">
                    {
                      updateState
                        .fieldErrors
                        .image[0]
                    }
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  pending
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {updatePending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </form>

            {updateState.message && (
              <p
                role={
                  updateState.success
                    ? "status"
                    : "alert"
                }
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
          onSubmit={(
            event
          ) => {
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
            name="menuItemId"
            value={
              item.id
            }
          />

          <button
            type="submit"
            disabled={
              pending
            }
            className="text-sm font-semibold text-accent hover:underline disabled:opacity-50"
          >
            {deletePending
              ? "Deleting..."
              : "Delete"}
          </button>
        </form>
      </div>

      {/* Toggle result */}

      {toggleState.message && (
        <p
          role={
            toggleState.success
              ? "status"
              : "alert"
          }
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

      {/* Delete result */}

      {deleteState.message && (
        <p
          role={
            deleteState.success
              ? "status"
              : "alert"
          }
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