"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import CustomCateringRequestForm from "./CustomCateringRequestForm";

import type { PublicCateringItem } from "../types/catering";

interface CustomCateringBuilderProps {
  items: PublicCateringItem[];
}

interface SelectedItem {
  id: string;
  quantity: number;
}

export default function CustomCateringBuilder({
  items,
}: CustomCateringBuilderProps) {
  const [
    guestCount,
    setGuestCount,
  ] = useState(20);

  const [
    showRequestForm,
    setShowRequestForm,
  ] = useState(false);

  const [
    selectedItems,
    setSelectedItems,
  ] =
    useState<SelectedItem[]>(
      []
    );

  const requestFormRef =
    useRef<HTMLElement>(
      null
    );

  useEffect(() => {
    if (!showRequestForm) {
      return;
    }

    requestFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [showRequestForm]);

  function getSelectedItem(
    itemId: string
  ) {
    return selectedItems.find(
      (item) =>
        item.id === itemId
    );
  }

  function addItem(
    item: PublicCateringItem
  ) {
    const existing =
      getSelectedItem(
        item.id
      );

    if (existing) {
      return;
    }

    setSelectedItems(
      (current) => [
        ...current,
        {
          id: item.id,
          quantity:
            item.minimumQuantity ??
            1,
        },
      ]
    );
  }

  function removeItem(
    itemId: string
  ) {
    setSelectedItems(
      (current) =>
        current.filter(
          (item) =>
            item.id !== itemId
        )
    );
  }

  function changeQuantity(
    item: PublicCateringItem,
    quantity: number
  ) {
    const minimum =
      item.minimumQuantity ??
      1;

    const safeQuantity =
      Math.max(
        minimum,
        Math.floor(
          quantity
        )
      );

    setSelectedItems(
      (current) =>
        current.map(
          (selected) =>
            selected.id ===
            item.id
              ? {
                  ...selected,
                  quantity:
                    safeQuantity,
                }
              : selected
        )
    );
  }

  function increaseQuantity(
    item: PublicCateringItem
  ) {
    const selected =
      getSelectedItem(
        item.id
      );

    if (!selected) {
      return;
    }

    changeQuantity(
      item,
      selected.quantity + 1
    );
  }

  function decreaseQuantity(
    item: PublicCateringItem
  ) {
    const selected =
      getSelectedItem(
        item.id
      );

    if (!selected) {
      return;
    }

    changeQuantity(
      item,
      selected.quantity - 1
    );
  }

  const subtotal =
    useMemo(() => {
      return selectedItems.reduce(
        (
          total,
          selected
        ) => {
          const item =
            items.find(
              (item) =>
                item.id ===
                selected.id
            );

          if (!item) {
            return total;
          }

          if (
            item.pricingType ===
            "per_person"
          ) {
            return (
              total +
              item.price *
                guestCount *
                selected.quantity
            );
          }

          return (
            total +
            item.price *
              selected.quantity
          );
        },
        0
      );
    }, [
      selectedItems,
      items,
      guestCount,
    ]);

  return (
    <>
      {/* ======================================
          PROGRESS
      ====================================== */}

      <div className="border-y border-foreground/15 py-6">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Choose Food",
            "Event Details",
            "Contact Details",
            "Submit Request",
          ].map(
            (
              step,
              index
            ) => (
              <li
                key={step}
                className="flex items-center gap-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 font-sans text-[11px] font-bold text-primary">
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-foreground/65">
                  {step}
                </span>
              </li>
            )
          )}
        </ol>
      </div>

      {/* ======================================
          MAIN LAYOUT
      ====================================== */}

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-14">
        <div>
          {/* ==================================
              GUEST COUNT
          ================================== */}

          <section className="border-b border-foreground/15 pb-12">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Event Size
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
              How Many Guests?
            </h2>

            <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-foreground/55">
              Enter your expected
              guest count before
              choosing your menu.
              Per-person items use this
              number when estimating
              your subtotal.
            </p>

            <div className="mt-7">
              <label
                htmlFor="guestCount"
                className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-foreground/55"
              >
                Guest Count
              </label>

              <input
                id="guestCount"
                type="number"
                min={1}
                value={
                  guestCount
                }
                onChange={(
                  event
                ) =>
                  setGuestCount(
                    Math.max(
                      1,
                      Number(
                        event
                          .target
                          .value
                      ) || 1
                    )
                  )
                }
                className="mt-3 block w-full max-w-[180px] border border-foreground/20 bg-transparent px-4 py-3 font-sans text-lg font-semibold outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </section>

          {/* ==================================
              FOOD
          ================================== */}

          <section className="mt-14">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Build Your Menu
              </p>

              <h2 className="mt-3 font-rye text-4xl text-foreground sm:text-5xl">
                Choose Your Food
              </h2>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px w-16 bg-foreground/25" />

                <span className="text-xs text-primary">
                  ◆
                </span>
              </div>
            </div>

            <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2">
              {items.map(
                (
                  item,
                  index
                ) => {
                  const selected =
                    getSelectedItem(
                      item.id
                    );

                  const minQuantity =
                    item.minimumQuantity ??
                    1;

                  return (
                    <article
                      key={
                        item.id
                      }
                      className="group flex h-full flex-col"
                    >
                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-foreground/5">
                        {item.image ? (
                          <Image
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition duration-700 motion-safe:group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-4 text-center font-sans text-sm text-foreground/40">
                            No image
                            available
                          </div>
                        )}

                        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center bg-background font-sans text-[11px] font-bold">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        {selected && (
                          <div className="absolute right-4 top-4 bg-secondary px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                            Selected
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}

                      <div
                        className={`flex flex-1 flex-col border-b py-5 transition ${
                          selected
                            ? "border-primary"
                            : "border-foreground/15"
                        }`}
                      >
                        {item.category && (
                          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                            {
                              item.category
                            }
                          </p>
                        )}

                        <div className="mt-2 flex items-start justify-between gap-5">
                          <h3 className="font-rye text-2xl leading-tight">
                            {
                              item.name
                            }
                          </h3>

                          <div className="shrink-0 text-right">
                            <p className="font-sans text-sm font-bold text-primary">
                              $
                              {item.price.toFixed(
                                2
                              )}
                            </p>

                            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.1em] text-foreground/40">
                              {item.pricingType ===
                              "per_person"
                                ? "per person"
                                : "per item"}
                            </p>
                          </div>
                        </div>

                        {item.description && (
                          <p className="mt-3 font-sans text-sm leading-6 text-foreground/55">
                            {
                              item.description
                            }
                          </p>
                        )}

                        {item.minimumQuantity && (
                          <p className="mt-3 font-sans text-xs text-foreground/40">
                            Minimum
                            quantity:{" "}
                            {
                              item.minimumQuantity
                            }
                          </p>
                        )}

                        <div className="mt-auto pt-6">
                          {!selected ? (
                            <button
                              type="button"
                              onClick={() =>
                                addItem(
                                  item
                                )
                              }
                              className="group/button flex min-h-11 w-full items-center justify-between border border-foreground/25 px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] transition hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                              Add to Request

                              <span className="text-lg transition-transform group-hover/button:translate-x-1">
                                +
                              </span>
                            </button>
                          ) : (
                            <div className="space-y-4">
                              <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-foreground/50">
                                Quantity
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="inline-flex items-center border border-foreground/20">
                                  <button
                                    type="button"
                                    aria-label={`Decrease quantity for ${item.name}`}
                                    onClick={() =>
                                      decreaseQuantity(
                                        item
                                      )
                                    }
                                    disabled={
                                      selected.quantity <=
                                      minQuantity
                                    }
                                    className="min-h-10 min-w-10 px-3 text-lg font-semibold transition hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                  >
                                    −
                                  </button>

                                  <input
                                    id={`quantity-${item.id}`}
                                    type="number"
                                    min={
                                      minQuantity
                                    }
                                    value={
                                      selected.quantity
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      changeQuantity(
                                        item,
                                        Number(
                                          event
                                            .target
                                            .value
                                        )
                                      )
                                    }
                                    className="w-16 border-x border-foreground/20 bg-transparent px-2 py-2 text-center font-sans font-semibold outline-none"
                                  />

                                  <button
                                    type="button"
                                    aria-label={`Increase quantity for ${item.name}`}
                                    onClick={() =>
                                      increaseQuantity(
                                        item
                                      )
                                    }
                                    className="min-h-10 min-w-10 px-3 text-lg font-semibold transition hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      item.id
                                    )
                                  }
                                  className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-accent transition hover:opacity-70"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        </div>

        {/* ====================================
            SUMMARY
        ==================================== */}

        <aside className="h-fit border border-foreground/15 bg-foreground text-background lg:sticky lg:top-28">
          <div className="p-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Your Request
            </p>

            <h2 className="mt-3 font-rye text-3xl">
              Feast Summary
            </h2>

            <div className="my-6 h-px bg-background/15" />

            <div>
              <p className="font-sans text-xs uppercase tracking-[0.15em] text-background/45">
                Guests
              </p>

              <p className="mt-1 font-rye text-2xl">
                {guestCount}
              </p>
            </div>

            <div className="mt-6 border-t border-background/15 pt-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-background/45">
                Selected Items
              </p>

              {selectedItems.length ===
              0 ? (
                <p className="mt-4 font-sans text-sm leading-6 text-background/50">
                  Nothing selected yet.
                  Start building your
                  feast from the menu.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {selectedItems.map(
                    (
                      selected
                    ) => {
                      const item =
                        items.find(
                          (
                            item
                          ) =>
                            item.id ===
                            selected.id
                        );

                      if (!item) {
                        return null;
                      }

                      return (
                        <div
                          key={
                            item.id
                          }
                          className="flex justify-between gap-4 font-sans text-sm"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {
                                item.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-background/40">
                              Qty{" "}
                              {
                                selected.quantity
                              }
                            </p>
                          </div>

                          <p className="shrink-0 font-semibold">
                            $
                            {calculateItemTotal(
                              item,
                              selected.quantity,
                              guestCount
                            ).toFixed(
                              2
                            )}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div className="mt-7 border-t border-background/15 pt-6">
              <p className="font-sans text-xs uppercase tracking-[0.15em] text-background/45">
                Estimated Subtotal
              </p>

              <p className="mt-2 font-rye text-4xl text-primary">
                $
                {subtotal.toFixed(
                  2
                )}
              </p>

              <p className="mt-3 font-sans text-xs leading-5 text-background/45">
                Final pricing is
                confirmed after your
                catering request is
                reviewed.
              </p>
            </div>

            <button
              type="button"
              disabled={
                selectedItems.length ===
                0
              }
              onClick={() =>
                setShowRequestForm(
                  true
                )
              }
              className="mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.13em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Continue

              <span className="text-lg">
                →
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* ======================================
          REQUEST FORM
      ====================================== */}

      {showRequestForm && (
        <section
          ref={requestFormRef}
          className="mt-20 scroll-mt-32 border-t border-foreground/15 pt-16"
        >
          <div className="max-w-3xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Final Step
            </p>

            <h2 className="mt-4 font-rye text-4xl sm:text-5xl">
              Tell Us About Your
              Event.
            </h2>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-16 bg-foreground/25" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="max-w-xl font-sans text-sm leading-6 text-foreground/55">
              Enter your contact and
              event information below
              to submit your catering
              request for review.
            </p>
          </div>

          <div className="mt-10">
            <CustomCateringRequestForm
              guestCount={
                guestCount
              }
              selectedItems={
                selectedItems
              }
            />
          </div>
        </section>
      )}
    </>
  );
}

function calculateItemTotal(
  item: PublicCateringItem,
  quantity: number,
  guestCount: number
) {
  if (
    item.pricingType ===
    "per_person"
  ) {
    return (
      item.price *
      guestCount *
      quantity
    );
  }

  return (
    item.price *
    quantity
  );
}