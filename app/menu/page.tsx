import { getMenuItems } from "@/features/menu/actions/getMenuItems";
import MenuGrid from "@/features/menu/components/MenuGrid";

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <main className="bg-background px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Khans Food
          </p>

          <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">
            Our Menu
          </h1>

          <p className="mt-5 text-lg leading-8 text-foreground/60">
            Browse our selection of freshly prepared dishes.
          </p>
        </div>

        {/* Menu */}
        <div className="mt-10">
          <MenuGrid items={menuItems} />
        </div>

      </div>
    </main>
  );
}