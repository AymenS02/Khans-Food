"use client";

import {
  useActionState,
  useMemo,
  useState,
} from "react";

import {
  updateCateringPackage,
  type UpdateCateringPackageActionState,
} from "@/actions/catering/updateCateringPackage";

import {
  toggleCateringPackageAvailability,
  type ToggleCateringPackageActionState,
} from "@/actions/catering/toggleCateringPackageAvailability";

import {
  deleteCateringPackage,
  type DeleteCateringPackageActionState,
} from "@/actions/catering/deleteCateringPackage";

interface CateringPackageRowActionsProps {
  pkg: {
    id: string;

    name: string;
    description?: string;

    price: number;

    pricingType:
      | "flat"
      | "per_person";

    minimumGuests?: number;
    maximumGuests?: number;

    available: boolean;

    displayOrder: number;

    items: {
      cateringItem: string;
      name: string;
      quantity: number;
    }[];
  };

  cateringItems: {
    id: string;
    name: string;
  }[];
}

const initialUpdateState:
  UpdateCateringPackageActionState = {
    success: false,
    message: "",
  };

const initialToggleState:
  ToggleCateringPackageActionState = {
    success: false,
    message: "",
  };

const initialDeleteState:
  DeleteCateringPackageActionState = {
    success: false,
    message: "",
  };

export default function CateringPackageRowActions({
  pkg,
  cateringItems,
}: CateringPackageRowActionsProps) {
  /*
   * Start the edit form with the
   * package's current item quantities.
   */
  const initialItems =
    Object.fromEntries(
      pkg.items.map(
        (item) => [
          item.cateringItem,
          item.quantity,
        ]
      )
    );

  const [
    selectedItems,
    setSelectedItems,
  ] =
    useState<
      Record<
        string,
        number
      >
    >(
      initialItems
    );

  const [
    updateState,
    updateAction,
    updatePending,
  ] =
    useActionState(
      updateCateringPackage,
      initialUpdateState
    );

  const [
    toggleState,
    toggleAction,
    togglePending,
  ] =
    useActionState(
      toggleCateringPackageAvailability,
      initialToggleState
    );

  const [
    deleteState,
    deleteAction,
    deletePending,
  ] =
    useActionState(
      deleteCateringPackage,
      initialDeleteState
    );

  const pending =
    updatePending ||
    togglePending ||
    deletePending;

  const itemsJson =
    useMemo(
      () =>
        JSON.stringify(
          Object.entries(
            selectedItems
          ).map(
            ([
              cateringItemId,
              quantity,
            ]) => ({
              cateringItemId,
              quantity,
            })
          )
        ),

      [selectedItems]
    );

  function toggleItem(
    itemId: string
  ) {
    setSelectedItems(
      (current) => {
        const next = {
          ...current,
        };

        if (
          itemId in next
        ) {
          delete next[
            itemId
          ];
        } else {
          next[itemId] =
            1;
        }

        return next;
      }
    );
  }

  function updateQuantity(
    itemId: string,
    quantity: number
  ) {
    setSelectedItems(
      (current) => ({
        ...current,

        [itemId]:
          Math.max(
            1,
            quantity
          ),
      })
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {/* Availability */}

        <form
          action={
            toggleAction
          }
        >
          <input
            type="hidden"
            name="packageId"
            value={
              pkg.id
            }
          />

          <button
            type="submit"
            disabled={
              pending
            }
            className="rounded-lg border border-black/10 bg-background px-3 py-2 text-sm font-semibold"
          >
            {togglePending
              ? "Updating..."
              : pkg.available
                ? "Hide"
                : "Make Available"}
          </button>
        </form>

        {/* Edit */}

        <details>
          <summary className="cursor-pointer list-none rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">
            Edit
          </summary>

          <div className="mt-4 min-w-[280px] rounded-xl border border-black/10 bg-background p-4 sm:min-w-[500px]">
            <form
              action={
                updateAction
              }
              className="space-y-4"
            >
              <input
                type="hidden"
                name="packageId"
                value={
                  pkg.id
                }
              />

              <input
                type="hidden"
                name="itemsJson"
                value={
                  itemsJson
                }
              />

              <div>
                <label className="text-sm font-semibold">
                  Name
                </label>

                <input
                  name="name"
                  defaultValue={
                    pkg.name
                  }
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Price
                </label>

                <input
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  defaultValue={
                    pkg.price
                  }
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Pricing Type
                </label>

                <select
                  name="pricingType"
                  defaultValue={
                    pkg.pricingType
                  }
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                >
                  <option value="flat">
                    Flat
                  </option>

                  <option value="per_person">
                    Per Person
                  </option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">
                    Minimum Guests
                  </label>

                  <input
                    name="minimumGuests"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={
                      pkg.minimumGuests ??
                      ""
                    }
                    disabled={
                      pending
                    }
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Maximum Guests
                  </label>

                  <input
                    name="maximumGuests"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={
                      pkg.maximumGuests ??
                      ""
                    }
                    disabled={
                      pending
                    }
                    className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Display Order
                </label>

                <input
                  name="displayOrder"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={
                    pkg.displayOrder
                  }
                  disabled={
                    pending
                  }
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={4}
                  defaultValue={
                    pkg.description ??
                    ""
                  }
                  disabled={
                    pending
                  }
                  className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2"
                />
              </div>

              {/* Package items */}

              <div>
                <p className="text-sm font-semibold">
                  Package Items
                </p>

                <div className="mt-3 divide-y divide-black/10 rounded-lg border border-black/10 bg-white">
                  {cateringItems.map(
                    (item) => {
                      const selected =
                        item.id in
                        selectedItems;

                      return (
                        <div
                          key={
                            item.id
                          }
                          className="flex items-center justify-between gap-4 p-3"
                        >
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={
                                selected
                              }
                              onChange={() =>
                                toggleItem(
                                  item.id
                                )
                              }
                              disabled={
                                pending
                              }
                            />

                            <span className="text-sm">
                              {
                                item.name
                              }
                            </span>
                          </label>

                          {selected && (
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={
                                selectedItems[
                                  item.id
                                ]
                              }
                              onChange={(
                                event
                              ) =>
                                updateQuantity(
                                  item.id,

                                  Number(
                                    event
                                      .target
                                      .value
                                  )
                                )
                              }
                              disabled={
                                pending
                              }
                              className="w-20 rounded-lg border border-black/10 px-3 py-2"
                            />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {updateState.message && (
                <p
                  className={
                    updateState.success
                      ? "text-sm text-foreground/60"
                      : "text-sm text-accent"
                  }
                >
                  {
                    updateState.message
                  }
                </p>
              )}

              <button
                type="submit"
                disabled={
                  pending
                }
                className="rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {updatePending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </form>
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
            if (
              !window.confirm(
                `Permanently delete "${pkg.name}"?`
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <input
            type="hidden"
            name="packageId"
            value={
              pkg.id
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

      {toggleState.message && (
        <p className="mt-2 text-xs text-foreground/60">
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