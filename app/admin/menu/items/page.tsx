import Link from "next/link";

import MenuItemCreateForm from "@/features/menu/components/admin/MenuItemCreateForm";

import { getAdminCategories } from "@/actions/menu/getAdminCategories";
import { getAdminMenuItems } from "@/actions/menu/getAdminMenuItems";

export default async function AdminMenuItemsPage() {
  const [
    categories,
    items,
  ] =
    await Promise.all([
      getAdminCategories(),
      getAdminMenuItems(),
    ]);

  return (
    <main className="space-y-8">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Menu Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Menu Items
          </h1>

          <p className="mt-2 text-foreground/60">
            Manage the food and
            products customers can
            order.
          </p>
        </div>

        <Link
          href="/admin/menu/categories"
          className="font-semibold text-primary hover:underline"
        >
          Manage Categories →
        </Link>
      </div>

      {/* Create */}

      <MenuItemCreateForm
        categories={
          categories
        }
      />

      {/* Existing */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">
            Existing Menu Items
          </h2>

          <span className="text-sm text-foreground/50">
            {items.length} total
          </span>
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-xl bg-background p-6 text-center">
            <p className="text-foreground/60">
              No menu items have
              been created yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
            {/* Desktop header */}

            <div className="hidden grid-cols-[2fr_1fr_1fr_.7fr_.7fr] gap-4 bg-background px-4 py-3 text-sm font-semibold text-foreground/60 md:grid">
              <span>
                Item
              </span>

              <span>
                Category
              </span>

              <span>
                Price
              </span>

              <span>
                Order
              </span>

              <span>
                Status
              </span>
            </div>

            {items.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="grid gap-4 border-t border-black/10 px-4 py-5 first:border-t-0 md:grid-cols-[2fr_1fr_1fr_.7fr_.7fr] md:items-center"
                >
                  {/* Item */}

                  <div>
                    <p className="font-semibold">
                      {
                        item.name
                      }
                    </p>

                    <p className="mt-1 font-mono text-xs text-foreground/40">
                      {
                        item.slug
                      }
                    </p>

                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-foreground/60">
                        {
                          item.description
                        }
                      </p>
                    )}
                  </div>

                  {/* Category */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Category
                    </p>

                    <p className="mt-1 text-sm md:mt-0">
                      {
                        item
                          .category
                          .name
                      }
                    </p>
                  </div>

                  {/* Price */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Price
                    </p>

                    <p className="mt-1 font-semibold md:mt-0">
                      $
                      {item.price.toFixed(
                        2
                      )}
                    </p>
                  </div>

                  {/* Order */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Order
                    </p>

                    <p className="mt-1 text-sm md:mt-0">
                      {
                        item.displayOrder
                      }
                    </p>
                  </div>

                  {/* Availability */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold md:mt-0 ${
                        item.available
                          ? "bg-secondary/10 text-foreground"
                          : "bg-background text-foreground/50"
                      }`}
                    >
                      {item.available
                        ? "Available"
                        : "Hidden"}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}