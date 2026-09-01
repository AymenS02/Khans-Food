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
        previousState: CreateCateringPackageActionState,
        formData: FormData
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

      <div>
        <h2 className="text-xl font-bold">
          Add Catering Package
        </h2>

        <p className="mt-2 text-sm text-foreground/60">
          Combine existing catering
          items into a customer-facing
          package.
        </p>
      </div>

      {/* Basic details */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold"
          >
            Package Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            disabled={pending}
            placeholder="Family Package"
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
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

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold"
          >
            Package Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            disabled={pending}
            placeholder="199.99"
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
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

        <div>
          <label
            htmlFor="pricingType"
            className="block text-sm font-semibold"
          >
            Pricing Type
          </label>

          <select
            id="pricingType"
            name="pricingType"
            defaultValue="flat"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
          >
            <option value="flat">
              Flat Package Price
            </option>

            <option value="per_person">
              Per Person
            </option>
          </select>
        </div>

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
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="minimumGuests"
            className="block text-sm font-semibold"
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
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
          />

          {state.fieldErrors
            ?.minimumGuests?.[0] && (
            <p className="mt-2 text-sm text-accent">
              {
                state
                  .fieldErrors
                  .minimumGuests[0]
              }
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="maximumGuests"
            className="block text-sm font-semibold"
          >
            Maximum Guests
          </label>

          <input
            id="maximumGuests"
            name="maximumGuests"
            type="number"
            min="1"
            step="1"
            disabled={pending}
            placeholder="Optional"
            className="mt-2 w-full rounded-xl border border-black/10 bg-background px-4 py-3"
          />

          {state.fieldErrors
            ?.maximumGuests?.[0] && (
            <p className="mt-2 text-sm text-accent">
              {
                state
                  .fieldErrors
                  .maximumGuests[0]
              }
            </p>
          )}
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
          placeholder="Describe the package..."
          className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3"
        />
      </div>

      {/* Package items */}

      <section className="mt-7">
        <h3 className="font-bold">
          Package Items
        </h3>

        <p className="mt-1 text-sm text-foreground/60">
          Select what is included and
          choose the quantity of each
          item.
        </p>

        {cateringItems.length ===
        0 ? (
          <div className="mt-4 rounded-xl bg-background p-5">
            <p className="text-sm text-accent">
              You need at least one
              available catering item
              before creating a package.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10">
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
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <label className="flex cursor-pointer items-start gap-3">
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
                        className="mt-1 h-4 w-4"
                      />

                      <span>
                        <span className="block font-semibold">
                          {
                            item.name
                          }
                        </span>

                        <span className="mt-1 block text-xs text-foreground/50">
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
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`quantity-${item.id}`}
                          className="text-sm font-semibold"
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
                          className="w-20 rounded-lg border border-black/10 bg-background px-3 py-2"
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
          <p className="mt-2 text-sm text-accent">
            {
              state
                .fieldErrors
                .items[0]
            }
          </p>
        )}
      </section>

      {/* Availability */}

      <label className="mt-6 flex cursor-pointer items-center gap-3">
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
        <div className="mt-5 rounded-xl bg-background p-4">
          <p
            className={
              state.success
                ? "text-sm font-medium"
                : "text-sm font-medium text-accent"
            }
          >
            {
              state.message
            }
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          pending ||
          cateringItems.length ===
            0
        }
        className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending
          ? "Creating..."
          : "Add Package"}
      </button>
    </form>
  );
}