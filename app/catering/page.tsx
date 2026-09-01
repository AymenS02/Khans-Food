import { getPublicCateringCatalog } from "@/features/catering/services/getPublicCateringCatalog";
import Image from "next/image";
import Link from "next/link";

export default async function CateringPage() {
  const {
    packages,
    items,
  } =
    await getPublicCateringCatalog();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Khans Food
        </p>

        <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
          Catering for Events of Any Size
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/60 sm:text-lg sm:leading-8">
          Choose a ready-to-book package or build your own request from our catering menu.
          We review every request before approval so your event details are confirmed accurately.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#catering-packages"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Explore Packages
          </Link>
          <Link
            href="/catering/custom"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-3 font-semibold text-foreground transition hover:bg-background"
          >
            Build Custom Request
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
          How Catering Works
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Request", "Quote & Review", "Approval", "Payment"].map((step, index) => (
            <article
              key={step}
              className="rounded-2xl border border-black/10 bg-background p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Step {index + 1}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {step}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="catering-packages" className="mt-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Catering Packages
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Pre-Built Options
          </h2>
          <p className="mt-3 text-foreground/60">
            Ready-made package combinations with transparent pricing and guest guidance.
          </p>
        </div>

        {packages.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            <p className="text-foreground/60">
              No catering packages are currently available.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((cateringPackage) => (
              <article
                key={cateringPackage.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                  {cateringPackage.image ? (
                    <Image
                      src={cateringPackage.image}
                      alt={cateringPackage.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-300 motion-safe:group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-foreground/40">
                      No package image available
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-foreground">
                    {cateringPackage.name}
                  </h3>

                  {cateringPackage.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/60">
                      {cateringPackage.description}
                    </p>
                  )}

                  {(cateringPackage.minimumGuests || cateringPackage.maximumGuests) && (
                    <p className="mt-4 text-sm font-medium text-foreground/70">
                      {formatGuestRange(cateringPackage.minimumGuests, cateringPackage.maximumGuests)}
                    </p>
                  )}

                  {cateringPackage.items.length > 0 && (
                    <p className="mt-3 text-xs text-foreground/50">
                      Includes {cateringPackage.items.length} menu item
                      {cateringPackage.items.length === 1 ? "" : "s"}
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <p className="text-2xl font-bold text-primary">
                      ${cateringPackage.price.toFixed(2)}
                      {cateringPackage.pricingType === "per_person" && (
                        <span className="ml-1 text-sm font-medium text-foreground/50">
                          / person
                        </span>
                      )}
                    </p>

                    <Link
                      href={`/catering/${cateringPackage.slug}`}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white transition hover:opacity-90"
                    >
                      View Package
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Custom Catering
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Build Your Own Selection
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/60">
            Select individual catering items and request a tailored quote for your event.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            <p className="text-foreground/60">
              No custom catering items are currently available.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-foreground/40">
                        No item image available
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {item.category && (
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                        {item.category}
                      </p>
                    )}
                    <h3 className="mt-2 text-lg font-bold text-foreground">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/60">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-3 text-base font-bold text-primary">
                      ${item.price.toFixed(2)}
                      <span className="ml-1 text-xs font-medium text-foreground/50">
                        {item.pricingType === "per_person" ? "/ person" : "/ item"}
                      </span>
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <Link
              href="/catering/custom"
              className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white transition hover:opacity-90 sm:w-auto"
            >
              Build a Custom Catering Request
            </Link>
          </>
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