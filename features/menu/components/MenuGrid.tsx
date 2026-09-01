"use client";

import { useMemo, useState } from "react";

import MenuCard from "./MenuCard";
import CategoryTabs from "./CategoryTabs";
import type { MenuItem } from "../types/menu";

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({
  items,
}: MenuGridProps) {
  const categories = useMemo(() => {
    const labels = new Map<string, string>();

    items.forEach((item) => {
      const label =
        item.categoryName?.trim() ||
        "Featured";
      labels.set(label, label);
    });

    return ["All", ...Array.from(labels.values())];
  }, [items]);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return items;
    }

    return items.filter(
      (item) =>
        (item.categoryName?.trim() ||
          "Featured") === activeCategory
    );
  }, [activeCategory, items]);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-foreground/60">
          No menu items found.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm sm:p-4">
        <CategoryTabs
          categories={categories}
          activeCategory={
            activeCategory
          }
          onCategoryChange={
            setActiveCategory
          }
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredItems.length}
          </span>{" "}
          item
          {filteredItems.length === 1
            ? ""
            : "s"}
        </p>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-8 text-center text-foreground/60">
          No items available in this category.
        </div>
      ) : (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}