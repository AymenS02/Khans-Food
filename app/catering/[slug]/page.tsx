import Link from "next/link";
import Image from "next/image";
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
  const { slug } = await params;

  const cateringPackage =
    await getPublicCateringPackageBySlug(
      slug
    );

  if (!cateringPackage) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <Link
        href="/catering"
        className="text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Catering
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Package Information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {/* Package Image */}

          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-black/5">
            {cateringPackage.image ? (
              <Image
                src={cateringPackage.image}
                alt={cateringPackage.name}
                fill
                sizes="
                  (max-width: 1024px) 100vw,
                  700px
                "
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <span className="text-sm font-medium text-foreground/40">
                  No package image available
                </span>
              </div>
            )}
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Catering Package
          </p>

          <h1 className="mt-2 text-4xl font-bold text-foreground">
            {cateringPackage.name}
          </h1>

          {cateringPackage.description && (
            <p className="mt-4 text-lg leading-8 text-foreground/60">
              {
                cateringPackage.description
              }
            </p>
          )}

          {/* Guest Range */}
          <section className="mt-8 border-t border-black/10 pt-6">
            <h2 className="text-xl font-bold text-foreground">
              Guest Count
            </h2>

            <p className="mt-3 text-foreground/70">
              {formatGuestRange(
                cateringPackage.minimumGuests,
                cateringPackage.maximumGuests
              )}
            </p>
          </section>

          {/* Included Items */}
          <section className="mt-6 border-t border-black/10 pt-6">
            <h2 className="text-xl font-bold text-foreground">
              Package Includes
            </h2>

            {cateringPackage.items.length ===
            0 ? (
              <p className="mt-3 text-foreground/60">
                Package contents will be
                confirmed with your
                catering request.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {cateringPackage.items.map(
                  (item, index) => (
                    <li
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between rounded-xl bg-background px-4 py-3"
                    >
                      <span className="font-medium">
                        {item.name}
                      </span>

                      {item.quantity > 1 && (
                        <span className="text-sm font-semibold text-foreground/50">
                          × {item.quantity}
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </section>
        </div>

        {/* Package Summary */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-foreground/50">
            {cateringPackage.pricingType ===
            "per_person"
              ? "Price per person"
              : "Package price"}
          </p>

          <p className="mt-1 text-3xl font-bold text-primary">
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

          <div className="mt-6 rounded-xl bg-background p-4">
            <p className="text-sm text-foreground/60">
              Select your event date,
              guest count and contact
              information to submit a
              catering request.
            </p>
          </div>

          <div className="mt-6 border-t border-black/10 pt-6">
            <h2 className="text-xl font-bold text-foreground">
              Request This Package
            </h2>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
              Enter your event information below.
              No payment is required until your
              request is reviewed and approved.
            </p>

            <div className="mt-5">
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
    </main>
  );
}

function formatGuestRange(
  minimum?: number,
  maximum?: number
) {
  if (minimum && maximum) {
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