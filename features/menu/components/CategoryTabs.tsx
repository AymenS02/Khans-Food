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
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 border-b border-black/10 pb-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white text-foreground hover:bg-primary/10"
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