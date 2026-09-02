import { getMenuItems } from "@/features/menu/actions/getMenuItems";
import MenuGrid from "@/features/menu/components/MenuGrid";

export default async function MenuPage() {
  const menuItems =
    await getMenuItems();

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="max-w-4xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            Khans Food
          </p>

          <h1 className="mt-5 font-rye text-5xl leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Made Fresh.
            <br />
            Made to Share.
          </h1>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px w-20 bg-foreground/30" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-20 bg-foreground/30" />
          </div>

          <p className="max-w-2xl font-sans text-base leading-7 text-foreground/60 sm:text-lg sm:leading-8">
            Explore our menu of
            freshly prepared favourites,
            bold flavours, and dishes
            made for sharing.
          </p>
        </div>
      </section>

      {/* =========================================
          MENU
      ========================================= */}

      <section className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <MenuGrid
            items={menuItems}
          />
        </div>
      </section>
    </main>
  );
}