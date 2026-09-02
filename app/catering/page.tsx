import Image from "next/image";
import Link from "next/link";

import { getPublicCateringCatalog } from "@/features/catering/services/getPublicCateringCatalog";

export default async function CateringPage() {
  const {
    packages,
    items,
  } =
    await getPublicCateringCatalog();

  return (
    <main className="overflow-hidden">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">

          {/* LEFT */}

          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Khans Food Catering
            </p>

            <h1 className="mt-5 max-w-3xl font-rye text-5xl leading-[1.08] text-foreground sm:text-6xl lg:text-7xl">
              Your Event.
              <br />
              Our Feast.
            </h1>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px w-20 bg-foreground/30" />

              <span className="text-xs text-primary">
                ◆
              </span>

              <div className="h-px w-20 bg-foreground/30" />
            </div>

            <p className="max-w-xl font-sans text-base leading-7 text-foreground/60 sm:text-lg sm:leading-8">
              From family gatherings
              and celebrations to large
              events, choose one of our
              catering packages or
              create a menu built around
              your occasion.
            </p>

            <div className="mt-9 flex flex-col gap-3 font-sans sm:flex-row">
              <Link
                href="#catering-packages"
                className="inline-flex min-h-12 items-center justify-center bg-foreground px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-background transition hover:opacity-85"
              >
                Explore Packages
              </Link>

              <Link
                href="/catering/custom"
                className="inline-flex min-h-12 items-center justify-center border border-foreground/30 px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition hover:bg-foreground hover:text-background"
              >
                Build Your Own
              </Link>
            </div>
          </div>

          {/* RIGHT VISUAL */}

          <div className="relative">
            <div className="absolute -left-5 -top-5 h-full w-full border border-primary/30" />

            <div className="relative aspect-[4/3] overflow-hidden bg-foreground">
              {packages[0]?.image ? (
                <Image
                  src={
                    packages[0].image
                  }
                  alt={
                    packages[0].name
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : items[0]?.image ? (
                <Image
                  src={
                    items[0].image
                  }
                  alt={
                    items[0].name
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-sans text-sm text-background/50">
                  Catering image
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 text-white">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/65">
                  Made for gathering
                </p>

                <p className="mt-1 font-rye text-2xl">
                  Food Worth Sharing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          EVENT TYPES
      ========================================= */}

      <section className="border-y border-foreground/10 bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl divide-y divide-background/15 px-5 sm:px-8 md:grid-cols-4 md:divide-x md:divide-y-0 lg:px-12">
          <Occasion
            number="01"
            title="Weddings"
          />

          <Occasion
            number="02"
            title="Family Events"
          />

          <Occasion
            number="03"
            title="Corporate"
          />

          <Occasion
            number="04"
            title="Celebrations"
          />
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            From request to table
          </p>

          <h2 className="mt-4 font-rye text-4xl text-foreground sm:text-5xl">
            How Catering Works
          </h2>

          <div className="mx-auto my-7 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-foreground/25" />

            <span className="text-xs text-primary">
              ◆
            </span>

            <div className="h-px w-16 bg-foreground/25" />
          </div>

          <p className="mx-auto max-w-2xl font-sans text-base leading-7 text-foreground/55">
            Tell us what you&apos;re
            planning. We&apos;ll review
            the details, confirm the
            menu, and make sure
            everything is ready for your
            event.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-4 md:gap-4">
          <ProcessStep
            number="01"
            title="Request"
            description="Select a package or create your own catering menu."
          />

          <ProcessStep
            number="02"
            title="Review"
            description="We review your event details, selections, and guest count."
          />

          <ProcessStep
            number="03"
            title="Approval"
            description="Your request and final pricing are confirmed."
          />

          <ProcessStep
            number="04"
            title="Payment"
            description="Complete payment and your catering order is secured."
          />
        </div>
      </section>

      {/* =========================================
          PACKAGES
      ========================================= */}

      <section
        id="catering-packages"
        className="border-y border-foreground/10 bg-foreground/[0.025]"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">

          <SectionHeader
            eyebrow="Catering Packages"
            title="Built for the Whole Table"
            description="Ready-made selections designed to make feeding your guests simple."
          />

          {packages.length ===
          0 ? (
            <div className="mt-12 border border-foreground/15 p-8 font-sans">
              <p className="text-foreground/60">
                No catering packages
                are currently available.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">

              {packages.map(
                (
                  cateringPackage,
                  index
                ) => (
                  <Link
                    key={
                      cateringPackage.id
                    }
                    href={`/catering/${cateringPackage.slug}`}
                    className="group block"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-foreground/5">
                      {cateringPackage.image ? (
                        <Image
                          src={
                            cateringPackage.image
                          }
                          alt={
                            cateringPackage.name
                          }
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition duration-700 motion-safe:group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center font-sans text-sm text-foreground/40">
                          No package
                          image available
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center bg-background font-sans text-xs font-bold">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="border-b border-foreground/15 py-6">
                      <div className="flex items-start justify-between gap-5">
                        <h3 className="font-rye text-2xl leading-tight text-foreground">
                          {
                            cateringPackage.name
                          }
                        </h3>

                        <span className="text-xl text-primary transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>

                      {cateringPackage.description && (
                        <p className="mt-3 line-clamp-3 font-sans text-sm leading-6 text-foreground/55">
                          {
                            cateringPackage.description
                          }
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2 font-sans text-xs text-foreground/65">

                        {(cateringPackage.minimumGuests ||
                          cateringPackage.maximumGuests) && (
                          <span className="border border-foreground/15 px-3 py-2">
                            {formatGuestRange(
                              cateringPackage.minimumGuests,
                              cateringPackage.maximumGuests
                            )}
                          </span>
                        )}

                        {cateringPackage.items.length >
                          0 && (
                          <span className="border border-foreground/15 px-3 py-2">
                            {
                              cateringPackage
                                .items
                                .length
                            }{" "}
                            menu{" "}
                            {cateringPackage
                              .items
                              .length ===
                            1
                              ? "item"
                              : "items"}
                          </span>
                        )}
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-5">
                        <div>
                          <p className="font-sans text-xs uppercase tracking-[0.18em] text-foreground/40">
                            Starting at
                          </p>

                          <p className="mt-1 font-rye text-2xl text-primary">
                            $
                            {cateringPackage.price.toFixed(
                              2
                            )}

                            {cateringPackage.pricingType ===
                              "per_person" && (
                              <span className="ml-1 font-sans text-xs font-medium text-foreground/45">
                                / person
                              </span>
                            )}
                          </p>
                        </div>

                        <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em]">
                          View Package
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          CUSTOM CATERING INTRO
      ========================================= */}

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-12">

          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Want something different?
            </p>

            <h2 className="mt-4 max-w-2xl font-rye text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Build the Feast
              Yourself.
            </h2>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px w-16 bg-background/25" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            <p className="max-w-xl font-sans text-base leading-7 text-background/60">
              Pick the dishes you want,
              choose quantities, tell us
              about your event, and
              submit a custom catering
              request.
            </p>
          </div>

          <div className="lg:text-right">
            <Link
              href="/catering/custom"
              className="inline-flex min-h-12 items-center justify-center bg-primary px-7 py-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-85"
            >
              Build Custom Request
              <span className="ml-3">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          CUSTOM ITEMS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">

        <SectionHeader
          eyebrow="From the catering menu"
          title="Choose Your Favourites"
          description="A preview of dishes available when building your own catering request."
        />

        {items.length === 0 ? (
          <div className="mt-12 border border-foreground/15 p-8">
            <p className="font-sans text-foreground/60">
              No custom catering items
              are currently available.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-14 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

              {items
                .slice(
                  0,
                  6
                )
                .map(
                  (
                    item,
                    index
                  ) => (
                    <article
                      key={
                        item.id
                      }
                      className="group"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-foreground/5">
                        {item.image ? (
                          <Image
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition duration-700 motion-safe:group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-4 text-center font-sans text-sm text-foreground/40">
                            No item image
                            available
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 bg-background px-3 py-2 font-sans text-xs font-bold">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>
                      </div>

                      {/* INFO */}

                      <div className="border-b border-foreground/15 py-5">

                        {item.category && (
                          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            {
                              item.category
                            }
                          </p>
                        )}

                        <div className="mt-2 flex items-start justify-between gap-4">
                          <h3 className="font-rye text-xl text-foreground sm:text-2xl">
                            {
                              item.name
                            }
                          </h3>

                          <p className="shrink-0 font-sans text-sm font-bold text-primary">
                            $
                            {item.price.toFixed(
                              2
                            )}
                          </p>
                        </div>

                        {item.description && (
                          <p className="mt-3 line-clamp-2 font-sans text-sm leading-6 text-foreground/55">
                            {
                              item.description
                            }
                          </p>
                        )}

                        <p className="mt-3 font-sans text-xs text-foreground/40">
                          {item.pricingType ===
                          "per_person"
                            ? "Priced per person"
                            : "Priced per item"}
                        </p>
                      </div>
                    </article>
                  )
                )}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/catering/custom"
                className="group inline-flex min-h-12 items-center justify-center gap-4 border border-foreground/25 px-7 py-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] transition hover:bg-foreground hover:text-background"
              >
                View Full Catering Menu

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
        <div className="relative overflow-hidden bg-primary px-6 py-16 text-center text-white sm:px-10 sm:py-20">

          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-white/10" />

          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full border border-white/10" />

          <div className="relative">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-white/65">
              Ready to start?
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl font-rye text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Give Your Guests
              Something to Remember.
            </h2>

            <div className="mx-auto my-7 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-white/40" />

              <span className="text-xs">
                ◆
              </span>

              <div className="h-px w-16 bg-white/40" />
            </div>

            <p className="mx-auto max-w-xl font-sans text-base leading-7 text-white/70">
              Choose a package or build
              your own menu and send us
              the details of your event.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 font-sans sm:flex-row">
              <Link
                href="#catering-packages"
                className="inline-flex min-h-12 items-center justify-center bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-primary transition hover:bg-white/90"
              >
                View Packages
              </Link>

              <Link
                href="/catering/custom"
                className="inline-flex min-h-12 items-center justify-center border border-white/40 px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-primary"
              >
                Build Custom
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================
   SECTION HEADER
============================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        {eyebrow}
      </p>

      <h2 className="mt-4 font-rye text-4xl leading-tight text-foreground sm:text-5xl">
        {title}
      </h2>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px w-16 bg-foreground/30" />

        <span className="text-xs text-primary">
          ◆
        </span>
      </div>

      <p className="max-w-2xl font-sans text-base leading-7 text-foreground/55">
        {description}
      </p>
    </div>
  );
}

/* =============================================
   EVENT TYPE
============================================= */

function Occasion({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="px-3 py-9 sm:px-6 sm:py-11">
      <p className="font-sans text-xs text-primary">
        {number}
      </p>

      <div className="mt-7">
        <span className="mb-3 block text-xs text-primary">
          ◆
        </span>

        <p className="font-rye text-lg sm:text-xl">
          {title}
        </p>
      </div>
    </div>
  );
}

/* =============================================
   PROCESS
============================================= */

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="relative text-center md:px-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-foreground/20 font-sans text-xs font-bold text-primary">
        {number}
      </div>

      <h3 className="mt-5 font-rye text-2xl">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-xs font-sans text-sm leading-6 text-foreground/55">
        {description}
      </p>
    </article>
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

  return "Flexible guest count";
}