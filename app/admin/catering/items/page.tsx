import Link from "next/link";

import CateringItemCreateForm from "@/features/catering/components/admin/CateringItemCreateForm";
import CateringItemRowActions from "@/features/catering/components/admin/CateringItemRowActions";

import { getAdminCateringItems } from "@/actions/catering/getAdminCateringItems";

export default async function AdminCateringItemsPage() {
  const items =
    await getAdminCateringItems();

  return (
    <main className="space-y-8">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Catering Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Catering Items
          </h1>

          <p className="mt-2 text-foreground/60">
            Manage individual
            catering offerings used
            for custom requests and
            packages.
          </p>
        </div>

        <Link
          href="/admin/catering"
          className="font-semibold text-primary hover:underline"
        >
          ← Catering Requests
        </Link>
      </div>

      {/* ==========================================
          CREATE ITEM
      ========================================== */}

      <CateringItemCreateForm />

      {/* ==========================================
          EXISTING ITEMS
      ========================================== */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-foreground">
            Existing Catering Items
          </h2>

          <span className="text-sm text-foreground/50">
            {items.length} total
          </span>
        </div>

        {items.length === 0 ? (
          /*
           * ======================================
           * EMPTY STATE
           * ======================================
           */
          <div className="mt-6 rounded-xl bg-background p-6 text-center">
            <p className="text-foreground/60">
              No catering items have
              been created yet.
            </p>
          </div>
        ) : (
          /*
           * ======================================
           * ITEMS TABLE
           * ======================================
           */
          <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
            {/* Desktop headings */}

            <div className="hidden grid-cols-[1.5fr_1fr_1fr_.6fr_.7fr_1.5fr] gap-4 bg-background px-4 py-3 text-sm font-semibold text-foreground/60 md:grid">
              <span>
                Item
              </span>

              <span>
                Category
              </span>

              <span>
                Pricing
              </span>

              <span>
                Order
              </span>

              <span>
                Status
              </span>

              <span>
                Actions
              </span>
            </div>

            {/* Items */}

            {items.map(
              (item) => (
                <div
                  key={item.id}
                  className="grid gap-4 border-t border-black/10 px-4 py-5 first:border-t-0 md:grid-cols-[1.5fr_1fr_1fr_.6fr_.7fr_1.5fr] md:items-start"
                >
                  {/* ==================================
                      ITEM
                  ================================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Item
                    </p>

                    <p className="mt-1 font-semibold md:mt-0">
                      {item.name}
                    </p>

                    <p className="mt-1 font-mono text-xs text-foreground/40">
                      {item.slug}
                    </p>

                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/60">
                        {
                          item.description
                        }
                      </p>
                    )}
                  </div>

                  {/* ==================================
                      CATEGORY
                  ================================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Category
                    </p>

                    <p className="mt-1 text-sm md:mt-0">
                      {item.category ||
                        "—"}
                    </p>
                  </div>

                  {/* ==================================
                      PRICING
                  ================================== */}

                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Pricing
                    </p>

                    <p className="mt-1 font-semibold md:mt-0">
                      $
                      {item.price.toFixed(
                        2
                      )}
                    </p>

                    <p className="mt-1 text-xs text-foreground/50">
                      {item.pricingType ===
                      "per_person"
                        ? "per person"
                        : "flat price"}
                    </p>
                  </div>

                  {/* ==================================
                      DISPLAY ORDER
                  ================================== */}

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

                  {/* ==================================
                      STATUS
                  ================================== */}

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

                  {/* ==================================
                      ACTIONS
                  ================================== */}

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-foreground/40 md:hidden">
                      Actions
                    </p>

                    <CateringItemRowActions
                      item={item}
                    />
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