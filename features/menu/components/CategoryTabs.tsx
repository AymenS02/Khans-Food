"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (
    category: string
  ) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const tabsRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    showRightFade,
    setShowRightFade,
  ] = useState(false);

  useEffect(() => {
    const container =
      tabsRef.current;

    if (!container) return;

    const updateFade = () => {
      const hasOverflow =
        container.scrollWidth >
        container.clientWidth;

      const isAtEnd =
        container.scrollLeft +
          container.clientWidth >=
        container.scrollWidth - 1;

      setShowRightFade(
        hasOverflow && !isAtEnd
      );
    };

    updateFade();

    container.addEventListener(
      "scroll",
      updateFade
    );

    window.addEventListener(
      "resize",
      updateFade
    );

    return () => {
      container.removeEventListener(
        "scroll",
        updateFade
      );

      window.removeEventListener(
        "resize",
        updateFade
      );
    };
  }, [categories]);

  return (
    <div className="relative w-full">
      {/* Scroll container */}
      <div
        ref={tabsRef}
        className="w-full overflow-x-auto scrollbar-hide"
      >
        <div className="flex w-max items-center gap-1 px-1">
          {categories.map(
            (category) => {
              const isActive =
                category ===
                activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    onCategoryChange(
                      category
                    )
                  }
                  className={`relative min-h-10 shrink-0 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {category}

                  <span
                    className={`absolute bottom-0 left-4 right-4 h-px transition ${
                      isActive
                        ? "bg-primary"
                        : "bg-transparent"
                    }`}
                  />
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Dynamic right fade */}
      {showRightFade && (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent" />
      )}
    </div>
  );
}