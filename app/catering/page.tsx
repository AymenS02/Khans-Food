import { getPublicCateringCatalog } from "@/features/catering/services/getPublicCateringCatalog";
import Link from "next/link";

export default async function CateringPage() {
  const {
    packages,
    items,
  } =
    await getPublicCateringCatalog();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      {/* Header */}
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Khans Food
        </p>

        <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">
          Catering
        </h1>

        <p className="mt-4 text-lg leading-8 text-foreground/60">
          Choose one of our catering
          packages or build a custom
          catering request for your event.
        </p>
      </section>

      {/* Packages */}
      <section className="mt-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Packages
          </p>

          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Catering Packages
          </h2>

          <p className="mt-3 text-foreground/60">
            Pre-built packages for an
            easier catering experience.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-foreground/60">
              No catering packages are
              currently available.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map(
              (cateringPackage) => (
                <article
                  key={
                    cateringPackage.id
                  }
                  className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {
                        cateringPackage.name
                      }
                    </h3>

                    {cateringPackage.description && (
                      <p className="mt-3 leading-7 text-foreground/60">
                        {
                          cateringPackage.description
                        }
                      </p>
                    )}
                  </div>

                  {/* Guest range */}
                  {(cateringPackage.minimumGuests ||
                    cateringPackage.maximumGuests) && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-foreground/50">
                        Guest Count
                      </p>

                      <p className="mt-1 font-medium">
                        {formatGuestRange(
                          cateringPackage.minimumGuests,
                          cateringPackage.maximumGuests
                        )}
                      </p>
                    </div>
                  )}

                  {/* Included items */}
                  {cateringPackage.items.length >
                    0 && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-foreground/50">
                        Includes
                      </p>

                      <ul className="mt-3 space-y-2">
                        {cateringPackage.items.map(
                          (
                            item,
                            index
                          ) => (
                            <li
                              key={`${item.name}-${index}`}
                              className="text-sm text-foreground/70"
                            >
                              {item.quantity >
                                1 &&
                                `${item.quantity} × `}

                              {item.name}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-auto pt-8">
                    <p className="text-sm text-foreground/50">
                      Starting at
                    </p>

                    <p className="mt-1 text-2xl font-bold text-primary">
                      $
                      {cateringPackage.price.toFixed(
                        2
                      )}

                      {cateringPackage.pricingType ===
                        "per_person" && (
                        <span className="ml-1 text-sm font-medium text-foreground/50">
                          / person
                        </span>
                      )}
                    </p>

                    <Link
                      href={`/catering/package/${cateringPackage.slug}`}
                      className="mt-5 block rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white transition hover:opacity-90"
                    >
                      View Package
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {/* Custom Catering */}
      <section className="mt-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Custom Catering
          </p>

          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Build Your Own
          </h2>

          <p className="mt-3 max-w-2xl text-foreground/60">
            Looking for something more
            specific? Build a custom
            catering request from our
            available selections.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-foreground/60">
              No custom catering items are
              currently available.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                {item.category && (
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                    {item.category}
                  </p>
                )}

                <h3 className="mt-2 text-xl font-bold text-foreground">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="mt-3 leading-6 text-foreground/60">
                    {item.description}
                  </p>
                )}

                <div className="mt-5">
                  <span className="text-xl font-bold text-primary">
                    $
                    {item.price.toFixed(
                      2
                    )}
                  </span>

                  {item.pricingType ===
                    "per_person" && (
                    <span className="ml-1 text-sm text-foreground/50">
                      / person
                    </span>
                  )}

                  {item.pricingType ===
                    "flat" && (
                    <span className="ml-1 text-sm text-foreground/50">
                      / item
                    </span>
                  )}
                </div>

                {item.minimumQuantity && (
                  <p className="mt-2 text-xs text-foreground/50">
                    Minimum quantity:{" "}
                    {
                      item.minimumQuantity
                    }
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <Link
            href="/catering/custom"
            className="mt-8 block rounded-2xl bg-primary p-6 text-center font-semibold text-white transition hover:opacity-90"
          >
            Build a Custom Catering Request
          </Link>
        )}
      </section>
    </main>
  );
}

function formatGuestRange(
  minimum?: number,
  maximum?: number
) {
  if (
    minimum &&
    maximum
  ) {
    return `${minimum}–${maximum} guests`;
  }

  if (minimum) {
    return `${minimum}+ guests`;
  }

  if (maximum) {
    return `Up to ${maximum} guests`;
  }

  return "Flexible";
}