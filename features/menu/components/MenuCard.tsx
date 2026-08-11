"use client";

import Image from "next/image";
import { useCartStore } from "@/stores/cartStore";

import type { MenuItem } from "../types/menu";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({
  item,
}: MenuCardProps) {
  const addItem = useCartStore(
    (state) => state.addItem
  );

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Image */}
      {item.image ? (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-background">
          <p className="text-sm text-foreground/50">
            Image coming soon
          </p>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">
            {item.name}
          </h2>

          <span className="shrink-0 font-semibold text-primary">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            {item.description}
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            addItem({
              id: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
            })
          }
          className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}