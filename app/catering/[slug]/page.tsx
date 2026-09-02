import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import PackageCateringRequestForm from "@/features/catering/components/PackageCateringRequestForm";
import { getPublicCateringPackageBySlug } from "@/features/catering/services/getPublicCateringPackageBySlug";

interface CateringPackagePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CateringPackagePage({
  params,
}: CateringPackagePageProps) {
  const { slug } =
    await params;

  const cateringPackage =
    await getPublicCateringPackageBySlug(
      slug
    );

  if (!cateringPackage) {
    notFound();
  }

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Link
          href="/catering"
          className="group inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50 transition hover:text-primary"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back to Catering
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          {/* TEXT */}

          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Catering Package
            </p>

            <h1 className="mt-4 font-rye text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {cateringPackage.name}
            </h1>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px w-16 bg-foreground/25" />

              <span className="text-xs text-primary">
                ◆
              </span>

              <div className="h-px w-16 bg-foreground/25" />
            </div>

            {cateringPackage.description && (
              <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7">
                {
                  cateringPackage.description
                }
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-8 border-t border-foreground/15 pt-7">
              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Price
                </p>

                <p className="mt-2 font-rye text-3xl text-primary">
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

              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Guests
                </p>

                <p className="mt-2 font-rye text-xl text-foreground">
                  {formatGuestRange(
                    cateringPackage.minimumGuests,
                    cateringPackage.maximumGuests
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* IMAGE */}

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full border border-primary/25" />

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
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <span className="font-sans text-sm text-foreground/40">
                    No package image
                    available
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CONTENT
      ========================================= */}

      <section className="border-t border-foreground/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_360px] lg:gap-16 lg:px-12 lg:py-24">
          {/* =====================================
              INCLUDED ITEMS
          ===================================== */}

          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              What&apos;s Included
            </p>

            <h2 className="mt-3 font-rye text-3xl text-foreground sm:text-4xl">
              Built for the Table
            </h2>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px w-14 bg-foreground/25" />

              <span className="text-xs text-primary">
                ◆
              </span>
            </div>

            {cateringPackage.items.length ===
            0 ? (
              <div className="border-y border-foreground/15 py-8">
                <p className="max-w-xl font-sans text-sm leading-6 text-foreground/55">
                  Package contents will
                  be confirmed with your
                  catering request.
                </p>
              </div>
            ) : (
              <ul className="border-t border-foreground/15">
                {cateringPackage.items.map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={`${item.name}-${index}`}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-foreground/15 py-5"
                    >
                      <span className="font-sans text-[10px] font-bold text-primary">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="font-rye text-lg text-foreground sm:text-xl">
                        {item.name}
                      </span>

                      {item.quantity >
                        1 && (
                        <span className="font-sans text-xs font-semibold text-foreground/45">
                          ×{" "}
                          {
                            item.quantity
                          }
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}

            {/* ===================================
                PACKAGE NOTES
            =================================== */}

            <div className="mt-12 grid gap-6 border-y border-foreground/15 py-8 sm:grid-cols-2">
              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Pricing Type
                </p>

                <p className="mt-2 font-sans text-sm font-semibold capitalize">
                  {cateringPackage.pricingType ===
                  "per_person"
                    ? "Per person"
                    : "Package price"}
                </p>
              </div>

              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                  Guest Range
                </p>

                <p className="mt-2 font-sans text-sm font-semibold">
                  {formatGuestRange(
                    cateringPackage.minimumGuests,
                    cateringPackage.maximumGuests
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* =====================================
              REQUEST PANEL
          ===================================== */}

          <aside className="h-fit bg-foreground text-background lg:sticky lg:top-28">
            <div className="p-6 sm:p-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Request This Package
              </p>

              <h2 className="mt-3 font-rye text-3xl">
                Start Your Request
              </h2>

              <div className="my-6 h-px bg-background/15" />

              {/* PRICE */}

              <div>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  {cateringPackage.pricingType ===
                  "per_person"
                    ? "Price Per Person"
                    : "Package Price"}
                </p>

                <p className="mt-2 font-rye text-4xl text-primary">
                  $
                  {cateringPackage.price.toFixed(
                    2
                  )}

                  {cateringPackage.pricingType ===
                    "per_person" && (
                    <span className="ml-1 font-sans text-xs font-medium text-background/45">
                      / person
                    </span>
                  )}
                </p>
              </div>

              {/* GUEST RANGE */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-background/40">
                  Guest Count
                </p>

                <p className="mt-2 font-sans text-sm font-semibold">
                  {formatGuestRange(
                    cateringPackage.minimumGuests,
                    cateringPackage.maximumGuests
                  )}
                </p>
              </div>

              {/* INFO */}

              <div className="mt-6 border-t border-background/15 pt-5">
                <p className="font-sans text-xs leading-5 text-background/55">
                  Enter your event
                  date, guest count,
                  and contact details
                  below to send your
                  request for review.
                </p>

                <p className="mt-3 font-sans text-xs leading-5 text-background/40">
                  No payment is
                  required until your
                  request is reviewed
                  and approved.
                </p>
              </div>

              {/* FORM */}

              <div className="mt-7 border-t border-background/15 pt-6">
                <PackageCateringRequestForm
                  packageId={
                    cateringPackage.id
                  }
                  minimumGuests={
                    cateringPackage.minimumGuests
                  }
                  maximumGuests={
                    cateringPackage.maximumGuests
                  }
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* =========================================
          BOTTOM CTA
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="border-t border-foreground/15 pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Want Something Different?
              </p>

              <h2 className="mt-2 font-rye text-2xl sm:text-3xl">
                Build Your Own Feast.
              </h2>
            </div>

            <Link
              href="/catering/custom"
              className="group flex min-h-12 w-full items-center justify-between border border-foreground/20 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-foreground hover:text-background sm:w-auto sm:min-w-[220px]"
            >
              Custom Catering

              <span className="ml-5 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
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

  return "Flexible guest count";
}