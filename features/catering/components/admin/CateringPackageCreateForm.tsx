"use client";

import {
  useActionState,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createCateringPackage,
  type CreateCateringPackageActionState,
} from "@/actions/catering/createCateringPackage";

interface CateringPackageCreateFormProps {
  cateringItems: {
    id: string;
    name: string;
    price: number;

    pricingType:
      | "flat"
      | "per_person";
  }[];
}

const initialState:
  CreateCateringPackageActionState = {
    success: false,
    message: "",
  };

export default function CateringPackageCreateForm({
  cateringItems,
}: CateringPackageCreateFormProps) {
  const formRef =
    useRef<HTMLFormElement>(
      null
    );

  /*
   * Object structure:
   *
   * {
   *   "itemId123": 2,
   *   "itemId456": 1
   * }
   */
  const [
    selectedItems,
    setSelectedItems,
  ] =
    useState<
      Record<
        string,
        number
      >
    >({});

  const [
    state,
    formAction,
    pending,
  ] =
    useActionState(
      async (
        previousState:
          CreateCateringPackageActionState,
        formData:
          FormData
      ) => {
        const nextState =
          await createCateringPackage(
            previousState,
            formData
          );

        if (
          nextState.success
        ) {
          formRef.current?.reset();

          setSelectedItems(
            {}
          );
        }

        return nextState;
      },
      initialState
    );

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
      [
        selectedItems,
      ]
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

  function changeQuantity(
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
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <input
        type="hidden"
        name="itemsJson"
        value={
          itemsJson
        }
      />

      {/* =========================================
          HEADER
      ========================================= */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          New Package
        </p>

        <h2 className="mt-2 font-rye text-2xl text-foreground sm:text-3xl">
          Add Catering Package
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/60">
          Combine existing catering
          items into a customer-facing
          package.
        </p>
      </div>

      {/* =========================================
          BASIC DETAILS
      ========================================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {/* NAME */}

        <div>
          <label
            htmlFor="name"
            className={
              labelClassName
            }
          >
            Package Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            disabled={
              pending
            }
            placeholder="Family Package"
            className={
              inputClassName
            }
          />

          {state.fieldErrors
            ?.name?.[0] && (
            <p className={
              errorClassName
            }>
              {
                state
                  .fieldErrors
                  .name[0]
              }
            </p>
          )}
        </div>

        {/* PRICE */}

        <div>
          <label
            htmlFor="price"
            className={
              labelClassName
            }
          >
            Package Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            disabled={
              pending
            }
            placeholder="199.99"
            className={
              inputClassName
            }
          />

          {state.fieldErrors
            ?.price?.[0] && (
            <p className={
              errorClassName
            }>
              {
                state
                  .fieldErrors
                  .price[0]
              }
            </p>
          )}
        </div>

        {/* PRICING TYPE */}

        <div>
          <label
            htmlFor="pricingType"
            className={
              labelClassName
            }
          >
            Pricing Type
          </label>

          <select
            id="pricingType"
            name="pricingType"
            defaultValue="flat"
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
        </div>

        {/* DISPLAY ORDER */}

        <div>
          <label
            htmlFor="displayOrder"
            className={
              labelClassName
            }
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
            disabled={
              pending
            }
            className={
              inputClassName
            }
          />
        </div>

        {/* MINIMUM GUESTS */}

        <div>
          <label
            htmlFor="minimumGuests"
            className={
              labelClassName
            }
          >
            Minimum Guests
          </label>

          <input
            id="minimumGuests"
            name="minimumGuests"
            type="number"
            min="1"
            step="1"
            defaultValue="1"
            disabled={
              pending
            }
            className={
              inputClassName
            }
          />

          {state.fieldErrors
            ?.minimumGuests?.[0] && (
            <p className={
              errorClassName
            }>
              {
                state
                  .fieldErrors
                  .minimumGuests[0]
              }
            </p>
          )}
        </div>

        {/* MAXIMUM GUESTS */}

        <div>
          <label
            htmlFor="maximumGuests"
            className={
              labelClassName
            }
          >
            Maximum Guests
          </label>

          <input
            id="maximumGuests"
            name="maximumGuests"
            type="number"
            min="1"
            step="1"
            disabled={
              pending
            }
            placeholder="Optional"
            className={
              inputClassName
            }
          />

          {state.fieldErrors
            ?.maximumGuests?.[0] && (
            <p className={
              errorClassName
            }>
              {
                state
                  .fieldErrors
                  .maximumGuests[0]
              }
            </p>
          )}
        </div>
      </div>

      {/* =========================================
          PACKAGE IMAGE
      ========================================= */}

      <section className="mt-7 border-y border-foreground/15 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Package Image
          </p>

          <h3 className="mt-2 font-rye text-xl text-foreground">
            Show Off the Feast
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/50">
            Upload a photo that
            represents this package.
            This image will be shown
            to customers on the
            catering page and package
            detail page.
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="image"
            className={
              labelClassName
            }
          >
            Package Photo
          </label>

          <div className="mt-2 border border-dashed border-foreground/25 bg-background p-5">
            <input
              id="image"
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

            <p className="mt-3 text-xs leading-5 text-foreground/40">
              JPG, PNG, or WebP.
              Choose a wide,
              high-quality food photo
              for the best result.
            </p>
          </div>

          {state.fieldErrors
            ?.image?.[0] && (
            <p className={
              errorClassName
            }>
              {
                state
                  .fieldErrors
                  .image[0]
              }
            </p>
          )}
        </div>
      </section>

      {/* =========================================
          DESCRIPTION
      ========================================= */}

      <div className="mt-6">
        <label
          htmlFor="description"
          className={
            labelClassName
          }
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={4}
          disabled={
            pending
          }
          placeholder="Describe the package..."
          className={`${inputClassName} min-h-28 resize-y`}
        />
      </div>

      {/* =========================================
          PACKAGE ITEMS
      ========================================= */}

      <section className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Package Contents
        </p>

        <h3 className="mt-2 font-rye text-xl text-foreground">
          Included Items
        </h3>

        <p className="mt-2 text-sm leading-6 text-foreground/60">
          Select what is included and
          choose the quantity of each
          item.
        </p>

        {cateringItems.length ===
        0 ? (
          <div className="mt-5 border border-accent/20 bg-accent/10 p-5">
            <p className="text-sm text-accent">
              You need at least one
              available catering item
              before creating a
              package.
            </p>
          </div>
        ) : (
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
                    className="flex flex-col gap-4 border-b border-foreground/15 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <label className="flex cursor-pointer items-start gap-4">
                      <input
                        type="checkbox"
                        checked={
                          selected
                        }
                        disabled={
                          pending
                        }
                        onChange={() =>
                          toggleItem(
                            item.id
                          )
                        }
                        className="mt-1 h-4 w-4 accent-primary"
                      />

                      <span>
                        <span className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-primary">
                            {String(
                              index +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <span className="font-semibold text-foreground">
                            {
                              item.name
                            }
                          </span>
                        </span>

                        <span className="mt-2 block text-xs text-foreground/45">
                          $
                          {item.price.toFixed(
                            2
                          )}

                          {" · "}

                          {item.pricingType ===
                          "per_person"
                            ? "per person"
                            : "flat"}
                        </span>
                      </span>
                    </label>

                    {selected && (
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor={`quantity-${item.id}`}
                          className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/45"
                        >
                          Qty
                        </label>

                        <input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          value={
                            selectedItems[
                              item.id
                            ]
                          }
                          disabled={
                            pending
                          }
                          onChange={(
                            event
                          ) =>
                            changeQuantity(
                              item.id,

                              Number(
                                event
                                  .target
                                  .value
                              )
                            )
                          }
                          className="min-h-10 w-20 border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}

        {state.fieldErrors
          ?.items?.[0] && (
          <p className={
            errorClassName
          }>
            {
              state
                .fieldErrors
                .items[0]
            }
          </p>
        )}
      </section>

      {/* =========================================
          AVAILABILITY
      ========================================= */}

      <label className="mt-7 flex min-h-12 cursor-pointer items-center gap-3 border-y border-foreground/15 py-4">
        <input
          type="checkbox"
          name="available"
          defaultChecked
          disabled={
            pending
          }
          className="h-4 w-4 accent-primary"
        />

        <div>
          <span className="block text-sm font-semibold text-foreground">
            Available to customers
          </span>

          <span className="mt-1 block text-xs text-foreground/45">
            Customers will be able
            to see and request this
            package.
          </span>
        </div>
      </label>

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
          <p
            className={
              state.success
                ? "text-sm font-medium text-foreground"
                : "text-sm font-medium text-accent"
            }
          >
            {
              state.message
            }
          </p>
        </div>
      )}

      {/* =========================================
          SUBMIT
      ========================================= */}

      <button
        type="submit"
        disabled={
          pending ||
          cateringItems.length ===
            0
        }
        className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
      >
        <span>
          {pending
            ? "Creating..."
            : "Add Package"}
        </span>

        {!pending && (
          <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </button>
    </form>
  );
}

const labelClassName =
  "block text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45";

const inputClassName =
  "mt-2 min-h-12 w-full border border-foreground/20 bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50";

const errorClassName =
  "mt-2 text-xs font-medium leading-5 text-accent";