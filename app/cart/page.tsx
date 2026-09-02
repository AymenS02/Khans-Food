"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const items =
    useCartStore(
      (state) =>
        state.items
    );

  const increaseQuantity =
    useCartStore(
      (state) =>
        state.increaseQuantity
    );

  const decreaseQuantity =
    useCartStore(
      (state) =>
        state.decreaseQuantity
    );

  const removeItem =
    useCartStore(
      (state) =>
        state.removeItem
    );

  const subtotal =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  const totalItems =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.quantity,
      0
    );

  /*
   * ============================================
   * EMPTY CART
   * ============================================
   */

  if (
    items.length === 0
  ) {
    return (
      <main className="overflow-hidden">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="border-y border-foreground/15 py-16 text-center sm:py-24">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Your Order
            </p>

            <h1 className="mx-auto mt-5 max-w-2xl font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Cart Is Empty.
            </h1>

            <div className="mx-auto my-7 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-foreground/25" />

              <span className="text-xs text-primary">
                ◆
              </span>

              <div className="h-px w-16 bg-foreground/25" />
            </div>

            <p className="mx-auto max-w-lg font-sans text-sm leading-6 text-foreground/55 sm:text-base">
              Browse the menu and add
              something delicious to
              get your order started.
            </p>

            <Link
              href="/menu"
              className="group mx-auto mt-8 flex min-h-12 w-full max-w-xs items-center justify-between bg-primary px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
            >
              Browse Menu

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="border-b border-foreground/15 pb-12 sm:pb-16">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Your Order
          </p>

          <h1 className="mt-4 font-rye text-5xl leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Shopping Cart
          </h1>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="font-sans text-sm text-foreground/55 sm:text-base">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            ready for your order.
          </p>
        </div>
      </section>

      {/* =========================================
          CART CONTENT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* =====================================
              CART ITEMS
          ===================================== */}

          <section>
            <div className="flex items-end justify-between border-b border-foreground/15 pb-5">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Your Food
                </p>

                <h2 className="mt-2 font-rye text-3xl text-foreground sm:text-4xl">
                  Cart Items
                </h2>
              </div>

              <p className="font-sans text-xs text-foreground/40">
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </p>
            </div>

            <ul>
              {items.map(
                (
                  item,
                  index
                ) => (
                  <li
                    key={
                      item.id
                    }
                    className="border-b border-foreground/15 py-7 sm:py-8"
                  >
                    <div className="grid gap-5 sm:grid-cols-[120px_1fr] sm:gap-6">
                      {/* =========================
                          IMAGE
                      ========================= */}

                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5 sm:aspect-square sm:w-[120px]">
                        {item.image ? (
                          <Image
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, 120px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-4 text-center font-sans text-xs text-foreground/35">
                            No image
                          </div>
                        )}

                        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center bg-background font-sans text-[10px] font-bold">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>
                      </div>

                      {/* =========================
                          CONTENT
                      ========================= */}

                      <div className="flex min-w-0 flex-col">
                        <div className="flex items-start justify-between gap-5">
                          <div className="min-w-0">
                            <h3 className="font-rye text-xl leading-tight text-foreground sm:text-2xl">
                              {
                                item.name
                              }
                            </h3>

                            <p className="mt-2 font-sans text-xs text-foreground/45">
                              $
                              {item.price.toFixed(
                                2
                              )}{" "}
                              each
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                              Subtotal
                            </p>

                            <p className="mt-1 font-rye text-xl text-primary sm:text-2xl">
                              $
                              {(
                                item.price *
                                item.quantity
                              ).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>

                        {/* =========================
                            CONTROLS
                        ========================= */}

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                          <div className="inline-flex items-center border border-foreground/20">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              aria-label={`Decrease quantity for ${item.name}`}
                              className="min-h-11 min-w-11 px-3 font-sans text-lg font-semibold transition hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                              −
                            </button>

                            <span className="min-w-12 border-x border-foreground/20 px-3 py-2 text-center font-sans text-sm font-bold">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              aria-label={`Increase quantity for ${item.name}`}
                              className="min-h-11 min-w-11 px-3 font-sans text-lg font-semibold transition hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                            aria-label={`Remove ${item.name} from cart`}
                            className="font-sans text-xs font-bold uppercase tracking-[0.13em] text-accent transition hover:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>

            {/* CONTINUE SHOPPING */}

            <Link
              href="/menu"
              className="group mt-8 inline-flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:text-primary"
            >
              <span className="transition-transform group-hover:-translate-x-1">
                ←
              </span>

              Continue Shopping
            </Link>
          </section>

          {/* =====================================
              ORDER SUMMARY
          ===================================== */}

          <aside className="h-fit bg-foreground text-background lg:sticky lg:top-28">
            <div className="p-6 sm:p-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Your Order
              </p>

              <h2 className="mt-3 font-rye text-3xl">
                Order Summary
              </h2>

              <div className="my-6 h-px bg-background/15" />

              {/* ITEMS */}

              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-background/45">
                  Items
                </span>

                <span className="font-sans text-sm font-semibold">
                  {totalItems}
                </span>
              </div>

              {/* SUBTOTAL */}

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="font-sans text-xs uppercase tracking-[0.15em] text-background/45">
                  Subtotal
                </span>

                <span className="font-sans text-sm font-semibold">
                  $
                  {subtotal.toFixed(
                    2
                  )}
                </span>
              </div>

              {/* TOTAL NOTE */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Estimated Total
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {subtotal.toFixed(
                    2
                  )}
                </p>

                <p className="mt-3 font-sans text-xs leading-5 text-background/45">
                  Tax and final total
                  are calculated and
                  confirmed during
                  checkout.
                </p>
              </div>

              {/* CHECKOUT */}

              <Link
                href="/checkout"
                className="group mt-7 flex min-h-12 w-full items-center justify-between bg-primary px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              >
                Proceed to Checkout

                <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* CONTINUE */}

              <Link
                href="/menu"
                className="mt-3 flex min-h-11 w-full items-center justify-center border border-background/25 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.13em] text-background transition hover:bg-background hover:text-foreground"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}