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
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              33vw
            "
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <span className="text-sm font-medium text-foreground/40">
              No image available
            </span>
          </div>
        )}
      </div>

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