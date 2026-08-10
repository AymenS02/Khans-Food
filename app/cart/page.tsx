"use client";

import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-20 text-center">

        <h1 className="text-4xl font-bold">
          Your cart is empty
        </h1>

        <p className="mt-4 text-foreground/60">
          Browse our menu and add something delicious.
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-bold">
        Shopping Cart
      </h1>

      {/* we'll add the UI next */}
    </main>
  );
}