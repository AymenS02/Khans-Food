import MenuCard, { MenuCardItem } from "./MenuCard";

interface MenuGridProps {
  items: MenuCardItem[];
}

export default function MenuGrid({
  items,
}: MenuGridProps) {
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}