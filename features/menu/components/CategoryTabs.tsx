"use client";

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
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div className="flex min-w-max items-center gap-1">
        {categories.map(
          (category) => {
            const isActive =
              category ===
              activeCategory;

            return (
              <button
                key={
                  category
                }
                type="button"
                onClick={() =>
                  onCategoryChange(
                    category
                  )
                }
                className={`relative min-h-10 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {
                  category
                }

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
  );
}