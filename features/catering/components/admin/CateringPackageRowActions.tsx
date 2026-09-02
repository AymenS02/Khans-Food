"use client";

import Image from "next/image";

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

    image?: string;

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
      Record<string, number>
    >(initialItems);

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
      <div className="flex flex-wrap items-center gap-3">
        {/* =========================================
            AVAILABILITY
        ========================================= */}

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
            className="min-h-10 border border-foreground/20 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {togglePending
              ? "Updating..."
              : pkg.available
                ? "Hide Package"
                : "Make Available"}
          </button>
        </form>

        {/* =========================================
            EDIT
        ========================================= */}

        <details className="group">
          <summary className="flex min-h-10 cursor-pointer list-none items-center gap-3 bg-primary px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-90">
            Edit Package

            <span className="text-base transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

          <div className="mt-5 w-full min-w-0 border border-foreground/15 bg-background p-5 sm:min-w-[560px] sm:p-6 lg:min-w-[680px]">
            <form
              action={
                updateAction
              }
              className="space-y-8"
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

              {/* =================================
                  HEADER
              ================================= */}

              <div className="border-b border-foreground/15 pb-6">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Package Settings
                </p>

                <h3 className="mt-2 font-rye text-2xl text-foreground">
                  Edit {pkg.name}
                </h3>

                <p className="mt-2 max-w-xl font-sans text-xs leading-5 text-foreground/45">
                  Update the package
                  details, image,
                  guest limits, and
                  included items.
                </p>
              </div>

              {/* =================================
                  BASIC DETAILS
              ================================= */}

              <section>
                <p className="mb-5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Basic Details
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* NAME */}

                  <Field
                    label="Name"
                  >
                    <input
                      name="name"
                      defaultValue={
                        pkg.name
                      }
                      disabled={
                        pending
                      }
                      className={
                        inputClassName
                      }
                    />
                  </Field>

                  {/* PRICE */}

                  <Field
                    label="Price"
                  >
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
                      className={
                        inputClassName
                      }
                    />
                  </Field>

                  {/* PRICING TYPE */}

                  <Field
                    label="Pricing Type"
                  >
                    <select
                      name="pricingType"
                      defaultValue={
                        pkg.pricingType
                      }
                      disabled={
                        pending
                      }
                      className={
                        inputClassName
                      }
                    >
                      <option value="flat">
                        Flat Package Price
                      </option>

                      <option value="per_person">
                        Per Person
                      </option>
                    </select>
                  </Field>

                  {/* DISPLAY ORDER */}

                  <Field
                    label="Display Order"
                  >
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
                      className={
                        inputClassName
                      }
                    />
                  </Field>

                  {/* MINIMUM */}

                  <Field
                    label="Minimum Guests"
                  >
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
                      className={
                        inputClassName
                      }
                    />
                  </Field>

                  {/* MAXIMUM */}

                  <Field
                    label="Maximum Guests"
                  >
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
                      placeholder="Optional"
                      className={
                        inputClassName
                      }
                    />
                  </Field>
                </div>
              </section>

              {/* =================================
                  PACKAGE IMAGE
              ================================= */}

              <section className="border-y border-foreground/15 py-7">
                <div>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    Package Image
                  </p>

                  <h4 className="mt-2 font-rye text-xl text-foreground">
                    Package Photo
                  </h4>

                  <p className="mt-2 max-w-xl font-sans text-xs leading-5 text-foreground/45">
                    Leave the image
                    field empty to keep
                    the current image,
                    or select a new one
                    to replace it.
                  </p>
                </div>

                {/* CURRENT IMAGE */}

                {pkg.image ? (
                  <div className="mt-5">
                    <p className={
                      labelClassName
                    }>
                      Current Image
                    </p>

                    <div className="relative mt-2 aspect-[16/9] w-full overflow-hidden border border-foreground/15 bg-foreground/[0.03]">
                      <Image
                        src={
                          pkg.image
                        }
                        alt={
                          pkg.name
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 650px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 border border-foreground/15 px-4 py-5">
                    <p className="font-sans text-xs text-foreground/45">
                      No image is
                      currently set for
                      this package.
                    </p>
                  </div>
                )}

                {/* NEW IMAGE */}

                <div className="mt-5">
                  <label
                    htmlFor={`image-${pkg.id}`}
                    className={
                      labelClassName
                    }
                  >
                    {pkg.image
                      ? "Replace Image"
                      : "Add Image"}
                  </label>

                  <div className="mt-2 border border-dashed border-foreground/25 p-4">
                    <input
                      id={`image-${pkg.id}`}
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={
                        pending
                      }
                      className="
                        block
                        w-full
                        cursor-pointer
                        font-sans
                        text-xs
                        text-foreground/55

                        file:mr-4
                        file:border-0
                        file:bg-foreground
                        file:px-4
                        file:py-3
                        file:font-sans
                        file:text-[10px]
                        file:font-bold
                        file:uppercase
                        file:tracking-[0.12em]
                        file:text-background
                        file:transition

                        hover:file:bg-primary

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                    <p className="mt-3 font-sans text-[10px] leading-5 text-foreground/40">
                      JPG, PNG, or WebP.
                      For the best
                      storefront result,
                      use a wide,
                      high-quality food
                      image.
                    </p>
                  </div>
                </div>
              </section>

              {/* =================================
                  DESCRIPTION
              ================================= */}

              <Field
                label="Description"
              >
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
                  className={`${inputClassName} min-h-28 resize-y`}
                />
              </Field>

              {/* =================================
                  PACKAGE ITEMS
              ================================= */}

              <section className="border-t border-foreground/15 pt-7">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Package Contents
                </p>

                <h4 className="mt-2 font-rye text-xl text-foreground">
                  Included Items
                </h4>

                <p className="mt-2 font-sans text-xs leading-5 text-foreground/45">
                  Choose which
                  catering items are
                  included and their
                  quantities.
                </p>

                <div className="mt-5 border-t border-foreground/15">
                  {cateringItems.map(
                    (
                      item,
                      index
                    ) => {
                      const selected =
                        item.id in
                        selectedItems;

                      return (
                        <div
                          key={
                            item.id
                          }
                          className="flex flex-col gap-4 border-b border-foreground/15 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <label className="flex cursor-pointer items-center gap-3">
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
                              className="h-4 w-4 accent-primary"
                            />

                            <span className="flex items-center gap-3">
                              <span className="font-sans text-[9px] font-bold text-primary">
                                {String(
                                  index +
                                    1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <span className="font-sans text-sm font-semibold text-foreground">
                                {
                                  item.name
                                }
                              </span>
                            </span>
                          </label>

                          {selected && (
                            <div className="flex items-center gap-3">
                              <label
                                htmlFor={`quantity-${pkg.id}-${item.id}`}
                                className={
                                  labelClassName
                                }
                              >
                                Qty
                              </label>

                              <input
                                id={`quantity-${pkg.id}-${item.id}`}
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
                                className="min-h-10 w-20 border border-foreground/20 bg-background px-3 py-2 font-sans text-sm outline-none focus:border-primary"
                              />
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </section>

              {/* =================================
                  RESULT
              ================================= */}

              {updateState.message && (
                <div
                  role={
                    updateState.success
                      ? "status"
                      : "alert"
                  }
                  className={`border px-4 py-4 ${
                    updateState.success
                      ? "border-secondary/30 bg-secondary/10"
                      : "border-accent/30 bg-accent/10"
                  }`}
                >
                  <p
                    className={
                      updateState.success
                        ? "font-sans text-sm font-medium text-foreground"
                        : "font-sans text-sm font-medium text-accent"
                    }
                  >
                    {
                      updateState.message
                    }
                  </p>
                </div>
              )}

              {/* =================================
                  SAVE
              ================================= */}

              <button
                type="submit"
                disabled={
                  pending
                }
                className="group flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[190px]"
              >
                <span>
                  {updatePending
                    ? "Saving..."
                    : "Save Changes"}
                </span>

                {!updatePending && (
                  <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>
          </div>
        </details>

        {/* =========================================
            DELETE
        ========================================= */}

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
            className="min-h-10 px-2 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-accent transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletePending
              ? "Deleting..."
              : "Delete"}
          </button>
        </form>
      </div>

      {/* =========================================
          TOGGLE RESULT
      ========================================= */}

      {toggleState.message && (
        <p className="mt-3 font-sans text-xs leading-5 text-foreground/55">
          {
            toggleState.message
          }
        </p>
      )}

      {/* =========================================
          DELETE RESULT
      ========================================= */}

      {deleteState.message && (
        <p
          className={`mt-3 font-sans text-xs leading-5 ${
            deleteState.success
              ? "text-foreground/55"
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

/* =============================================
   FIELD
============================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className={
          labelClassName
        }
      >
        {label}
      </p>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

/* =============================================
   STYLES
============================================= */

const labelClassName =
  "block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45";

const inputClassName =
  "min-h-12 w-full border border-foreground/20 bg-background px-4 py-3 font-sans text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";