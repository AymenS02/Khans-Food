import Link from "next/link";

import { getAdminCateringItems } from "@/actions/catering/getAdminCateringItems";

import { getAdminCateringPackages } from "@/actions/catering/getAdminCateringPackages";

import CateringPackageCreateForm from "@/features/catering/components/admin/CateringPackageCreateForm";

import CateringPackageRowActions from "@/features/catering/components/admin/CateringPackageRowActions";

export default async function AdminCateringPackagesPage() {
  const [
    cateringItems,
    packages,
  ] =
    await Promise.all([
      getAdminCateringItems(),
      getAdminCateringPackages(),
    ]);

  /*
   * For now only currently available items
   * may be added to new packages.
   */
  const availableItems =
    cateringItems
      .filter(
        (item) =>
          item.available
      )
      .map(
        (item) => ({
          id:
            item.id,

          name:
            item.name,

          price:
            item.price,

          pricingType:
            item.pricingType,
        })
      );
  
  const editableItems =
    cateringItems.map(
      (item) => ({
        id:
          item.id,

        name:
          item.name,
      })
    );

  return (
    <main className="space-y-8">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Catering Management
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Catering Packages
          </h1>

          <p className="mt-2 text-foreground/60">
            Build customer-facing
            packages from your catering
            items.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/catering/items"
            className="font-semibold text-primary hover:underline"
          >
            Catering Items
          </Link>

          <Link
            href="/admin/catering"
            className="font-semibold text-primary hover:underline"
          >
            Catering Requests
          </Link>
        </div>
      </div>

      {/* Create */}

      <CateringPackageCreateForm
        cateringItems={
          availableItems
        }
      />

      {/* Existing packages */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">
            Existing Packages
          </h2>

          <span className="text-sm text-foreground/50">
            {
              packages.length
            }{" "}
            total
          </span>
        </div>

        {packages.length ===
        0 ? (
          <div className="mt-6 rounded-xl bg-background p-6 text-center">
            <p className="text-foreground/60">
              No catering packages have
              been created yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {packages.map(
              (pkg) => (
                <article
                  key={
                    pkg.id
                  }
                  className="rounded-xl border border-black/10 p-5"
                >
                  {pkg.image && (
                    <div className="mb-5 overflow-hidden rounded-xl">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold">
                          {
                            pkg.name
                          }
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            pkg.available
                              ? "bg-secondary/10"
                              : "bg-background text-foreground/50"
                          }`}
                        >
                          {pkg.available
                            ? "Available"
                            : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-1 font-mono text-xs text-foreground/40">
                        {
                          pkg.slug
                        }
                      </p>

                      {pkg.description && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/60">
                          {
                            pkg.description
                          }
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 sm:text-right">
                      <p className="text-xl font-bold text-primary">
                        $
                        {pkg.price.toFixed(
                          2
                        )}
                      </p>

                      <p className="mt-1 text-xs text-foreground/50">
                        {pkg.pricingType ===
                        "per_person"
                          ? "per person"
                          : "flat package price"}
                      </p>
                    </div>
                  </div>

                  {/* Guest limits */}

                  <div className="mt-5 flex flex-wrap gap-5 text-sm">
                    <div>
                      <span className="text-foreground/50">
                        Guests:
                      </span>{" "}
                      <strong>
                        {pkg.minimumGuests !==
                        undefined
                          ? pkg.maximumGuests !==
                            undefined
                            ? `${pkg.minimumGuests}–${pkg.maximumGuests}`
                            : `${pkg.minimumGuests}+`
                          : pkg.maximumGuests !==
                              undefined
                            ? `Up to ${pkg.maximumGuests}`
                            : "No limit"}
                      </strong>
                    </div>

                    <div>
                      <span className="text-foreground/50">
                        Display order:
                      </span>{" "}
                      <strong>
                        {
                          pkg.displayOrder
                        }
                      </strong>
                    </div>
                  </div>

                  {/* Included items */}

                  <div className="mt-5 border-t border-black/10 pt-5">
                    <p className="text-sm font-semibold">
                      Includes
                    </p>

                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {pkg.items.map(
                        (
                          item,
                          index
                        ) => (
                          <li
                            key={`${item.cateringItem}-${index}`}
                            className="rounded-lg bg-background px-3 py-2 text-sm"
                          >
                            <strong>
                              {
                                item.quantity
                              }
                              ×
                            </strong>{" "}
                            {
                              item.name
                            }
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Package actions */}

                  <div className="mt-5 border-t border-black/10 pt-5">
                    <CateringPackageRowActions
                      pkg={pkg}
                      cateringItems={
                        editableItems
                      }
                    />
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}