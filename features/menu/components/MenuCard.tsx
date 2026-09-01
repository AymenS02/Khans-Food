"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useCartStore } from "@/stores/cartStore";

import type { MenuItem } from "../types/menu";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const prefersReducedMotion =
    usePrefersReducedMotion();
  const isUnavailable = !item.available;

  useEffect(() => {
    if (!isAdded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsAdded(false);
    }, 750);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isAdded]);

  const handleAddToCart = () => {
    if (isUnavailable) {
      return;
    }

    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    setIsAdded(true);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">
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
            className="object-cover transition duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <span className="text-sm font-medium text-foreground/40">No image available</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            {item.name}
          </h2>

          <span className="shrink-0 text-lg font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/60">
            {item.description}
          </p>
        )}

        {isUnavailable && (
          <p className="mt-4 inline-flex w-fit rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            Currently unavailable
          </p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isUnavailable}
          className={`mt-5 min-h-11 w-full rounded-xl px-4 py-3 font-semibold text-white outline-none transition focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-45 ${
            isAdded
              ? "bg-secondary"
              : "bg-primary hover:opacity-90"
          }`}
        >
          {isUnavailable
            ? "Unavailable"
            : isAdded
              ? "Added"
              : "Add to Cart"}
        </button>
        <span className="sr-only" aria-live="polite">
          {isAdded
            ? `${item.name} added to cart`
            : ""}
        </span>
        {!prefersReducedMotion && isAdded && (
          <span className="mt-2 text-center text-xs font-medium text-secondary">
            Added to cart
          </span>
        )}
      </div>
    </article>
  );
}
