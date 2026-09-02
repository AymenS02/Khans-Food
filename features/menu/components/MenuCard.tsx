"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
} from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useCartStore } from "@/stores/cartStore";

import type { MenuItem } from "../types/menu";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({
  item,
}: MenuCardProps) {
  const addItem =
    useCartStore(
      (state) =>
        state.addItem
    );

  const [
    isAdded,
    setIsAdded,
  ] =
    useState(false);

  const prefersReducedMotion =
    usePrefersReducedMotion();

  const isUnavailable =
    !item.available;

  useEffect(() => {
    if (!isAdded) {
      return;
    }

    const timeout =
      window.setTimeout(
        () => {
          setIsAdded(
            false
          );
        },
        750
      );

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [isAdded]);

  const handleAddToCart =
    () => {
      if (
        isUnavailable
      ) {
        return;
      }

      addItem({
        id: item._id,
        name: item.name,
        price:
          item.price,
        image:
          item.image,
      });

      setIsAdded(true);
    };

  return (
    <article className="group flex h-full flex-col">
      {/* ======================================
          IMAGE
      ====================================== */}

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
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              33vw
            "
            className={`object-cover transition duration-700 ${
              !prefersReducedMotion
                ? "group-hover:scale-[1.04]"
                : ""
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <span className="font-sans text-sm text-foreground/35">
              No image
              available
            </span>
          </div>
        )}

        {/* UNAVAILABLE OVERLAY */}

        {isUnavailable && (
          <>
            <div className="absolute inset-0 bg-background/55 backdrop-blur-[1px]" />

            <div className="absolute left-4 top-4 border border-accent/30 bg-background px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Unavailable
            </div>
          </>
        )}
      </div>

      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="flex flex-1 flex-col border-b border-foreground/15 py-5">
        {/* CATEGORY */}

        {item.categoryName && (
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {
              item.categoryName
            }
          </p>
        )}

        {/* NAME / PRICE */}

        <div className="mt-2 flex items-start justify-between gap-5">
          <h2 className="font-rye text-2xl leading-tight text-foreground">
            {item.name}
          </h2>

          <span className="shrink-0 font-sans text-sm font-bold text-primary">
            $
            {item.price.toFixed(
              2
            )}
          </span>
        </div>

        {/* DESCRIPTION */}

        {item.description && (
          <p className="mt-3 line-clamp-3 font-sans text-sm leading-6 text-foreground/55">
            {
              item.description
            }
          </p>
        )}

        {/* ACTION */}

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={
              isUnavailable
            }
            className={`group/button flex min-h-11 w-full items-center justify-between border px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] outline-none transition focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${
              isAdded
                ? "border-secondary bg-secondary text-white"
                : "border-foreground/25 bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            <span>
              {isUnavailable
                ? "Unavailable"
                : isAdded
                  ? "Added to Cart"
                  : "Add to Cart"}
            </span>

            {!isUnavailable && (
              <span
                className={`text-lg transition-transform ${
                  !prefersReducedMotion
                    ? "group-hover/button:translate-x-1"
                    : ""
                }`}
              >
                {isAdded
                  ? "✓"
                  : "+"}
              </span>
            )}
          </button>

          <span
            className="sr-only"
            aria-live="polite"
          >
            {isAdded
              ? `${item.name} added to cart`
              : ""}
          </span>
        </div>
      </div>
    </article>
  );
}