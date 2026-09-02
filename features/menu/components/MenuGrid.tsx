"use client";

import {
  useMemo,
  useState,
} from "react";

import MenuCard from "./MenuCard";
import CategoryTabs from "./CategoryTabs";

import type { MenuItem } from "../types/menu";

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({
  items,
}: MenuGridProps) {
  const categories =
    useMemo(() => {
      const labels =
        new Map<
          string,
          string
        >();

      items.forEach(
        (item) => {
          const label =
            item.categoryName?.trim() ||
            "Featured";

          labels.set(
            label,
            label
          );
        }
      );

      return [
        "All",
        ...Array.from(
          labels.values()
        ),
      ];
    }, [items]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const filteredItems =
    useMemo(() => {
      if (
        activeCategory ===
        "All"
      ) {
        return items;
      }

      return items.filter(
        (item) =>
          (item.categoryName?.trim() ||
            "Featured") ===
          activeCategory
      );
    }, [
      activeCategory,
      items,
    ]);

  if (
    items.length === 0
  ) {
    return (
      <div className="border-y border-foreground/10 py-20 text-center">
        <p className="font-rye text-3xl text-foreground">
          The Kitchen Is Quiet
        </p>

        <p className="mt-3 font-sans text-sm text-foreground/50">
          No menu items are
          currently available.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ======================================
          CATEGORY HEADER
      ====================================== */}

      <div className="flex flex-wrap flex-col gap-7 border-b border-foreground/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            From Our Kitchen
          </p>

          <h2 className="mt-3 font-rye text-4xl text-foreground sm:text-5xl">
            Explore the Menu
          </h2>
        </div>

        <CategoryTabs
          categories={
            categories
          }
          activeCategory={
            activeCategory
          }
          onCategoryChange={
            setActiveCategory
          }
        />
      </div>

      {/* ======================================
          COUNT
      ====================================== */}

      <div className="mt-8 flex items-center justify-between">
        <p className="font-sans text-xs uppercase tracking-[0.18em] text-foreground/45">
          Showing{" "}
          <span className="font-bold text-foreground">
            {
              filteredItems.length
            }
          </span>{" "}
          item
          {filteredItems.length ===
          1
            ? ""
            : "s"}
        </p>
      </div>

      {/* ======================================
          GRID
      ====================================== */}

      {filteredItems.length ===
      0 ? (
        <div className="mt-10 border-y border-foreground/10 py-16 text-center">
          <p className="font-sans text-foreground/55">
            No items are
            available in this
            category.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(
            (item) => (
              <MenuCard
                key={
                  item._id
                }
                item={item}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}