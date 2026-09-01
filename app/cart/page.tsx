"use client";

import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem } = useCartStore((state) => ({
    items: state.items,
    increaseQuantity: state.increaseQuantity,
    decreaseQuantity: state.decreaseQuantity,
    removeItem: state.removeItem,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-20">
        <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Your cart is empty</h1>
          <p className="mt-4 text-foreground/60">Browse our menu and add something delicious.</p>
          <Link
            href="/menu"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Order</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Shopping Cart</h1>
        <p className="text-foreground/60">{totalItems} item{totalItems === 1 ? "" : "s"} in your cart</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <h2 className="sr-only">Cart items</h2>
          <ul className="divide-y divide-black/10">
            {items.map((item) => (
              <li key={item.id} className="p-4 sm:p-5">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-background">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-2 text-center text-xs text-foreground/50">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-base font-semibold sm:text-lg">{item.name}</h3>
                      <p className="font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-foreground/60">${item.price.toFixed(2)} each</p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-lg border border-black/10">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="min-h-10 min-w-10 rounded-l-lg px-3 text-lg font-semibold text-foreground transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-10 px-3 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="min-h-10 min-w-10 rounded-r-lg px-3 text-lg font-semibold text-foreground transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-5 space-y-3 border-t border-black/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs leading-5 text-foreground/50">Tax and final total are confirmed at checkout.</p>
          </div>

          <Link
            href="/checkout"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/menu"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-3 font-semibold text-foreground transition hover:bg-background"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}