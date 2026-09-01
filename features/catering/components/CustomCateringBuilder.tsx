"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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
  const [guestCount, setGuestCount] =
    useState(20);

  const [
    showRequestForm,
    setShowRequestForm,
  ] = useState(false);

  const [
    selectedItems,
    setSelectedItems,
  ] = useState<SelectedItem[]>([]);

  function getSelectedItem(
    itemId: string
  ) {
    return selectedItems.find(
      (item) => item.id === itemId
    );
  }

  function addItem(
    item: PublicCateringItem
  ) {
    const existing =
      getSelectedItem(item.id);

    if (existing) {
      return;
    }

    setSelectedItems((current) => [
      ...current,
      {
        id: item.id,

        quantity:
          item.minimumQuantity ?? 1,
      },
    ]);
  }

  function removeItem(
    itemId: string
  ) {
    setSelectedItems((current) =>
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
      item.minimumQuantity ?? 1;

    const safeQuantity =
      Math.max(
        minimum,
        Math.floor(quantity)
      );

    setSelectedItems((current) =>
      current.map((selected) =>
        selected.id === item.id
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
      getSelectedItem(item.id);

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
      getSelectedItem(item.id);

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
        (total, selected) => {
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
      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-5">
        <ol className="grid gap-3 text-sm font-semibold text-foreground/60 sm:grid-cols-2 lg:grid-cols-4">
          {["1. Choose Food", "2. Event Details", "3. Contact Details", "4. Submit Request"].map((step) => (
            <li key={step} className="rounded-xl border border-black/10 bg-background px-3 py-2 text-center">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">
              Event Details
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Enter your expected guest count before selecting quantities.
            </p>

            <label htmlFor="guestCount" className="mt-4 block text-sm font-semibold">
              Guest Count
            </label>
            <input
              id="guestCount"
              type="number"
              min={1}
              value={guestCount}
              onChange={(event) =>
                setGuestCount(
                  Math.max(1, Number(event.target.value) || 1)
                )
              }
              className="mt-2 w-full max-w-xs rounded-xl border border-black/10 bg-background px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </section>

          <section className="mt-6">
            <h2 className="text-2xl font-bold text-foreground">
              Choose Food
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {items.map((item) => {
                const selected = getSelectedItem(item.id);
                const minQuantity = item.minimumQuantity ?? 1;

                return (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                      selected
                        ? "border-primary/40"
                        : "border-black/10"
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-foreground/40">
                          No image available
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          {item.category && (
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                              {item.category}
                            </p>
                          )}
                          <h3 className="mt-2 text-lg font-bold text-foreground">
                            {item.name}
                          </h3>
                        </div>
                        {selected && (
                          <span className="rounded-full border border-secondary/25 bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                            Selected
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-3 text-sm leading-6 text-foreground/60">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-4">
                        <span className="text-lg font-bold text-primary">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="ml-1 text-sm text-foreground/50">
                          {item.pricingType === "per_person" ? "/ person" : "/ item"}
                        </span>
                      </div>

                      {item.minimumQuantity && (
                        <p className="mt-2 text-xs text-foreground/50">
                          Minimum quantity: {item.minimumQuantity}
                        </p>
                      )}

                      {!selected ? (
                        <button
                          type="button"
                          onClick={() => addItem(item)}
                          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90"
                        >
                          Add to Request
                        </button>
                      ) : (
                        <div className="mt-5 space-y-3">
                          <label
                            htmlFor={`quantity-${item.id}`}
                            className="text-sm font-semibold"
                          >
                            Quantity
                          </label>

                          <div className="inline-flex items-center rounded-xl border border-black/10">
                            <button
                              type="button"
                              aria-label={`Decrease quantity for ${item.name}`}
                              onClick={() =>
                                decreaseQuantity(item)
                              }
                              className="min-h-10 min-w-10 rounded-l-xl px-3 text-lg font-semibold transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                              disabled={
                                selected.quantity <= minQuantity
                              }
                            >
                              −
                            </button>
                            <input
                              id={`quantity-${item.id}`}
                              type="number"
                              min={minQuantity}
                              value={selected.quantity}
                              onChange={(event) =>
                                changeQuantity(
                                  item,
                                  Number(event.target.value)
                                )
                              }
                              className="w-16 border-x border-black/10 bg-white px-2 py-2 text-center font-semibold outline-none"
                            />
                            <button
                              type="button"
                              aria-label={`Increase quantity for ${item.name}`}
                              onClick={() =>
                                increaseQuantity(item)
                              }
                              className="min-h-10 min-w-10 rounded-r-xl px-3 text-lg font-semibold transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="text-sm font-semibold text-accent transition hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-black/10 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-foreground">
            Request Summary
          </h2>

          <div className="mt-5">
            <p className="text-sm text-foreground/50">
              Guests
            </p>
            <p className="mt-1 font-semibold">
              {guestCount}
            </p>
          </div>

          <div className="mt-6 border-t border-black/10 pt-5">
            <p className="text-sm font-semibold text-foreground/50">
              Selected Items
            </p>

            {selectedItems.length === 0 ? (
              <p className="mt-3 text-sm text-foreground/60">
                No items selected.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {selectedItems.map((selected) => {
                  const item = items.find(
                    (item) =>
                      item.id === selected.id
                  );

                  if (!item) {
                    return null;
                  }

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {item.name}
                        </p>
                        <p className="text-foreground/50">
                          × {selected.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 font-semibold">
                        $
                        {calculateItemTotal(
                          item,
                          selected.quantity,
                          guestCount
                        ).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-black/10 pt-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                Estimated Subtotal
              </span>

              <span className="text-xl font-bold text-primary">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-foreground/50">
              Final pricing will be confirmed after your catering request is reviewed.
            </p>
          </div>

          <button
            type="button"
            disabled={selectedItems.length === 0}
            onClick={() =>
              setShowRequestForm(true)
            }
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to Contact Details
          </button>
        </aside>
      </div>

      {showRequestForm && (
        <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
              Final Step
            </p>

            <h2 className="mt-2 text-2xl font-bold text-foreground">
              Contact & Event Details
            </h2>

            <p className="mt-2 text-foreground/60">
              Submit your event and contact information to send this request for review.
            </p>
          </div>

          <CustomCateringRequestForm
            guestCount={guestCount}
            selectedItems={selectedItems}
          />
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

  return item.price * quantity;
}