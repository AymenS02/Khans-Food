"use client";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div className="flex min-w-max gap-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-black/10 bg-background text-foreground hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}