import Link from "next/link";

import { getPublicCateringItems } from "@/features/catering/services/getPublicCateringItems";
import CustomCateringBuilder from "@/features/catering/components/CustomCateringBuilder";

export default async function CustomCateringPage() {
  const items =
    await getPublicCateringItems();

  return (
    <main className="overflow-hidden">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <Link
          href="/catering"
          className="group inline-flex min-h-10 items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back to Catering
        </Link>

        <div className="mt-10 grid gap-10 border-b border-foreground/15 pb-14 sm:mt-12 sm:pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
          {/* LEFT */}

          <div className="max-w-4xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:tracking-[0.35em]">
              Custom Catering
            </p>

            <h1 className="mt-4 font-rye text-4xl leading-[1.1] text-foreground sm:mt-5 sm:text-6xl lg:text-7xl">
              Build Your
              <br />
              Perfect Feast.
            </h1>

            <div className="my-7 flex items-center gap-3 sm:my-8">
              <div className="h-px w-14 bg-foreground/25 sm:w-20" />

              <span className="text-xs text-primary">
                ◆
              </span>

              <div className="h-px w-14 bg-foreground/25 sm:w-20" />
            </div>

            <p className="max-w-2xl font-sans text-sm leading-6 text-foreground/55 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              Choose the dishes you want,
              set your quantities, then
              tell us about your event.
              We&apos;ll review everything
              and confirm your final
              pricing.
            </p>
          </div>

          {/* SMALL HERO DETAIL */}

          <div className="hidden lg:block">
            <div className="border-l border-foreground/15 pl-8">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                Your Menu
              </p>

              <p className="mt-2 font-rye text-3xl text-primary">
                {items.length}
              </p>

              <p className="mt-1 max-w-[160px] font-sans text-xs leading-5 text-foreground/45">
                catering{" "}
                {items.length === 1
                  ? "item"
                  : "items"}{" "}
                available to choose from
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          INTRO STRIP
      ========================================= */}

      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl divide-y divide-background/15 px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
          <BuilderStep
            number="01"
            title="Choose"
            description="Select the dishes you want for your event."
          />

          <BuilderStep
            number="02"
            title="Customize"
            description="Set guest count and quantities to fit your gathering."
          />

          <BuilderStep
            number="03"
            title="Request"
            description="Send your event details for review and final pricing."
          />
        </div>
      </section>

      {/* =========================================
          BUILDER
      ========================================= */}

      <section className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          {items.length === 0 ? (
            /* =====================================
               EMPTY STATE
            ===================================== */

            <div className="border-y border-foreground/15 py-16 text-center sm:py-20">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Catering Menu
              </p>

              <h2 className="mt-4 font-rye text-3xl text-foreground sm:text-4xl">
                Nothing on the Table Yet
              </h2>

              <div className="mx-auto my-6 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-foreground/20" />

                <span className="text-xs text-primary">
                  ◆
                </span>

                <div className="h-px w-12 bg-foreground/20" />
              </div>

              <p className="mx-auto max-w-lg font-sans text-sm leading-6 text-foreground/50">
                No custom catering items
                are currently available.
                Check back soon or browse
                our catering packages.
              </p>

              <Link
                href="/catering"
                className="group mx-auto mt-8 flex min-h-12 w-full max-w-xs items-center justify-between border border-foreground/20 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-foreground hover:text-background"
              >
                View Catering

                <span className="text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ) : (
            <CustomCateringBuilder
              items={items}
            />
          )}
        </div>
      </section>
    </main>
  );
}

/* =============================================
   BUILDER STEP
============================================= */

function BuilderStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="px-2 py-8 sm:px-5 sm:py-10 md:px-7">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
        {number}
      </p>

      <h2 className="mt-3 font-rye text-xl text-background sm:text-2xl">
        {title}
      </h2>

      <p className="mt-2 max-w-xs font-sans text-xs leading-5 text-background/50 sm:text-sm sm:leading-6">
        {description}
      </p>
    </div>
  );
}