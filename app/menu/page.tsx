import { getMenuItems } from "@/features/menu/actions/getMenuItems";
import MenuGrid from "@/features/menu/components/MenuGrid";

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return (
    <main className="bg-background px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Khans Food
          </p>

          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Our Menu
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/60 sm:text-lg sm:leading-8">
            Freshly prepared favorites made to order. Browse by category and add items to your cart in a tap.
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <MenuGrid items={menuItems} />
        </div>
      </div>
    </main>
  );
}